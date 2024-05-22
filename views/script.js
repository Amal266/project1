const logInPopup = document.querySelector(".popup");
const showLogin = document.querySelector("#show-login");
const signupBtn = document.querySelector('#signup-button')
const loginBtn = document.querySelector('#signin-button')
// const usernameField;
// const passwordField;
// const emailField;

showLogin.addEventListener("click", () => {
  const isActive = logInPopup.hasAttribute('active');
  logInPopup.setAttribute('active', isActive ? 'false' : 'true');
  document.querySelector('.opacity-low').style.opacity = isActive ? 1 : 0.3;
  document.querySelector('body').style.overflow = isActive ? 'auto' : 'hidden';
});


const signUpPopup = document.querySelector(".popup-signup");
const showSignUp = document.querySelector("#show-signup");
showSignUp.addEventListener("click", () => {
  const isActive = signUpPopup.hasAttribute('active');
  signUpPopup.setAttribute('active', isActive ? 'false' : 'true');
  document.querySelector('.opacity-low').style.opacity = isActive ? 1 : 0.3;
  document.querySelector('body').style.overflow = isActive ? 'auto' : 'hidden';
  logInPopup.style.display = 'none';
});

function onChange() {
  const mypassword = document.querySelector('input[name=mypassword]');
  const rpassword = document.querySelector('input[name=rpassword]');

  if (rpassword.value === mypassword.value) {
    rpassword.setCustomValidity('');
  } else {
    rpassword.setCustomValidity('Passwords do not match');
  }
}
