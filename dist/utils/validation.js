"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCvcValue = formatCvcValue;
function formatCvcValue(value, isAmex) {
    const digits = value.replace(/\D/g, "");
    if (isAmex)
        return digits.slice(0, 4);
    return digits.slice(0, 3);
}
