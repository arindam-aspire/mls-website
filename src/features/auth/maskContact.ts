import { getPhoneInputCountryByCode } from "@/src/components/ui/phone-input/countries";

export function maskEmail(email: string): string {
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf("@");
  if (atIndex <= 0) {
    return trimmed;
  }

  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex);
  const visible = local.charAt(0) ?? "";
  return `${visible}***${domain}`;
}

export function maskPhone(
  nationalNumber: string,
  countryCode = "JO",
): string {
  const country = getPhoneInputCountryByCode(countryCode);
  const dialCode = country?.dialCode ?? "";
  const digits = nationalNumber.replace(/\D/g, "");

  if (digits.length === 0) {
    return dialCode;
  }

  if (digits.length <= 4) {
    return `${dialCode} ${digits}`;
  }

  const firstDigit = digits.charAt(0);
  const lastDigits = digits.slice(-4);
  return `${dialCode} ${firstDigit}***${lastDigits}`;
}
