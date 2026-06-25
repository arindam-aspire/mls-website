const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type InviteEmailValidationError = "required" | "invalid";
export type FullNameValidationError = "required";
export type PhoneValidationError = "required" | "invalid";
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

export function validateFullNameValue(
  fullName: string,
): FullNameValidationError | null {
  if (!fullName.trim()) {
    return "required";
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

export function validateServiceAreaValues(
  serviceAreaValues: string[],
): ServiceAreaValidationError | null {
  if (serviceAreaValues.length === 0) {
    return "required";
  }

  return null;
}
