// Credit Card Type Detection and Formatting
interface CardType {
  name: string;
  pattern: RegExp;
  spacing: number[];
  maxLength: number;
}

const cardTypes: Record<string, CardType> = {
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

function detectCardType(number: string): CardType | null {
  for (const cardType of Object.values(cardTypes)) {
    if (cardType.pattern.test(number)) {
      return cardType;
    }
  }
  return null;
}

function formatCardNumber(number: string, cardType: CardType | null): string {
  const digitsOnly = number.replace(/\D/g, '');

  if (!cardType) {
    // If no card type detected, add basic spacing for 4-4-4-4
    return digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
  }

  const { spacing, maxLength } = cardType;
  const limited = digitsOnly.slice(0, maxLength);

  let formatted = '';
  let digitIndex = 0;

  for (const groupSize of spacing) {
    if (digitIndex < limited.length) {
      if (formatted) formatted += ' ';
      formatted += limited.slice(digitIndex, digitIndex + groupSize);
      digitIndex += groupSize;
    }
  }

  return formatted;
}

function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let shouldDouble = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

function initializeCardInput(): void {
  const cardInput = document.getElementById('cardNumber') as HTMLInputElement;
  const cardTypeIndicator = document.getElementById('cardTypeIndicator') as HTMLElement;
  const cvcInput = document.getElementById('cvc') as HTMLInputElement;

  if (!cardInput) return;

  cardInput.addEventListener('input', (e) => {
    const input = e.target as HTMLInputElement;
    const cardType = detectCardType(input.value);

    // Format the input
    const formatted = formatCardNumber(input.value, cardType);
    input.value = formatted;

    // Update card type indicator
    if (cardTypeIndicator) {
      if (cardType) {
        cardTypeIndicator.textContent = cardType.name;
        cardTypeIndicator.style.display = 'block';
      } else {
        cardTypeIndicator.style.display = 'none';
      }
    }

    // Validate the card number
    const digitsOnly = input.value.replace(/\D/g, '');
    if (digitsOnly === '') {
      input.setCustomValidity('Please enter your credit card number.');
    } else if (digitsOnly.length < 13 || digitsOnly.length > 19 || !luhnCheck(digitsOnly)) {
      input.setCustomValidity('Please enter a valid credit card number.');
    } else {
      input.setCustomValidity('');
    }

    // Update feedback message
    const feedback = input.parentElement?.querySelector('.invalid-feedback') as HTMLElement;
    if (feedback) {
      feedback.textContent = input.validationMessage || 'Enter a valid card number.';
    }
  });

  // Prevent non-numeric input for card number
  cardInput.addEventListener('keypress', (e) => {
    const char = String.fromCharCode(e.which);
    if (!/[0-9]/.test(char) && e.key !== 'Backspace') {
      e.preventDefault();
    }
  });

  // Validate CVC
  if (cvcInput) {
    cvcInput.addEventListener('input', (e) => {
      const input = e.target as HTMLInputElement;
      const digitsOnly = input.value.replace(/\D/g, '');
      if (digitsOnly === '') {
        input.setCustomValidity('Please enter your card security code.');
      } else if (digitsOnly.length < 3 || digitsOnly.length > 4) {
        input.setCustomValidity('Please enter a valid security code.');
      } else {
        input.setCustomValidity('');
      }

      // Update feedback message
      const feedback = input.parentElement?.querySelector('.invalid-feedback') as HTMLElement;
      if (feedback) {
        feedback.textContent = input.validationMessage || 'Enter the 3- or 4-digit code.';
      }
    });

    // Prevent non-numeric input for CVC
    cvcInput.addEventListener('keypress', (e) => {
      const char = String.fromCharCode(e.which);
      if (!/[0-9]/.test(char) && e.key !== 'Backspace') {
        e.preventDefault();
      }
    });
  }
}

// Initialize when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCardInput);
} else {
  initializeCardInput();
}