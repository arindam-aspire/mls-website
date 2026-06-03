"use client";

import { ProfileOtpVerificationTitle } from "./ProfileOtpVerificationTitle";

type ProfileOtpVerificationContactProps = {
  contactEmail?: string;
  contactPhone?: string;
  contactPhoneCountry?: string;
  displayOtp?: string;
  className?: string;
};

export function ProfileOtpVerificationContact({
  contactEmail,
  contactPhone,
  contactPhoneCountry,
  displayOtp,
  className,
}: ProfileOtpVerificationContactProps) {
  return (
    <ProfileOtpVerificationTitle
      contactEmail={contactEmail}
      contactPhone={contactPhone}
      contactPhoneCountry={contactPhoneCountry}
      displayOtp={displayOtp}
      className={className}
    />
  );
}
