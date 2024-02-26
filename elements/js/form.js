export function handleFormSubmission() {
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
          function (response) {
              console.log("Email sent successfully:", response);
              kontakt.style.display = 'none';
              messageSuccess.style.display = 'flex';
          },
          function (error) {
              console.log("Email failed to send:", error);
              messageError.style.display = 'flex';
          }
      );
  }
}
