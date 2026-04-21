"use strict";
// credit card types with their patterns, spacing, max lengths, and images
const cardTypes = {
    visa: {
        name: 'Visa',
        pattern: /^4/,
        spacing: [4, 4, 4, 4],
        maxLength: 16,
    },
    mastercard: {
        name: 'Mastercard',
        pattern: /^(5[1-5]|2[2-7])/,
        spacing: [4, 4, 4, 4],
        maxLength: 16,
    },
    amex: {
        name: 'American Express',
        pattern: /^3[47]/,
        spacing: [4, 6, 5],
        maxLength: 15,
    },
    discover: {
        name: 'Discover',
        pattern: /^(6011|65|644)/,
        spacing: [4, 4, 4, 4],
        maxLength: 16,
    },
    jcb: {
        name: 'JCB',
        pattern: /^35[2-8][0-9]/,
        spacing: [4, 4, 4, 4],
        maxLength: 16,
    },
};
// card type logos
const cardTypeImages = {
    visa: '/public/card-logos/visa.png',
    mastercard: '/public/card-logos/mastercard.png',
    amex: '/public/card-logos/amex.png',
    discover: '/public/card-logos/discover.png',
    jcb: '/public/card-logos/jcb.png',
};
function detectCardType(number) {
    for (const cardType of Object.values(cardTypes)) {
        if (cardType.pattern.test(number)) {
            return cardType;
        }
    }
    return null;
}
function formatCardNumber(number, cardType) {
    const digitsOnly = number.replace(/\D/g, '');
    if (!cardType) {
        // if no card type detected, add basic spacing for 4-4-4-4
        return digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
    }
    const { spacing, maxLength } = cardType;
    const limited = digitsOnly.slice(0, maxLength);
    let formatted = '';
    let digitIndex = 0;
    for (const groupSize of spacing) {
        if (digitIndex < limited.length) {
            if (formatted)
                formatted += ' ';
            formatted += limited.slice(digitIndex, digitIndex + groupSize);
            digitIndex += groupSize;
        }
    }
    return formatted;
}
// the luhn algorithm basically verifies various numbers such as credit card numbers to ensure they are valid.
function luhnCheck(cardNumber) {
    const digits = cardNumber.replace(/\D/g, '');
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i]);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9)
                digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
}
// helper function to prevent non-numeric input
function preventNonNumericInput(e) {
    const char = String.fromCharCode(e.which);
    if (!/[0-9]/.test(char) && e.key !== 'Backspace') {
        e.preventDefault();
    }
}
function initializeCardInput() {
    const cardInput = document.getElementById('cardNumber');
    const cardTypeIndicator = document.getElementById('cardTypeIndicator');
    const cvcInput = document.getElementById('cvc');
    const expiryInput = document.getElementById('expiryDate');
    const zipInput = document.getElementById('billingZip');
    if (!cardInput)
        return;
    cardInput.addEventListener('input', (e) => {
        const input = e.target;
        const cardType = detectCardType(input.value);
        // format the input
        const formatted = formatCardNumber(input.value, cardType);
        input.value = formatted;
        // update card type indicator
        if (cardTypeIndicator) {
            if (cardType) {
                const cardImage = document.getElementById('cardTypeImage');
                const cardKey = Object.keys(cardTypes).find(key => cardTypes[key] === cardType);
                if (cardImage && cardKey) {
                    cardImage.src = cardTypeImages[cardKey];
                    cardImage.alt = cardType.name;
                }
                cardTypeIndicator.style.display = 'block';
            }
            else {
                cardTypeIndicator.style.display = 'none';
            }
        }
        // validate the card number
        const digitsOnly = input.value.replace(/\D/g, '');
        if (digitsOnly === '') {
            input.setCustomValidity('Please enter your credit card number.');
        }
        else if (digitsOnly.length < 13 || digitsOnly.length > 19 || !luhnCheck(digitsOnly)) {
            input.setCustomValidity('Please enter a valid credit card number.');
        }
        else {
            input.setCustomValidity('');
        }
        // update feedback message
        const feedback = input.parentElement?.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.textContent = input.validationMessage || 'Enter a valid card number.';
        }
    });
    // prevent non-numeric input for card number
    cardInput.addEventListener('keypress', preventNonNumericInput);
    // validate CVC
    if (cvcInput) {
        cvcInput.addEventListener('input', (e) => {
            const input = e.target;
            const digitsOnly = input.value.replace(/\D/g, '');
            if (digitsOnly === '') {
                input.setCustomValidity('Please enter your 3 or 4-digit card security code.');
            }
            else if (digitsOnly.length < 3 || digitsOnly.length > 4) {
                input.setCustomValidity('Please enter a valid security code.');
            }
            else {
                input.setCustomValidity('');
            }
            // update feedback message
            const feedback = input.parentElement?.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.textContent = input.validationMessage || 'Enter the 3- or 4-digit code.';
            }
        });
        // prevent non-numeric input for CVC
        cvcInput.addEventListener('keypress', preventNonNumericInput);
    }
    // handle expiry date input
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            const input = e.target;
            let value = input.value.replace(/\D/g, ''); // remove non-digits
            // auto-format to MM / YY when 4 digits are entered
            if (value.length >= 4) {
                const month = value.slice(0, 2);
                const year = value.slice(2, 4);
                value = `${month} / ${year}`;
            }
            input.value = value;
            // validate the expiry date
            const digitsOnly = input.value.replace(/\D/g, '');
            if (digitsOnly === '') {
                input.setCustomValidity('Please enter your card expiration date.');
            }
            else if (digitsOnly.length < 4) {
                input.setCustomValidity('Please enter a valid expiration date.');
            }
            else {
                const month = parseInt(digitsOnly.slice(0, 2));
                if (month < 1 || month > 12) {
                    input.setCustomValidity('Please enter a valid expiration date.');
                }
                else {
                    input.setCustomValidity('');
                }
            }
            // update feedback message
            const feedback = input.parentElement?.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.textContent = input.validationMessage || 'Enter expiry as MM / YY.';
            }
        });
        // prevent non-numeric input for expiry date
        expiryInput.addEventListener('keypress', preventNonNumericInput);
    }
    // handle zip code input
    if (zipInput) {
        zipInput.addEventListener('input', (e) => {
            const input = e.target;
            const value = input.value;
            // validate the zip code
            const digitsOnly = value.replace(/\D/g, '');
            if (value === '') {
                input.setCustomValidity('Please enter your zip code.');
            }
            else if (digitsOnly.length !== 5 || digitsOnly !== value) {
                input.setCustomValidity('Please enter a valid zip code.');
            }
            else {
                input.setCustomValidity('');
            }
            // update feedback message
            const feedback = input.parentElement?.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.textContent = input.validationMessage || 'ZIP or postal code is required.';
            }
        });
        // prevent non-numeric input for zip code
        zipInput.addEventListener('keypress', preventNonNumericInput);
    }
}
// Initialize when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCardInput);
}
else {
    initializeCardInput();
}
// Form submission handler
function handleFormSubmission() {
    const form = document.querySelector('.needs-validation');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted');
            console.log('Form validity:', form.checkValidity());
            console.log("Form submitted");
            console.log("Form validity:", form.checkValidity());
            if (!form.checkValidity()) {
                console.log('Form is invalid, adding validation classes');
                form.classList.add('was-validated');
                return;
            }
            console.log('Form is valid, processing payment');
            // Collect form data
            const firstName = document.getElementById('cardFirstName').value;
            const lastName = document.getElementById('cardLastName').value;
            const address = document.getElementById('billingAddress').value;
            const address2 = document.getElementById('billingAddress2').value;
            const city = document.getElementById('billingCity').value;
            const state = document.getElementById('billingState').value;
            const zipCode = document.getElementById('billingZip').value;
            const cardNumber = document.getElementById('cardNumber').value;
            const cardLastFour = cardNumber.replace(/\D/g, '').slice(-4);
            console.log('Collected data:', { firstName, lastName, address, city, state, zipCode, cardLastFour });
            // Generate random amount between 100 and 1000
            const amount = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
            // Create transaction object
            const transaction = {
                firstName,
                lastName,
                address,
                address2: address2 || undefined,
                city,
                state,
                zipCode,
                cardLastFour,
                amount
            };
            console.log('Transaction object:', transaction);
            // Show success screen
            showPaymentSuccess(transaction);
        });
    }
}
// Show payment success screen
function showPaymentSuccess(transaction) {
    const message = `Billing Information:\nName: ${transaction.firstName} ${transaction.lastName}\nAddress: ${transaction.address}${transaction.address2 ? ', ' + transaction.address2 : ''}\nCity: ${transaction.city}\nState: ${transaction.state}\nZIP Code: ${transaction.zipCode}\n\nPayment Details:\nCard Ending In: **** ${transaction.cardLastFour}\nAmount Paid: $${transaction.amount.toFixed(2)}\nTransaction ID: ${generateTransactionId()}\nDate: ${new Date().toLocaleDateString()}`;
    const modalBody = document.getElementById('successModalBody');
    if (modalBody) {
        modalBody.innerHTML = message.replace(/\n/g, '<br>');
    }
    const modalElement = document.getElementById('successModal');
    if (modalElement) {
        const modal = new window.bootstrap.Modal(modalElement);
        modal.show();
    }
}
// Generate random transaction ID
function generateTransactionId() {
    return 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}
// Initialize form submission handler
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleFormSubmission);
}
else {
    handleFormSubmission();
}
