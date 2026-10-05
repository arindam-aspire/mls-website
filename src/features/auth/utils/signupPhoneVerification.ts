/**
 * Same rule as `isRegisteredMobileVerified`: only boolean `true` counts.
 * Kept local so this module can run in the Node test runner without a path alias.
 */
function isExplicitPhoneVerified(status: unknown): boolean {
  return status === true;
}

export function hasSignupPhoneNumber(phoneNumber: unknown): boolean {
  return typeof phoneNumber === "string" && phoneNumber.trim().length > 0;
}

/**
 * Email confirmation stays first. It activates the account and does not
 * verify the phone. Phone OTP uses the authenticated profile API, so it
 * runs only after that confirmation when a number was stored and the
 * backend has not set `is_phone_verified` to true.
 */
export type SignupVerificationStep =
  | "email-confirmation"
  | "phone-verification"
  | "complete";

export function resolveSignupVerificationStep(input: {
  emailConfirmed: boolean;
  phoneNumber?: string | null;
  isPhoneVerified?: unknown;
}): SignupVerificationStep {
  if (!input.emailConfirmed) {
    return "email-confirmation";
  }

  if (
    hasSignupPhoneNumber(input.phoneNumber) &&
    !isExplicitPhoneVerified(input.isPhoneVerified)
  ) {
    return "phone-verification";
  }

  return "complete";
}

export function shouldOpenSignupPhoneVerification(input: {
  pending: boolean;
  phoneNumber?: string | null;
  isPhoneVerified?: unknown;
}): boolean {
  return (
    input.pending &&
    resolveSignupVerificationStep({
      emailConfirmed: true,
      phoneNumber: input.phoneNumber,
      isPhoneVerified: input.isPhoneVerified,
    }) === "phone-verification"
  );
}

/** Prefer the number stored on the account. Fall back to the signup value. */
export function resolveRegisteredPhoneForVerification(input: {
  accountPhone?: string | null;
  signupPhone?: string | null;
}): string {
  const accountPhone = input.accountPhone?.trim() ?? "";
  if (hasSignupPhoneNumber(accountPhone)) {
    return accountPhone;
  }
  const signupPhone = input.signupPhone?.trim() ?? "";
  return hasSignupPhoneNumber(signupPhone) ? signupPhone : "";
}

export function canFinishAfterPhoneVerification(isPhoneVerified: unknown): boolean {
  return isExplicitPhoneVerified(isPhoneVerified);
}

export type SignupPhoneOtpRequestResult =
  | { status: "sent" }
  | { status: "missing_phone" }
  | { status: "busy" };

/**
 * Sends a phone OTP only for a non-empty registered number, and only when
 * no other send is in flight. The caller supplies the existing profile request.
 */
export async function requestSignupPhoneOtp(params: {
  phoneNumber: string | null | undefined;
  lock: { tryEnter: () => boolean; leave: () => void };
  send: (phoneNumber: string) => Promise<unknown>;
}): Promise<SignupPhoneOtpRequestResult> {
  const phoneNumber = params.phoneNumber?.trim() ?? "";
  if (!hasSignupPhoneNumber(phoneNumber)) {
    return { status: "missing_phone" };
  }

  if (!params.lock.tryEnter()) {
    return { status: "busy" };
  }

  try {
    await params.send(phoneNumber);
    return { status: "sent" };
  } finally {
    params.lock.leave();
  }
}
