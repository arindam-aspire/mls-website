"use client";

import {
  OtpVerificationTitle,
  useOtpVerificationTitleLabels,
} from "@/src/components/ui/otp-verification";
import { maskEmail, maskPhone } from "@/src/features/auth/maskContact";

type ProfileOtpVerificationTitleProps = {
  contactEmail?: string;
  contactPhone?: string;
  contactPhoneCountry?: string;
  displayOtp?: string;
  className?: string;
};

export function ProfileOtpVerificationTitle({
  contactEmail,
  contactPhone,
  contactPhoneCountry = "JO",
  displayOtp,
  className,
}: ProfileOtpVerificationTitleProps) {
  const maskedEmail = contactEmail?.trim() ? maskEmail(contactEmail) : null;
  const maskedPhone = contactPhone?.trim()
    ? maskPhone(contactPhone, contactPhoneCountry)
    : null;
  const hasEmail = maskedEmail != null;
  const hasPhone = maskedPhone != null;

  const subtitleKey = hasEmail
    ? "otpVerifySubtitleEmail"
    : hasPhone
      ? "otpVerifySubtitlePhone"
      : "otpVerifySubtitle";

  const labels = useOtpVerificationTitleLabels("profile", subtitleKey);
  const contactLine = maskedEmail ?? maskedPhone ?? "";

  return (
    <OtpVerificationTitle
      labels={labels}
      contactLine={contactLine}
      displayOtp={displayOtp}
      className={className}
    />
  );
}
