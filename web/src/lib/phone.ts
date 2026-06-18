const MIN_DIGITS = 8;

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function isValidPhone(value: string): boolean {
  const digits = digitsOnly(value);
  if (digits.length < MIN_DIGITS) return false;

  if (digits.startsWith("963")) {
    return digits.length >= 11 && digits.length <= 12;
  }

  if (digits.startsWith("09")) {
    return digits.length >= 9 && digits.length <= 10;
  }

  if (digits.startsWith("9") && digits.length === 9) {
    return true;
  }

  return digits.length >= MIN_DIGITS && digits.length <= 15;
}

export function normalizePhoneForDisplay(value: string): string {
  return digitsOnly(value);
}
