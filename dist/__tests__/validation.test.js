"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("../utils/validation");
describe("formatCvcValue", () => {
    test("limits CVC to 3 digits for non-Amex cards", () => {
        expect((0, validation_1.formatCvcValue)("1234", false)).toBe("123");
    });
    test("limits CVC to 4 digits for Amex", () => {
        expect((0, validation_1.formatCvcValue)("12345", true)).toBe("1234");
    });
    test("removes non-numeric characters", () => {
        expect((0, validation_1.formatCvcValue)("12a=+3b.{@`-D4", false)).toBe("123");
    });
});
