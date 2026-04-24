"use strict";
//initialzing credit card objects
const visa = {
    name: 'Visa',
    maxLength: 16,
    img: './public/assets/images/visa.png',
    pattern: /^4/,
    spacing: [4, 4, 4, 4],
};
const mastercard = {
    name: 'Mastercard',
    maxLength: 16,
    img: './public/assets/images/mastercard.png',
    pattern: /^5[1-5]/,
    spacing: [4, 4, 4, 4],
};
const amex = {
    name: 'American Express',
    maxLength: 15,
    img: './public/assets/images/amex.png',
    pattern: /^37/,
    spacing: [4, 6, 5]
};
const discover = {
    name: 'Discover',
    maxLength: 16,
    img: './public/assets/images/discover.png',
    pattern: /^(6011|65)/,
    spacing: [4, 4, 4, 4]
};
const jcb = {
    name: 'JCB',
    maxLength: 16,
    img: './public/assets/images/jcb.png',
    pattern: /^35/,
    spacing: [4, 4, 4, 4]
};
const creditCards = [visa, mastercard, amex, discover, jcb]; //list of credit card objects
//function to detect card type
// takes the cardNumber and checks which card object's pattern it matches and sets cardType to that match if found, or to null if not
function detectCardType(cardNumber) {
    for (const card of creditCards) {
        if (card.pattern.test(cardNumber)) {
            cardType = card;
            return card;
        }
    }
    return null;
}
//function to format card number
// takes the cardType and cardNumber field as arguments, changes the maxlength for that field to whatever card type
// is detected, and returns the numbers spaced according to detected card type
function formatCardNumber(input, cardType) {
    input.maxLength = cardType.maxLength + cardType.spacing.length - 1; //changes max length of the element, adding additional for the whitespace
    let digits = input.value.replace(/\D/g, ""); //remove non-digits
    let result = "";
    let index = 0;
    for (let space of cardType.spacing) {
        if (index >= digits.length)
            break;
        result += digits.substring(index, index + space) + " ";
        index += space;
    }
    return result.trim();
}
//function to format the expiry
// takes an expiryInput field as an argument and returns the four numbers with a "/" between them; MM/YY
function formatExpiry(input) {
    let digits = input.value.replace(/\D/g, ""); //remove non-digits
    let result = digits.substring(0, 2);
    if (digits.length > 2) {
        result += "/" + digits.substring(2);
    }
    return result.trim();
}
//function to format the CVC, 
// takes an cvcInput and the card type as arguments, 
function formatCvc(input, cardType) {
    let digits = input.value.replace(/\D/g, ""); //remove non-digits
    if (cardType == amex) {
        input.maxLength = 4;
        return digits;
    }
    input.maxLength = 3;
    return digits;
}
//function to only allow specific chars for name fields 
// takes an html input as an argument and only allows letters and a few special chars, 
// returning only those chars, effectively preventing users from entering other chars
function nameChars(input) {
    let chars = input.value.replace(/[^a-zA-Z.'-\s]/g, '');
    return chars;
}
//function to only allow specific chars for address fields, 
// takes an html input as an argument, returns only those approved chars, preventing users from entering other chars
function addressChars(input) {
    let chars = input.value.replace(/[^a-zA-Z0-9()#.',-\s]/g, '');
    return chars;
}
//function to handle errors, takes an html input, true/false, and the error message if false as arguments
function setFieldValidity(input, isValid, message = "") {
    input.setCustomValidity(isValid ? "" : message);
    const container = input.closest(".col-12, .col-md-6, .col-md-3, .mb-3, div");
    const feedback = container?.querySelector(".invalid-feedback");
    if (!isValid && feedback) {
        feedback.textContent = message;
    }
    if (isValid) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
    }
    else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
    }
}
let cardType = null;
//CARD NUMBER FIELD
const cardNumberInput = document.getElementById('cardNumber');
cardNumberInput.addEventListener('input', (event) => {
    const cardNumber = event.target;
    //detect card type
    let raw = cardNumber.value.replace(/\D/g, "");
    cardType = detectCardType(raw);
    //update card type logo
    const cardImage = document.getElementById('cardTypeImage');
    const cardTypeIndicator = document.getElementById('cardTypeIndicator');
    if (cardType) {
        cardImage.src = cardType.img;
        cardImage.alt = cardType.name;
        cardTypeIndicator.style.display = 'block';
    }
    else {
        cardTypeIndicator.style.display = 'none';
    }
    // format card number
    cardNumber.value = formatCardNumber(cardNumber, cardType ?? visa); //if card type is null it'll just use the default [4, 4, 4, 4]
    // card number validation
    if (raw.length === 0 && cardNumberInput === document.activeElement) {
        setFieldValidity(cardNumberInput, false, 'Please enter your credit card number.');
    }
    else if (!cardType) {
        if (raw.length > 4) {
            setFieldValidity(cardNumberInput, false, 'The card entered is not supported. Please enter a different card type.');
        }
    }
    else if ((raw.length !== cardType.maxLength)) {
        setFieldValidity(cardNumberInput, false, `Must be ${cardType?.maxLength} digits for ${cardType.name}` //string template rather than string literal
        );
    }
    else {
        setFieldValidity(cardNumberInput, true);
    }
});
//EXPIRY FIELD
const expiryInput = document.getElementById('expiryDate');
expiryInput.addEventListener('input', (event) => {
    const expiryNumber = event.target;
    //format expiry
    expiryNumber.value = formatExpiry(expiryNumber);
    //expiry validations
    let raw = expiryInput.value.replace(/\D/g, "");
    if (raw.length === 0) {
        setFieldValidity(expiryInput, false, "Please enter your card expiration date");
        return;
    }
    const month = Number(raw.substring(0, 2));
    if (month < 1 || month > 12) {
        setFieldValidity(expiryInput, false, "Please enter a valid month");
        return;
    }
    if (raw.length < 4) {
        setFieldValidity(expiryInput, false, "Please enter a valid date (MM/YY)");
        return;
    }
    setFieldValidity(expiryInput, true);
});
//CVC FIELD
const cvcInput = document.getElementById('cvc');
cvcInput.addEventListener('input', (event) => {
    const cvcNumber = event.target;
    //format cvc
    cvcNumber.value = formatCvc(cvcNumber, cardType ?? visa);
    //cvc validations
    let raw = cvcNumber.value.replace(/\D/g, "");
    if (raw.length === 0 && cvcInput === document.activeElement) {
        setFieldValidity(cvcInput, false, 'Please enter your card\'s security code.');
    }
    else if ((cardType ?? visa) == amex && raw.length < 4) {
        setFieldValidity(cvcInput, false, 'Please enter a 4 digit security code.');
    }
    else if (raw.length < 3) {
        setFieldValidity(cvcInput, false, 'Please enter a 3 digit security code');
    }
    else {
        setFieldValidity(cvcInput, true);
    }
    ;
});
//CARD NAME FIELD
const cardNameInput = document.getElementById('cardName');
cardNameInput.addEventListener('input', (event) => {
    const cardName = event.target;
    cardName.value = nameChars(cardName);
});
//BILLING FIRST NAME FIELD
const firstNameInput = document.getElementById('firstName');
firstNameInput.addEventListener('input', (event) => {
    const firstName = event.target;
    firstName.value = nameChars(firstName);
});
//BILLING LAST NAME FIELD
const lastNameInput = document.getElementById('lastName');
lastNameInput.addEventListener('input', (event) => {
    const lastName = event.target;
    lastName.value = nameChars(lastName);
});
//BILLLING ADDRESS FIELD
const addressInput = document.getElementById('address');
addressInput.addEventListener('input', (event) => {
    const address = event.target;
    address.value = addressChars(address);
});
//BILLING ADDTIONAL INFO FIELD is skipped since its not required and they can put anything they want in it
//BILLING CITY FIELD
const cityInput = document.getElementById('city');
cityInput.addEventListener('input', (event) => {
    const city = event.target;
    city.value = addressChars(city);
});
//BILLING ZIP FIELD
const zipInput = document.getElementById('zip');
zipInput.addEventListener('input', (event) => {
    const zip = event.target;
    let digits = zip.value.replace(/\D/g, "");
    zipInput.value = digits;
    //zip validator
    let raw = zip.value.replace(/\D/g, "");
    if (raw.length === 0 && zipInput === document.activeElement) {
        setFieldValidity(zipInput, false, 'Please enter your zip code.');
    }
    else if (raw.length < 5) {
        setFieldValidity(zipInput, false, 'Please enter a 5 digit zip code.');
    }
    else {
        setFieldValidity(zipInput, true);
    }
});
// TRANSACTION CLASS
class Transaction {
    constructor(firstName, lastName, address, address2, city, state, zipCode, cardLastFour, totalAmount) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.address2 = address2;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.cardLastFour = cardLastFour;
        this.totalAmount = totalAmount;
    }
}
//generates a random transaction number
function generateTransactionId() {
    return 'TXN-' + Math.random().toString(36).slice(2, 11).toUpperCase();
}
//the modal shown if the submit button is clicked when all fields are satisfied
function showPaymentSuccess(transaction) {
    const modalBody = document.getElementById('successModalBody');
    if (!modalBody)
        return;
    modalBody.innerHTML = `
    <h5 class="mb-3">Billing Information</h5>
    <p>
      <strong>Name:</strong> ${transaction.firstName} ${transaction.lastName}<br>
      <strong>Address:</strong> ${transaction.address}
      ${transaction.address2 ? ', ' + transaction.address2 : ''}<br>
      <strong>City:</strong> ${transaction.city}<br>
      <strong>State:</strong> ${transaction.state}<br>
      <strong>ZIP:</strong> ${transaction.zipCode}
    </p>

    <hr>

    <h5 class="mb-3">Payment Details</h5>
    <p>
      <strong>Card Ending In:</strong> **** ${transaction.cardLastFour}<br>
      <strong>Amount Paid:</strong> $${transaction.totalAmount.toFixed(2)}<br>
      <strong>Transaction ID:</strong> ${generateTransactionId()}<br>
      <strong>Date:</strong> ${new Date().toLocaleDateString()}
    </p>
  `;
    const modalElement = document.getElementById('successModal');
    if (modalElement) {
        const modal = new window.bootstrap.Modal(modalElement);
        modal.show();
    }
}
//SUBMISSION HANDLER
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form.needs-validation");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const isValid = form.checkValidity();
        form.classList.add("was-validated");
        if (!isValid)
            return;
        const transaction = new Transaction(//creates a transaction object based upon the fields when the submit button is clicked
        document.getElementById("firstName").value, document.getElementById("lastName").value, document.getElementById("address").value, document.getElementById("address2").value || undefined, document.getElementById("city").value, document.getElementById("state").value, document.getElementById("zip").value, cardNumberInput.value.slice(-4), Math.floor(Math.random() * (1000 - 100 + 1)) + 100);
        showPaymentSuccess(transaction);
    });
});
