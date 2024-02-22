const header = document.querySelector('.header');
let lastScrollTop = 0;
let scrolled = false;

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {

        header.classList.remove('fixed');
        if (!scrolled) {
            header.style.visibility = 'hidden';
        }
    } else if (scrollTop < lastScrollTop && !scrolled) {
     
        header.classList.add('fixed');
        header.style.visibility = 'visible';
    }

    if (scrollTop === 0) {
     
        scrolled = false;
    }

    lastScrollTop = scrollTop;
});



const burgerElement = document.querySelector('.burger');
const navElement = document.querySelector('.overlayer'); 
const navContainer = document.querySelector('.burger__nav__container')

burgerElement.addEventListener('click', function() {
  const isExpanded = burgerElement.getAttribute('aria-expanded') === 'true'; 
  burgerElement.setAttribute('aria-expanded', !isExpanded);
  navElement.style.left = isExpanded ? '100vw' : '0';
});

navContainer.addEventListener('click', function() {
  const isExpanded = burgerElement.getAttribute('aria-expanded') === 'true'; 
  burgerElement.setAttribute('aria-expanded', !isExpanded);
  navElement.style.left = isExpanded ? '100vw' : '0';
});

const backgroundText = document.querySelector('.background-text');

window.addEventListener('scroll', function() {
    var scrollRatio = 0.5;
    const scrollFactor = (window.scrollY*scrollRatio) + 'px'; 
    backgroundText.style.setProperty('--scrollFactor', scrollFactor);

});

var textSize = document.querySelector('.perspective-text__size');
var textPerspective = document.querySelector('.perspective-text');

function textSizeFunction() {
    var windowWidth = window.innerWidth;


    var textSizeRatio = windowWidth / 1000;

    var textSizeRatioValue = textSizeRatio > 1 ? 1 : (textSizeRatio < 1 && textSizeRatio > 0.7 ? textSizeRatio : 0.7);

    textSize.style.setProperty('--textSizeRatioValue', textSizeRatioValue);
}

textSizeFunction();

window.addEventListener('resize', textSizeFunction);



var perspectiveText = document.querySelector(".perspective-text");

function activateAnimation() {
    var perspectiveTextPosition = perspectiveText.offsetTop+400;
    var scrollPosition = window.scrollY;
  


    if (scrollPosition >= perspectiveTextPosition) {
        perspectiveText.classList.add("active");
    } else {
        perspectiveText.classList.remove("active");
    }
}

window.addEventListener("scroll", activateAnimation);


const form = document.getElementById('kontakt');
const username = document.getElementById('username');
const email = document.getElementById('email');

form.addEventListener('submit', e => {
  e.preventDefault();
  checkInputs();
});

let nameValidation = false;
let emailValidation = false;
let messageValidation = false;

function checkInputs() {
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();

  if (usernameValue === '') {
    setErrorFor(username, 'Name ist ungültig');
  } else {
    setSuccessFor(username);
    nameValidation = true;
  }

  if (emailValue === '') {
    setErrorFor(email, 'Emailadresse ist ungültig');
  } else if (!isEmail(emailValue)) {
    setErrorFor(email, 'Not a valid email');
  } else {
    setSuccessFor(email);
    emailValidation = true;
  }


  if (nameValidation && emailValidation && messageValidation) {
    sendEmail();
    function sendEmail() {
      var name = document.getElementById('username').value;
      var email = document.getElementById('email').value;
      var message = document.querySelector('.message textarea').value;
      var messageSuccess = document.getElementById('message-success');
      var messageError = document.getElementById('message-error');
    
      emailjs.send("service_8ydndpo", "template_kwpvdnm", {
        from_name: name,
        from_email: email,
        message_textarea: message
      }).then(
        function(response) {
          console.log("Email sent successfully:", response);
          kontakt.style.display = 'none';
          messageSuccess.style.display = 'flex';
        },
        function(error) {
          console.log("Email failed to send:", error);
          messageError.style.display = 'flex';
        }
      );
    }
  }
}

function setErrorFor(input, message) {
  const formControl = input.parentElement;
  const small = formControl.querySelector('small');
  formControl.className = 'form-control error';
  small.innerText = message;
}

function setSuccessFor(input) {
  const formControl = input.parentElement;
  formControl.className = 'form-control success';
  messageValidation = true;
}

function isEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zAZ]{2,}))$/.test(email);
}


