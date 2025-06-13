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

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// 2) On window.load: jump to top, fade out loader, then remove it
window.addEventListener('load', () => {
  // ensure we start at top
  window.scrollTo(0, 0);

  const loader = document.getElementById('loader');
  if (!loader) return;

  // trigger the fade
  loader.classList.add('hidden');

  // after the fade (0.6s), you could remove it entirely
  loader.addEventListener('transitionend', () => {
    loader.remove();
  }, { once: true });
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
    setErrorFor(username, 'Not a valid name');
  } else {
    setSuccessFor(username);
    nameValidation = true;
  }

  if (emailValue === '') {
    setErrorFor(email, 'Not a valid e-mail');
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

const hero     = document.querySelector('.hero');
const min      = 200;
const max      = 2000;
const duration = 2000; // ms to go from max→min

let startTime = null;

function tick(now) {
  if (startTime === null) startTime = now;
  const elapsed = now - startTime;

  if (elapsed >= duration) {
    // we've reached the end—snap to min and stop
    hero.style.setProperty('--brightness', min + '%');
    return;
  }

  // linear interpolation: val = max + (min - max) * (elapsed/duration)
  const ratio = elapsed / duration;
  const val = max + (min - max) * ratio;

  hero.style.setProperty('--brightness', val + '%');
  requestAnimationFrame(tick);
}

// kick it off
requestAnimationFrame(tick);



window.addEventListener('scroll', onScroll);
function onScroll() {
  const scrollTop = window.scrollY;
  const viewH     = window.innerHeight;
  const isLarge   = window.innerWidth > 1024;

  document
    .querySelectorAll('.case-study__background, .about-me__background, .case-separator')
    .forEach((el, idx) => {
      const elTop   = el.getBoundingClientRect().top + scrollTop;
      const elH     = el.offsetHeight;
      const trigger = elTop - viewH + elH * 0.3;

      if (el.classList.contains('case-separator')) {
        // Separator: scaleX 0→1
        el.style.transform = scrollTop >= trigger
          ? 'scaleX(1)'
          : 'scaleX(0)';
      } else {
        // Backgrounds with responsive initX
        const initX = isLarge
          ? (el.classList.contains('case-study__background')
              ? (idx % 2 === 0 ? -50 : 50)
              : 50)
          : 50;
        const initY = 50;

        el.style.transform = scrollTop >= trigger
          ? 'translate(0, 0)'
          : `translate(${initX}px, ${initY}px)`;
      }
    });
}

// initial check on load
onScroll();










/* import { handleFormSubmission } from './elements/form.js';
import { initializeHeaderAndNavigation } from './elements/header.js';
import { movingText } from "./elements/movingText.js";
import { handleScroll, handleBurgerMenu, handleTextSize, handleAnimation } from './elements/perpectiveText.js';

handleScroll();
handleBurgerMenu();
handleTextSize();
handleAnimation();


movingText();
initializeHeaderAndNavigation();
handleFormSubmission(); */

