export function movingText() {
    const backgroundText = document.querySelector('.background-text');

window.addEventListener('scroll', function() {
    var scrollRatio = 0.5;
    const scrollFactor = (window.scrollY*scrollRatio) + 'px'; 
    backgroundText.style.setProperty('--scrollFactor', scrollFactor);

});
}
