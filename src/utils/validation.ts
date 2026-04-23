export function formatCvcValue(value: string, isAmex: boolean): string {
  const digits = value.replace(/\D/g, "");

  if (isAmex) return digits.slice(0, 4);
  return digits.slice(0, 3);
}