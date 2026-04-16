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
  diners: {
    name: 'Diners Club',
    pattern: /^(36|38|30[0-5])/,
    spacing: [4, 4, 4, 2],
    maxLength: 14,
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

function initializeCardInput(): void {
  const cardInput = document.getElementById('cardNumber') as HTMLInputElement;
  const cardTypeIndicator = document.getElementById('cardTypeIndicator') as HTMLElement;

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
  });

  // Prevent non-numeric input
  cardInput.addEventListener('keypress', (e) => {
    const char = String.fromCharCode(e.which);
    if (!/[0-9]/.test(char) && e.key !== 'Backspace') {
      e.preventDefault();
    }
  });
}

// Initialize when DOM is ready or immediately if already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeCardInput);
} else {
  initializeCardInput();
}