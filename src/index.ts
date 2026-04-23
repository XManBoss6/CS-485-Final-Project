//credit card class
interface CreditCard {
  name: string,
  maxLength: number,
  img: string,
  pattern: RegExp,
  spacing: number[]
}

const visa: CreditCard = {
  name: 'Visa',
  maxLength: 16,
  img: './public/assets/images/visa.png',
  pattern: /^4/,
  spacing: [4, 4, 4, 4],
}
const mastercard: CreditCard = {
  name: 'Mastercard',
  maxLength: 16,
  img: './public/assets/images/mastercard.png',
  pattern: /^5[1-5]/,
  spacing: [4, 4, 4, 4],
}
const amex: CreditCard = {
  name: 'American Express',
  maxLength: 15,
  img: './public/assets/images/amex.png',
  pattern: /^37/,
  spacing: [4, 6, 5]
}
const discover: CreditCard = {
  name: 'Discover',
  maxLength: 16,
  img: './public/assets/images/discover.png',
  pattern: /^(6011|65)/,
  spacing: [4, 4, 4, 4]
} 
const jcb: CreditCard = {
  name: 'JCB',
  maxLength: 16,
  img: './public/assets/images/jcb.png',
  pattern: /^35/,
  spacing: [4, 4, 4, 4]
}
const noCard: CreditCard = {
  name: 'Card Not Supported',
  maxLength: 16,
  img: './public/assets/images/default.png',
  pattern: /^[0-9]{16}/,
  spacing: [4, 4, 4, 4]
}
const creditCards: CreditCard[] = [visa, mastercard, amex, discover, jcb]; //list of credit card objects


//function to detect card type
function detectCardType(cardNumber: string) {
  for (const card of creditCards) {
    if (card.pattern.test(cardNumber)) {
      cardType = card
      return card
    }
  }
  return null
}

//function to format card number
function formatCardNumber(input: HTMLInputElement, cardType: CreditCard): string {
  input.maxLength = cardType.maxLength + cardType.spacing.length - 1 //changes max length of the element, adding additional for the whitespace

  let digits = input.value.replace(/\D/g, ""); //remove non-digits

  let result = "";
  let index = 0;

  for (let group of cardType.spacing) {
    if (index >= digits.length) break;

    result += digits.substring(index, index + group) + " ";
    index += group;
  }
  return result.trim();
}

//function to format the expiry
function formatExpiry(input: HTMLInputElement, cardType: CreditCard): string {
  let digits = input.value.replace(/\D/g, ""); //remove non-digits

  let result = digits.substring(0,2)
  if (digits.length > 2) {
    result += "/" + digits.substring(2)
  }

  return result.trim();
}

//function to format the CVC
function formatCvc(input: HTMLInputElement, cardType: CreditCard): string {
  let digits = input.value.replace(/\D/g, ""); //remove non-digits
  
  if (cardType == amex) {
    input.maxLength = 4
    return digits
  }

  input.maxLength = 3
  return digits
}

