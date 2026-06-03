export function formatPhoneNumberE164(
  dialCode: string,
  nationalNumber: string,
): string {
  const digits = nationalNumber.replace(/\D/g, "");
  if (!digits) return "";
  return `${dialCode}${digits}`;
}

export function normalizePhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function arePhoneNumbersEqual(a: string, b: string): boolean {
  const left = normalizePhoneDigits(a);
  const right = normalizePhoneDigits(b);
  if (!left || !right) return false;
  return left === right;
}
