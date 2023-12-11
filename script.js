'use strict';

// Variables to store user input
let fullName, email, number;
let details = '';
let carModel = 'Sedan';
let features = [];
let select = 'No';
let step = 1;

// DOM elements
const buttons = document.querySelector('.buttons');
const next = document.getElementById('next');
const previous = document.getElementById('previous');
const submit = document.getElementById('submit');

//Elements for information display
const displayName = document.getElementById('displayName');
const displayEmail = document.getElementById('displayEmail');
const displayNumber = document.getElementById('displayNumber');
const displayModel = document.getElementById('displayModel');
const displayFeatures = document.getElementById('displayFeatures');
const displayTradeIn = document.getElementById('displayTradeIn');
const displayDetails = document.getElementById('displayDetails');

// Step update function
function updateStep(action) {
  const currentStep = document.querySelector(`.step${step}`);
  currentStep.classList.add('displayNone');

  step = action === 'next' ? ++step : --step;

  const nextStep = document.querySelector(`.step${step}`);
  nextStep.classList.remove('displayNone');

  // Hide "Next" button when step=4
  next.classList.toggle('displayNone', step === 4);

  // Disable the "previous" button when on the first step
  previous.disabled = step === 1;

  //display the "Submit" button when step=4
  submit.classList.toggle('displayNone', step !== 4);
}

// Event listener for "Next" button
next.addEventListener('click', function () {
  if (validateForm()) {
    updateStep('next');
    displayUserInformation();
  }
});

// Event listener for "Previous" button
previous.addEventListener('click', function () {
  updateStep('previous');
});

// Event listener for car model dropdown
const model = document.getElementById('carModel');
model.addEventListener('change', function () {
  carModel = model.value;
});

// Event listener for additional features checkboxes
const checkboxes = document.querySelectorAll(
  '.additionalFeatures input[type="checkbox"]'
);

checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function () {
    const featureName = checkbox.id;
    if (checkbox.checked && !features.includes(featureName)) {
      features.push(featureName);
    } else if (!checkbox.checked && features.includes(featureName)) {
      features = features.filter(feature => feature !== featureName);
    }
  });
});

// Event listener for trade-in radio buttons
const radio = document.querySelector('.tradeIn');
radio.addEventListener('change', function () {
  let inputValue = document.querySelector(
    'input[name="tradeIn"]:checked'
  ).value;
  select = inputValue;
});

const tradeInDetails = document.getElementById('tradeInDetails');
tradeInDetails.addEventListener('change', function () {
  details = tradeInDetails.value;
});

// Display user information
const displayUserInformation = function () {
  if (step === 4) {
    let additionalFeatures = features.map(feature =>
      feature.includes('_') ? feature.replaceAll('_', ' ') : feature
    );

    displayName.textContent = fullName;
    displayEmail.textContent = email;
    displayNumber.textContent = number;
    displayModel.textContent = carModel;

    if (additionalFeatures.length === 0) {
      additionalFeatures = ['None'];
    }
    displayFeatures.textContent = additionalFeatures.join('\n');
    displayTradeIn.textContent = select;

    if (details === '') {
      document
        .getElementById('tradeInDetailsLabel')
        .classList.add('displayNone');
    }
    displayDetails.textContent = details;
  }
};

// Display error/success message
const displayMsg = function (msg, id, color) {
  const element = document.getElementById(id);
  element.innerHTML = msg;
  element.style.color = color;
};

// Validation functions
const nameValidation = function () {
  const nameInput = document.getElementById('name').value.trim();
  if (nameInput === '') {
    displayMsg('Name is required', 'nameError', 'red');
    return false;
  } else if (nameInput.length < 4) {
    displayMsg('Name must be more than 3 characters', 'nameError', 'red');
    return false;
  } else if (!nameInput.match(/^([a-zA-Z ])+$/)) {
    displayMsg(
      'Name can only contain alphabets and spaces',
      'nameError',
      'red'
    );
    return false;
  } else if (!nameInput.match(/^([a-zA-Z]+) ([a-zA-Z]+)( ([a-zA-Z]+))*$/)) {
    displayMsg('Lastname required', 'nameError', 'red');
    return false;
  } else {
    displayMsg('Valid Name', 'nameError', 'green');
    fullName = nameInput
      .toLowerCase()
      .split(' ')
      .map(n => n[0].toUpperCase() + n.slice(1))
      .join(' ');
    return true;
  }
};

const emailValidation = function () {
  const emailInput = document.getElementById('email').value.trim();
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (emailInput === '') {
    displayMsg('Email is required', 'emailError', 'red');
    return false;
  } else if (!emailInput.match(emailRegex)) {
    displayMsg("Email format doesn't match", 'emailError', 'red');
    return false;
  } else {
    displayMsg('Valid email', 'emailError', 'green');
    email = emailInput.toLowerCase();
    return true;
  }
};

const numberValidation = function () {
  const numberInput = document.getElementById('phoneNumber').value.trim();
  if (numberInput === '') {
    displayMsg('Phone Number is required', 'numberError', 'red');
    return false;
  } else if (isNaN(Number(numberInput))) {
    displayMsg('Invalid phone number', 'numberError', 'red');
    return false;
  } else if (numberInput.length !== 10) {
    displayMsg('Phone Number must be 10 digits', 'numberError', 'red');
    return false;
  } else {
    displayMsg('Valid phone number', 'numberError', 'green');
    number = numberInput;
    return true;
  }
};

// Combined validation function for name, email, and number
const validateForm = function () {
  const validName = nameValidation();
  const validEmail = emailValidation();
  const validNumber = numberValidation();
  const valid = validName && validEmail && validNumber;

  // Enable or disable the "Next" button based on validation
  next.disabled = !valid;
  return valid;
};

// Initial state: Disable "Next" button until name, email, and number are valid
validateForm();
