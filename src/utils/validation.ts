export function validateCvcValue(
  value: string,
  isAmex: boolean,
  isFocused: boolean
): { isValid: boolean; message: string } {

  const raw = value.replace(/\D/g, "");

  if (raw.length === 0 && isFocused) {
    return {
      isValid: false,
      message: "Please enter your cards security code."
    };
  }

  if (isAmex && raw.length < 4) {
    return {
      isValid: false,
      message: "Please enter a 4 digit security code."
    };
  }

  if (!isAmex && raw.length < 3) {
    return {
      isValid: false,
      message: "Please enter a 3 digit security code"
    };
  }

  return {
    isValid: true,
    message: ""
  };
}