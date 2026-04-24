"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCvcValue = validateCvcValue;
function validateCvcValue(value, isAmex, isFocused) {
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
