const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FULL_NAME_LENGTH = 2;

export type InviteEmailValidationError = "required" | "invalid";
export type InviteContactValidationError = "required" | "invalid";
export type FullNameValidationError = "required" | "tooShort";
export type PhoneValidationError = "required" | "invalid";
export type WhatsAppValidationError = "invalid";
export type ServiceAreaValidationError = "required";

export function validateInviteEmailValue(
  email: string,
): InviteEmailValidationError | null {
  const trimmed = email.trim();

  if (!trimmed) {
    return "required";
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return "invalid";
  }

  return null;
}

export function validateInviteContactValue(params: {
  contactMethod: "email" | "phone";
  email: string;
  phoneNationalNumber: string;
  e164Phone: string;
}): InviteContactValidationError | null {
  if (params.contactMethod === "email") {
    const emailError = validateInviteEmailValue(params.email);
    if (emailError === "required" || emailError === "invalid") {
      return emailError;
    }
    return null;
  }

  if (!params.phoneNationalNumber.trim()) {
    return "required";
  }

  if (!params.e164Phone.trim()) {
    return "invalid";
  }

  return null;
}

export function validateFullNameValue(
  fullName: string,
): FullNameValidationError | null {
  const trimmed = fullName.trim();

  if (!trimmed) {
    return "required";
  }

  if (trimmed.length < MIN_FULL_NAME_LENGTH) {
    return "tooShort";
  }

  return null;
}

export function validatePhoneValue(
  nationalNumber: string,
  e164Phone: string,
): PhoneValidationError | null {
  if (!nationalNumber.trim()) {
    return "required";
  }

  if (!e164Phone.trim()) {
    return "invalid";
  }

  return null;
}

export function validateWhatsAppValue(
  nationalNumber: string,
  e164Phone: string,
): WhatsAppValidationError | null {
  if (!nationalNumber.trim()) {
    return null;
  }

  if (!e164Phone.trim()) {
    return "invalid";
  }

  return null;
}

export function validateServiceAreaValues(
  serviceAreaValues: string[],
): ServiceAreaValidationError | null {
  if (serviceAreaValues.length === 0) {
    return "required";
  }

  return null;
}

/** Position is optional — always valid. Kept for call-site clarity. */
export function validatePositionValue(_position: string): null {
  return null;
}

/** Identity document is optional — always valid. Kept for call-site clarity. */
export function validateIdentityDocumentValue(
  _identityDocumentUrl: string | null | undefined,
): null {
  return null;
}
