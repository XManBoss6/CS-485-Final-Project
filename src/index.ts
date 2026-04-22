//credit card object
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
const creditCards: CreditCard[] = [visa, mastercard, amex, discover, jcb];

// helper function for input validation
function validateInput(input: HTMLInputElement, validator: (value: string) => string, feedbackMessage: string): void {
  const value = input.value;
  const error = validator(value);
  input.setCustomValidity(error);
  const feedback = input.parentElement?.querySelector('.invalid-feedback') as HTMLElement;
  if (feedback) {
    feedback.textContent = input.validationMessage || feedbackMessage;
  }
}

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


//ERROS
function setFieldValidity(
  input: HTMLInputElement,
  isValid: boolean,
  message: string = ""
) {
  input.setCustomValidity(isValid ? "" : message);

  if (isValid) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  } else {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
  }
}


// FORM HANDLING
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
  } else {
    cardTypeIndicator.style.display = 'none';
  }

  // format card
  cardNumber.value = formatCardNumber(cardNumber, cardType ?? visa); //if card type is null it'll just use the default [4, 4, 4, 4]

  //error handling
  if (raw.length === 0) {
    setFieldValidity(cardNumberInput, false, "Please enter a card number");
  }
  else if (!cardType) {
    setFieldValidity(cardNumberInput, false, "Unsupported card type");
  }
  else if (raw.length !== cardType.maxLength) {
    setFieldValidity(
      cardNumberInput,
      false,
      'Must be ${cardType.maxLength} digits'
    );
  }
  else {
    setFieldValidity(cardNumberInput, true);
  }
});