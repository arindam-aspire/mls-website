"use client";

import {
  OtpVerificationTitle,
  useOtpVerificationTitleLabels,
} from "@/src/components/ui/otp-verification";
import { DEFAULT_PHONE_INPUT_COUNTRY_CODE } from "@/src/components/ui/phone-input/countries";
import { maskEmail, maskPhone } from "@/src/features/auth/maskContact";

type ProfileOtpVerificationTitleProps = {
  contactEmail?: string;
  contactPhone?: string;
  contactPhoneCountry?: string;
  displayOtp?: string;
  title?: string;
  subtitle?: string;
  emailVisibleLocalChars?: number;
  className?: string;
};

export function ProfileOtpVerificationTitle({
  contactEmail,
  contactPhone,
  contactPhoneCountry = DEFAULT_PHONE_INPUT_COUNTRY_CODE,
  displayOtp,
  title,
  subtitle,
  emailVisibleLocalChars,
  className,
}: ProfileOtpVerificationTitleProps) {
  const maskedEmail = contactEmail?.trim()
    ? maskEmail(
        contactEmail,
        emailVisibleLocalChars != null
          ? { visibleLocalChars: emailVisibleLocalChars }
          : undefined,
      )
    : null;
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
  const resolvedLabels = {
    ...labels,
    ...(title ? { title } : {}),
    ...(subtitle ? { subtitle } : {}),
  };
  const contactLine = maskedEmail ?? maskedPhone ?? "";

  return (
    <OtpVerificationTitle
      labels={resolvedLabels}
      contactLine={contactLine}
      displayOtp={displayOtp}
      className={className}
    />
  );
}
