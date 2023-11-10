const menuBtn = document.querySelector('.btn');
let menuOpen = false;

menuBtn.addEventListener('click', () => {
  if (!menuOpen) {
    menuBtn.classList.add('open');
    menuOpen = true;
  } else {
    menuBtn.classList.remove('open');
    menuOpen = false;
  }
});

const bgmenuBurger = document.getElementById("new_menu");
const menuBurger = document.getElementById("burger_menu");
const menuItems = document.getElementById("menu_items");
const items = document.getElementById("items");
let menubgOpen = false;

menuItems.style.opacity = "0%";

menuBurger.addEventListener("click", () => {
  if (!menuOpen) {
    bgmenuBurger.style.transform = "translateX(100%)";
    menuItems.style.opacity = "0%";
    menuItems.style.display = "none";
    menubgOpen = true;
  } else {
    bgmenuBurger.style.transform = "translateX(0)";
    menuItems.style.opacity = "100%";
    menuItems.style.display = "flex";
    menubgOpen = false;
  }
});

const menuLinks = document.getElementById("items");

menuLinks.addEventListener("click", () => {
	bgmenuBurger.style.transform = "translateX(100%)";
    menuItems.style.opacity = "0%";
    menuItems.style.display = "none";
	menuBtn.classList.remove('open');
    menuOpen = false;
});

window.addEventListener("scroll", function () {
  var element = document.querySelector(".perspective-text");
  var formSection = document.getElementById("form");
  var formSectionTop = formSection.offsetTop;
  var scrollPosition = window.scrollY;

  if (scrollPosition >= formSectionTop - 400) {
    element.classList.add("animate");
  } else {
    element.classList.remove("animate");
  }
});

// Smooth scrolling for menu links
const navLinks = document.querySelectorAll(".navbar a");

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const targetId = link.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

const navItems = document.querySelectorAll(".menu_items a");

navItems.forEach((item) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const targetId = link.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

const form = document.getElementById('kontakt');
const username = document.getElementById('username');
const email = document.getElementById('email');

form.addEventListener('submit', e => {
  e.preventDefault();
  checkInputs();
});

function checkInputs() {
  const usernameValue = username.value.trim();
  const emailValue = email.value.trim();

  if (usernameValue === '') {
    setErrorFor(username, 'Name ist ungültig');
  } else {
    setSuccessFor(username);
  }

  if (emailValue === '') {
    setErrorFor(email, 'Emailadresse ist ungültig');
  } else if (!isEmail(emailValue)) {
    setErrorFor(email, 'Not a valid email');
  } else {
    setSuccessFor(email);
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
}

function isEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zAZ]{2,}))$/.test(email);
}

function changeBackgroundColor(color) {
  document.body.style.backgroundColor = color;
}

window.addEventListener("scroll", () => {
  var scrollPosition = window.scrollY;
  var aboutmeSection = document.getElementById("aboutme");
  var aboutmeSectionTop = aboutmeSection.offsetTop;
  var portfolioSection = document.getElementById("portfolio");
  var portfolioSectionTop = portfolioSection.offsetTop;
  var formSection = document.getElementById("form");
  var formSectionTop = formSection.offsetTop;
  var logoElements = document.getElementsByClassName("logo");

  for (var i = 0; i < logoElements.length; i++) {
    if (scrollPosition === 0) {
      logoElements[i].style.opacity = 0; // Hide with fading effect
      logoElements[i].style.pointerEvents = "none"; // Make it unclickable
    } else {
      logoElements[i].style.opacity = 1; // Show with fading effect
      logoElements[i].style.pointerEvents = "auto"; // Make it clickable
    }
  }

 
});

var logoElementsOnLoad = document.getElementsByClassName("logo");
for (var i = 0; i < logoElementsOnLoad.length; i++) {
  logoElementsOnLoad[i].style.pointerEvents = "none";
}

function sendEmail(event) {
  event.preventDefault();


  var name = document.getElementById('username').value;
  var email = document.getElementById('email').value;
  var message = document.querySelector('.message textarea').value;

  // Use the EmailJS API to send the email
  emailjs.send("service_8ydndpo", "your_template_template_kwpvdnm", {
    to_name: name,
    from_email: email,
    message_html: message
  }).then(
    function(response) {
      console.log("Email sent successfully:", response);

    },
    function(error) {
      console.log("Email failed to send:", error);
     
    }
  );
}
