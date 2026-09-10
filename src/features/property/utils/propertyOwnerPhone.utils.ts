const DEFAULT_OWNER_COUNTRY_CODE = "+962";

const OWNER_DIAL_CODES = ["+962", "+966", "+971", "+20", "+1"] as const;

export function toOptionalTrimmedString(
  value: string | undefined | null,
): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function buildOwnerPhone(
  countryCode: string | undefined,
  phoneNumber: string | undefined,
): string | undefined {
  const number = phoneNumber?.trim();
  if (!number) {
    return undefined;
  }

  return `${countryCode ?? ""}${number}`.trim() || undefined;
}

export function parseOwnerPhoneForForm(phone: string | undefined | null): {
  country_code: string;
  phone_number: string;
} {
  const raw = phone?.trim() ?? "";

  if (!raw) {
    return { country_code: DEFAULT_OWNER_COUNTRY_CODE, phone_number: "" };
  }

  if (raw.startsWith("+")) {
    const dialCode = [...OWNER_DIAL_CODES]
      .sort((a, b) => b.length - a.length)
      .find((code) => raw.startsWith(code));

    if (dialCode) {
      return {
        country_code: dialCode,
        phone_number: raw.slice(dialCode.length),
      };
    }
  }

  return { country_code: DEFAULT_OWNER_COUNTRY_CODE, phone_number: raw };
}
