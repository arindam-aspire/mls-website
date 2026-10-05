import {
  DEFAULT_PHONE_INPUT_COUNTRY_CODE,
  getPhoneInputCountryByCode,
} from "@/src/components/ui/phone-input/countries";
import { formatPhoneNumberE164 } from "@/src/features/profile/utils/formatPhoneNumberE164";

export function toSignInOtpPhoneUsername(
  countryCode: string | null | undefined,
  nationalNumber: string | null | undefined,
): string {
  const national = nationalNumber?.trim() ?? "";
  if (!national) return "";
  if (national.startsWith("+")) return national.replace(/\s/g, "");

  const country = getPhoneInputCountryByCode(
    countryCode?.trim() || DEFAULT_PHONE_INPUT_COUNTRY_CODE,
  );
  if (!country) return "";

  return formatPhoneNumberE164(country.dialCode, national);
}

export function resolveSignInOtpUsername(contact: {
  email?: string | null;
  phoneNationalNumber?: string | null;
  phoneCountryCode?: string | null;
}): string {
  const phone = toSignInOtpPhoneUsername(
    contact.phoneCountryCode,
    contact.phoneNationalNumber,
  );
  if (phone) return phone;

  return contact.email?.trim() ?? "";
}
