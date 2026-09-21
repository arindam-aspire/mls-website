import type { ProfileUpdateRequestData } from "../types/profile.types";

export function getProfileUpdateDevOtp(
  data: ProfileUpdateRequestData,
): string | undefined {
  if (process.env.NODE_ENV === "production") {
    return undefined;
  }

  const otp = data.otp ?? data.dev_email_otp ?? data.dev_phone_otp ?? null;
  return otp?.trim() ? otp : undefined;
}