//function to only allow specific chars for name fields
function nameChars (input: HTMLInputElement): string {
  let chars = input.value.replace(/[^a-zA-Z.'-\s]/g, '');
  return chars
}

//function to only allow specific chars for address fields
function addressChars (input: HTMLInputElement): string {
  let chars = input.value.replace(/[^a-zA-Z0-9()#.',-\s]/g, '');
  return chars
}

//ERRORS
function setFieldValidity(
  input: HTMLInputElement,
  isValid: boolean,
  message: string = ""
) {
  input.setCustomValidity(isValid ? "" : message);

  const container = input.closest(".col-12, .col-md-6, .col-md-3, .mb-3, div");

  const feedback = container?.querySelector(".invalid-feedback") as HTMLElement;

  if (!isValid && feedback) {
    feedback.textContent = message;
  }

  if (isValid) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
  }
}


//CARD NUMBER FIELD
const cardNumberInput = document.getElementById('cardNumber') as HTMLInputElement;
let cardType: CreditCard | null = null

cardNumberInput.addEventListener('input', (event: Event) => {
  const cardNumber = event.target as HTMLInputElement;

  //detect card type
  let raw = cardNumber.value.replace(/\D/g, "");
  cardType = detectCardType(raw);
  
  //update card type logo
  const cardImage = document.getElementById('cardTypeImage') as HTMLImageElement;
  const cardTypeIndicator = document.getElementById('cardTypeIndicator') as HTMLElement;

  if(cardType) {
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
    setFieldValidity(
      cardNumberInput,
      false,
      `Must be ${cardType?.maxLength} digits` //string template rather than string literal
    );
  }
  else {
    setFieldValidity(cardNumberInput, true);
  }
});

//EXPIRY FIELD
const expiryInput = document.getElementById('expiryDate') as HTMLInputElement;
expiryInput.addEventListener('input', (event: Event) => {
  const expiryNumber = event.target as HTMLInputElement;

  //format expiry
  expiryNumber.value = formatExpiry(expiryNumber, cardType ?? visa)
  
  //expiry validations
  let raw = expiryInput.value.replace(/\D/g, "");
  if (raw.length === 0) {
    setFieldValidity(expiryInput, false, "Please enter your card expiration date");
    return;
  }
  const month = Number(raw.substring(0, 2));
  if ((month < 1 || month > 12) || raw.length < 4) {
    setFieldValidity(expiryInput, false, "Please enter a valid expiration date");
    return;
  }
  setFieldValidity(expiryInput, true);
});

//CVC FIELD
const cvcInput = document.getElementById('cvc') as HTMLInputElement;
cvcInput.addEventListener('input', (event: Event) => {
  const cvcNumber = event.target as HTMLInputElement;

  //format cvc
  cvcNumber.value = formatCvc(cvcNumber, cardType ?? visa);

  //cvc validations
  let raw = cvcNumber.value.replace(/\D/g, "");
  if (raw.length === 0 && cvcInput === document.activeElement) {
    setFieldValidity(cvcInput, false, 'Please enter your cards security code.');
  }
  else if ((cardType ?? visa) == amex && raw.length < 4) {
    setFieldValidity(cvcInput, false, 'Please enter a 4 digit security code.');
  }
  else if (raw.length < 3) {
    setFieldValidity(cvcInput, false, 'Please enter a 3 digit security code')
  }
  else {
    setFieldValidity(cvcInput, true);
  };
});

//CARD NAME FIELD
const cardNameInput = document.getElementById('cardName') as HTMLInputElement;
cardNameInput.addEventListener('input', (event: Event) => {
  const cardName = event.target as HTMLInputElement;
  cardName.value = nameChars(cardName)
});

//BILLING FIRST NAME FIELD
const firstNameInput = document.getElementById('firstName') as HTMLInputElement;
firstNameInput.addEventListener('input', (event: Event) => {
  const firstName = event.target as HTMLInputElement;
  firstName.value = nameChars(firstName)
});

//BILLING LAST NAME FIELD
const lastNameInput = document.getElementById('lastName') as HTMLInputElement;
lastNameInput.addEventListener('input', (event: Event) => {
  const lastName = event.target as HTMLInputElement;
  lastName.value = nameChars(lastName)
});

//BILLLING ADDRESS FIELD
const addressInput = document.getElementById('address') as HTMLInputElement;
addressInput.addEventListener('input', (event: Event) => {
  const address = event.target as HTMLInputElement;
  address.value = addressChars(address)
});

//BILLING ADDTIONAL INFO FIELD is skipped since its not required and they can put anything they want in it

//BILLING CITY FIELD
const cityInput = document.getElementById('city') as HTMLInputElement;
cityInput.addEventListener('input', (event: Event) => {
  const city = event.target as HTMLInputElement;
  city.value = addressChars(city)
});

//BILLING ZIP FIELD
const zipInput = document.getElementById('zip') as HTMLInputElement;
zipInput.addEventListener('input', (event: Event) => {
  const zip = event.target as HTMLInputElement;

  let digits = zip.value.replace(/\D/g, "")
  zipInput.value = digits

  //zip validator
  let raw = zip.value.replace(/\D/g, "");
  if (raw.length === 0 && zipInput === document.activeElement) {
    setFieldValidity(zipInput, false, 'Please enter your zip code.');
  }
  else if (raw.length < 5) {
    setFieldValidity(zipInput, false, 'Please enter a 5 digit zip code.')
  }
  else {
    setFieldValidity(zipInput, true);
  }
});


// TRANSACTION CLASS
class Transaction {
  constructor(
    public firstName: string,
    public lastName: string,
    public address: string,
    public address2: string | undefined,
    public city: string,
    public state: string,
    public zipCode: string,
    public cardLastFour: string,
    public amount: number
  ) {}
}

function showPaymentSuccess(transaction: Transaction): void {
  const modalBody = document.getElementById('successModalBody');

  if (!modalBody) return;

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
      <strong>Amount Paid:</strong> $${transaction.amount.toFixed(2)}<br>
      <strong>Transaction ID:</strong> ${generateTransactionId()}<br>
      <strong>Date:</strong> ${new Date().toLocaleDateString()}
    </p>
  `;

  const modalElement = document.getElementById('successModal');
  if (modalElement) {
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }
}

function generateTransactionId(): string {
  return 'TXN-' + Math.random().toString(36).slice(2, 11).toUpperCase();
}

//SUBMISSION HANDLER
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form.needs-validation") as HTMLFormElement;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const isValid = form.checkValidity();
    form.classList.add("was-validated");

    if (!isValid) return;

    const transaction = new Transaction(
      (document.getElementById("firstName") as HTMLInputElement).value,
      (document.getElementById("lastName") as HTMLInputElement).value,
      (document.getElementById("address") as HTMLInputElement).value,
      (document.getElementById("address2") as HTMLInputElement).value || undefined,
      (document.getElementById("city") as HTMLInputElement).value,
      (document.getElementById("state") as HTMLSelectElement).value,
      (document.getElementById("zip") as HTMLInputElement).value,
      cardNumberInput.value.slice(-4),
      Math.floor(Math.random() * (1000 - 100 + 1)) + 100
    );

    showPaymentSuccess(transaction);
  });
});


//UNIT TEST
