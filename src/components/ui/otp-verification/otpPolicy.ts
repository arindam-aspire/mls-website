export const OTP_LENGTH = 6;
export const OTP_RESEND_SECONDS = 60;

const COMPLETE_OTP = new RegExp(`^\\d{${OTP_LENGTH}}$`);

export function isCompleteOtpCode(code: string): boolean {
  return COMPLETE_OTP.test(code);
}

export function canRequestOtpResend(input: {
  secondsRemaining: number;
  isResending: boolean;
}): boolean {
  return input.secondsRemaining <= 0 && !input.isResending;
}
