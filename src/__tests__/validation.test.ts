import { formatCvcValue } from "../utils/validation";

describe("formatCvcValue", () => {
  test("limits CVC to 3 digits for non-Amex cards", () => {
    expect(formatCvcValue("1234", false)).toBe("123");
  });

  test("limits CVC to 4 digits for Amex", () => {
    expect(formatCvcValue("12345", true)).toBe("1234");
  });

  test("removes non-numeric characters", () => {
    expect(formatCvcValue("12a=+3b.{@`-D4", false)).toBe("123");
  });
});