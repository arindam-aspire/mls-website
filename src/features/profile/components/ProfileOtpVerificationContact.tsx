"use client";

import { ProfileOtpVerificationTitle } from "./ProfileOtpVerificationTitle";

type ProfileOtpVerificationContactProps = {
  contactEmail?: string;
  contactPhone?: string;
  contactPhoneCountry?: string;
  displayOtp?: string;
  title?: string;
  subtitle?: string;
  emailVisibleLocalChars?: number;
  className?: string;
};

export function ProfileOtpVerificationContact({
  contactEmail,
  contactPhone,
  contactPhoneCountry,
  displayOtp,
  title,
  subtitle,
  emailVisibleLocalChars,
  className,
}: ProfileOtpVerificationContactProps) {
  return (
    <ProfileOtpVerificationTitle
      contactEmail={contactEmail}
      contactPhone={contactPhone}
      contactPhoneCountry={contactPhoneCountry}
      displayOtp={displayOtp}
      title={title}
      subtitle={subtitle}
      emailVisibleLocalChars={emailVisibleLocalChars}
      className={className}
    />
  );
}
