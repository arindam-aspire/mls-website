import {
  DEFAULT_PHONE_INPUT_COUNTRY_CODE,
  getPhoneInputCountryByCode,
  PHONE_INPUT_COUNTRIES,
} from "@/src/components/ui/phone-input/countries";

export function maskEmail(
  email: string,
  options?: { visibleLocalChars?: number },
): string {
  const trimmed = email.trim();
  const atIndex = trimmed.indexOf("@");
  if (atIndex <= 0) {
    return trimmed;
  }

  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex);
  const visibleLocalChars = options?.visibleLocalChars ?? 1;
  const visible = local.slice(0, Math.min(visibleLocalChars, local.length));
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

const dialCodesByLength = [...PHONE_INPUT_COUNTRIES].sort(
  (a, b) => b.dialCode.length - a.dialCode.length,
);

/** Masks a stored phone string (`+962 791234567` or national digits only). */
export function maskStoredPhoneNumber(
  phoneNumber: string,
  defaultCountryCode = DEFAULT_PHONE_INPUT_COUNTRY_CODE,
): string {
  const trimmed = phoneNumber.trim();
  if (!trimmed) {
    return trimmed;
  }

  for (const country of dialCodesByLength) {
    if (trimmed.startsWith(country.dialCode)) {
      const national = trimmed.slice(country.dialCode.length).trim();
      return maskPhone(national, country.iso2);
    }
  }

  return maskPhone(trimmed, defaultCountryCode);
}
