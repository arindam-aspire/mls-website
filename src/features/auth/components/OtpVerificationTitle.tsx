"use client";

import {
  OtpVerificationTitle as OtpVerificationTitleUi,
  useOtpVerificationTitleLabels,
} from "@/src/components/ui/otp-verification";
import { cn } from "@/src/lib/cn";
import { maskEmail, maskPhone } from "../maskContact";

type OtpVerificationTitleProps = {
  contactEmail?: string;
  contactPhone?: string;
  contactPhoneCountry?: string;
  displayOtp?: string;
};

export function OtpVerificationTitle({
  contactEmail,
  contactPhone,
  contactPhoneCountry = "JO",
  displayOtp,
}: OtpVerificationTitleProps) {
  const maskedEmail = contactEmail?.trim() ? maskEmail(contactEmail) : null;
  const maskedPhone = contactPhone?.trim()
    ? maskPhone(contactPhone, contactPhoneCountry)
    : null;
  const hasEmail = maskedEmail != null;
  const hasPhone = maskedPhone != null;

  const subtitleKey =
    hasEmail && hasPhone
      ? "otpVerifySubtitleBoth"
      : hasEmail
        ? "otpVerifySubtitleEmail"
        : hasPhone
          ? "otpVerifySubtitlePhone"
          : "otpVerifySubtitle";

  const labels = useOtpVerificationTitleLabels("auth", subtitleKey);
  const contactLine = [maskedEmail, maskedPhone].filter(Boolean).join(" | ");

  return (
    <OtpVerificationTitleUi
      labels={labels}
      contactLine={contactLine}
      displayOtp={displayOtp}
      className={cn("px-4 sm:px-6")}
    />
  );
}
