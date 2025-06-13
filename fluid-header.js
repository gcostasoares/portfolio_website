;(function() {
  // ─── Simulation parameters ───
  const params = {
    SIM_RESOLUTION:      128,
    DYE_RESOLUTION:      1024,
    DENSITY_DISSIPATION: 0.995,
    VELOCITY_DISSIPATION:0.9,
    PRESSURE_ITERATIONS: 10,
    SPLAT_RADIUS:        3 / window.innerHeight,
    color: { r: 0.8, g: 0.5, b: 0.2 }
  };

  // ─── Canvas & image ───
  const canvas = document.getElementById('fluid-canvas');
  const image  = document.querySelector('.fluid-bg-wrapper .content img');

  // ─── Resize handler ───
  function resizeCanvas() {
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    params.SPLAT_RADIUS = 3 / window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // ─── WebGL setup ───
  const gl = canvas.getContext('webgl');
  gl.getExtension('OES_texture_float');
  let outputColor, velocity, divergence, pressure;
  let prevTimestamp = Date.now();

  // ─── Compile & link ───
  function createShader(src, type) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src.trim());
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }
  function createShaderProgram(vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(p));
      return null;
    }
    return p;
  }
  function getUniforms(prog) {
    const u = {}, n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
    for (let i=0; i<n; i++) {
      const info = gl.getActiveUniform(prog, i);
      u[info.name] = gl.getUniformLocation(prog, info.name);
    }
    return u;
  }
  function createProgram(id) {
    const frag = createShader(
      document.getElementById(id).textContent,
      gl.FRAGMENT_SHADER
    );
    const prog = createShaderProgram(vertexShader, frag);
    return { program: prog, uniforms: getUniforms(prog) };
  }

  // ─── Load vertex shader + programs ───
  const vertexShader = createShader(
    document.getElementById('vertShader').textContent,
    gl.VERTEX_SHADER
  );
  const splatProgram            = createProgram('fragShaderPoint');
  const divergenceProgram       = createProgram('fragShaderDivergence');
  const pressureProgram         = createProgram('fragShaderPressure');
  const gradientSubtractProgram = createProgram('fragShaderGradientSubtract');
  const advectionProgram        = createProgram('fragShaderAdvection');
  const displayProgram          = createProgram('fragShaderDisplay');

  // ─── FBO helpers ───
  function createFBO(w,h,t=gl.RGBA) {
    gl.activeTexture(gl.TEXTURE0);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S,     gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T,     gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D,0,t,w,h,0,t,gl.FLOAT,null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0,0,w,h);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { fbo, width:w, height:h, attach(i){ gl.activeTexture(gl.TEXTURE0+i); gl.bindTexture(gl.TEXTURE_2D, tex); return i; } };
  }
  function createDoubleFBO(w,h,t){
    let a=createFBO(w,h,t), b=createFBO(w,h,t);
    return { width:w, height:h, texelSizeX:1/w, texelSizeY:1/h,
             read:()=>a, write:()=>b,
             swap(){ [a,b]=[b,a]; } };
  }
  function getResolution(res) {
    let ar=gl.drawingBufferWidth/gl.drawingBufferHeight; 
    if(ar<1) ar=1/ar;
    let mn=Math.round(res), mx=Math.round(res*ar);
    return gl.drawingBufferWidth>gl.drawingBufferHeight
      ? {width:mx,height:mn}
      : {width:mn,height:mx};
  }

  function initFBOs() {
    const s = getResolution(params.SIM_RESOLUTION),
          d = getResolution(params.DYE_RESOLUTION);
    outputColor = createDoubleFBO(d.width, d.height);
    velocity    = createDoubleFBO(s.width, s.height);
    divergence  = createFBO(s.width, s.height, gl.RGB);
    pressure    = createDoubleFBO(s.width, s.height, gl.RGB);
  }

  function blit(target) {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),gl.STATIC_DRAW);
    gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(0);
    if(!target){
      gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight);
      gl.bindFramebuffer(gl.FRAMEBUFFER,null);
    } else {
      gl.viewport(0,0,target.width,target.height);
      gl.bindFramebuffer(gl.FRAMEBUFFER,target.fbo);
    }
    gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0);
  }

  // ─── Pointer & render ───
  const pointer = { x:0, y:0, dx:0, dy:0, moved:false, firstMove:false };
  setTimeout(()=>pointer.firstMove=true,3000);
  canvas.addEventListener('click',e=>{pointer.dx=10;pointer.dy=10;pointer.x=e.pageX;pointer.y=e.pageY;pointer.firstMove=true;});
  canvas.addEventListener('mousemove',e=>{pointer.moved=true;pointer.dx=5*(e.pageX-pointer.x);pointer.dy=5*(e.pageY-pointer.y);pointer.x=e.pageX;pointer.y=e.pageY;pointer.firstMove=true;});
  canvas.addEventListener('touchmove',e=>{e.preventDefault();pointer.moved=true;pointer.dx=8*(e.targetTouches[0].pageX-pointer.x);pointer.dy=8*(e.targetTouches[0].pageY-pointer.y);pointer.x=e.targetTouches[0].pageX;pointer.y=e.targetTouches[0].pageY;pointer.firstMove=true;});

  function render() {
    const dt=(Date.now()-prevTimestamp)/1000; prevTimestamp=Date.now();
    if(!pointer.firstMove){
      const t=prevTimestamp;
      const nx=(0.65+0.2*Math.cos(0.006*t)*Math.sin(0.008*t))*window.innerWidth;
      const ny=(0.5+0.12*Math.sin(0.01*t))*window.innerHeight;
      pointer.dx=10*(nx-pointer.x); pointer.dy=10*(ny-pointer.y);
      pointer.x=nx; pointer.y=ny; pointer.moved=true;
    }
    if(pointer.moved){
      pointer.moved=false;
      // velocity splat
      gl.useProgram(splatProgram.program);
      gl.uniform1i(splatProgram.uniforms.u_input_txr, velocity.read().attach(0));
      gl.uniform1f(splatProgram.uniforms.u_ratio, canvas.width/canvas.height);
      gl.uniform2f(splatProgram.uniforms.u_point, pointer.x/canvas.width,1-pointer.y/canvas.height);
      gl.uniform3f(splatProgram.uniforms.u_point_value, pointer.dx,-pointer.dy,1);
      gl.uniform1f(splatProgram.uniforms.u_point_size, params.SPLAT_RADIUS);
      blit(velocity.write()); velocity.swap();
      // dye splat
      gl.uniform1i(splatProgram.uniforms.u_input_txr, outputColor.read().attach(0));
      gl.uniform3f(splatProgram.uniforms.u_point_value,1-params.color.r,1-params.color.g,1-params.color.b);
      blit(outputColor.write()); outputColor.swap();
    }
    // divergence
    gl.useProgram(divergenceProgram.program);
    gl.uniform2f(divergenceProgram.uniforms.u_vertex_texel, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(divergenceProgram.uniforms.u_velocity_txr, velocity.read().attach(0)); blit(divergence);
    // pressure solve
    gl.useProgram(pressureProgram.program);
    gl.uniform2f(pressureProgram.uniforms.u_vertex_texel, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(pressureProgram.uniforms.u_divergence_txr, divergence.attach(0));
    for(let i=0;i<params.PRESSURE_ITERATIONS;i++){
      gl.uniform1i(pressureProgram.uniforms.u_pressure_txr, pressure.read().attach(1));
      blit(pressure.write()); pressure.swap();
    }
    // gradient subtract
    gl.useProgram(gradientSubtractProgram.program);
    gl.uniform2f(gradientSubtractProgram.uniforms.u_vertex_texel, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(gradientSubtractProgram.uniforms.u_pressure_txr, pressure.read().attach(0));
    gl.uniform1i(gradientSubtractProgram.uniforms.u_velocity_txr, velocity.read().attach(1));
    blit(velocity.write()); velocity.swap();
    // advect velocity
    gl.useProgram(advectionProgram.program);
    gl.uniform2f(advectionProgram.uniforms.u_vertex_texel, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform2f(advectionProgram.uniforms.u_output_textel, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(advectionProgram.uniforms.u_velocity_txr, velocity.read().attach(0));
    gl.uniform1i(advectionProgram.uniforms.u_input_txr, velocity.read().attach(0));
    gl.uniform1f(advectionProgram.uniforms.u_dt, dt);
    gl.uniform1f(advectionProgram.uniforms.u_dissipation, params.VELOCITY_DISSIPATION);
    blit(velocity.write()); velocity.swap();
    // advect dye
    gl.uniform2f(advectionProgram.uniforms.u_output_textel, outputColor.texelSizeX, outputColor.texelSizeY);
    gl.uniform1i(advectionProgram.uniforms.u_velocity_txr, velocity.read().attach(0));
    gl.uniform1i(advectionProgram.uniforms.u_input_txr, outputColor.read().attach(1));
    gl.uniform1f(advectionProgram.uniforms.u_dissipation, params.DENSITY_DISSIPATION);
    blit(outputColor.write()); outputColor.swap();
    // display
    gl.useProgram(displayProgram.program);
    gl.uniform1i(displayProgram.uniforms.u_output_texture, outputColor.read().attach(0)); blit();
    requestAnimationFrame(render);
  }

  initFBOs();
  render();
})();
