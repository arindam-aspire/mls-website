import {
  DEFAULT_PHONE_INPUT_COUNTRY_CODE,
  getPhoneInputCountryByCode,
  PHONE_INPUT_COUNTRIES,
} from "@/src/components/ui/phone-input/countries";

const dialCodesByLength = [...PHONE_INPUT_COUNTRIES].sort(
  (a, b) => b.dialCode.length - a.dialCode.length,
);

export type ParsedStoredPhoneNumber = {
  countryCode: string;
  nationalNumber: string;
  formatted: string;
};

export function parseStoredPhoneNumber(
  phoneNumber: string,
  defaultCountryCode = DEFAULT_PHONE_INPUT_COUNTRY_CODE,
): ParsedStoredPhoneNumber {
  const trimmed = phoneNumber.trim();

  if (!trimmed) {
    return {
      countryCode: defaultCountryCode,
      nationalNumber: "",
      formatted: "",
    };
  }

  for (const country of dialCodesByLength) {
    if (trimmed.startsWith(country.dialCode)) {
      const nationalNumber = trimmed
        .slice(country.dialCode.length)
        .replace(/\D/g, "");
      const formatted = nationalNumber
        ? `${country.dialCode} ${nationalNumber}`
        : "";

      return {
        countryCode: country.iso2,
        nationalNumber,
        formatted,
      };
    }
  }

  const nationalNumber = trimmed.replace(/\D/g, "");
  const country = getPhoneInputCountryByCode(defaultCountryCode);
  const formatted =
    nationalNumber && country ? `${country.dialCode} ${nationalNumber}` : "";

  return {
    countryCode: defaultCountryCode,
    nationalNumber,
    formatted,
  };
}
