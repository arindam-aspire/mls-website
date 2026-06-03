import type { ProfileUpdateRequestData } from "../types/profile.api.types";

export function getProfileUpdateDevOtp(
  data: ProfileUpdateRequestData,
): string | undefined {
  const otp = data.otp ?? data.dev_email_otp ?? data.dev_phone_otp ?? null;
  return otp?.trim() ? otp : undefined;
}
