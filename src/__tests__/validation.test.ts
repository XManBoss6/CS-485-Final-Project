import { validateCvcValue } from "../utils/validation";

describe("CVC Validation", () => {

  test("shows error when empty and focused", () => {
    const result = validateCvcValue("", false, true);

    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Please enter your cards security code.");
  });

  test("requires 3 digits for non-Amex", () => {
    const result = validateCvcValue("12", false, true);

    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Please enter a 3 digit security code");
  });

  test("accepts valid 3-digit CVC for non-Amex", () => {
    const result = validateCvcValue("123", false, true);

    expect(result.isValid).toBe(true);
    expect(result.message).toBe("");
  });

  test("requires 4 digits for Amex", () => {
    const result = validateCvcValue("123", true, true);

    expect(result.isValid).toBe(false);
    expect(result.message).toBe("Please enter a 4 digit security code.");
  });

  test("accepts valid 4-digit CVC for Amex", () => {
    const result = validateCvcValue("1234", true, true);

    expect(result.isValid).toBe(true);
    expect(result.message).toBe("");
  });

  test("ignores non-numeric characters", () => {
    const result = validateCvcValue("12abcdefghijklmnopqrztuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ,./;'[]\\`!@#$%^&*()_+-=~{}\|:\"/<>?àñ3", false, true);

    expect(result.isValid).toBe(true);
    expect(result.message).toBe("");
  });

});