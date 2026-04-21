// Test expiry date logic
function testExpiryFormatting() {
  // Test cases for formatting
  const testCases = [
    { input: '1', expected: '1' },
    { input: '12', expected: '12' },
    { input: '123', expected: '123' },
    { input: '1234', expected: '12 / 34' },
    { input: '12345', expected: '12 / 34' }, // should not add more after 4 digits
  ];

  testCases.forEach(({ input, expected }) => {
    let value = input.replace(/\D/g, '');
    if (value.length >= 4) {
      const month = value.slice(0, 2);
      const year = value.slice(2, 4);
      value = `${month} / ${year}`;
    }
    console.log(`Input: "${input}" -> "${value}" (expected: "${expected}")`);
    if (value !== expected) {
      console.error('FAILED!');
    }
  });
}

function testExpiryValidation() {
  const validationCases = [
    { input: '', expectedMessage: 'Please enter your card expiration date.' },
    { input: '1', expectedMessage: 'Please enter a valid expiration date.' },
    { input: '12', expectedMessage: 'Please enter a valid expiration date.' },
    { input: '123', expectedMessage: 'Please enter a valid expiration date.' },
    { input: '1234', expectedMessage: '' }, // valid
    { input: '1324', expectedMessage: 'Please enter a valid expiration date.' }, // month 13 > 12
    { input: '0024', expectedMessage: 'Please enter a valid expiration date.' }, // month 00 invalid
    { input: '0124', expectedMessage: '' }, // valid
  ];

  validationCases.forEach(({ input, expectedMessage }) => {
    const digitsOnly = input.replace(/\D/g, '');
    let message = '';
    if (digitsOnly === '') {
      message = 'Please enter your card expiration date.';
    } else if (digitsOnly.length < 4) {
      message = 'Please enter a valid expiration date.';
    } else {
      const month = parseInt(digitsOnly.slice(0, 2));
      if (month < 1 || month > 12) {
        message = 'Please enter a valid expiration date.';
      }
    }
    console.log(`Validation input: "${input}" -> "${message}" (expected: "${expectedMessage}")`);
    if (message !== expectedMessage) {
      console.error('VALIDATION FAILED!');
    }
  });
}

testExpiryFormatting();
testExpiryValidation();