"use client";

import {
  OtpVerificationForm,
  useOtpVerificationFormLabels,
} from "@/src/components/ui/otp-verification";

type ProfileOtpVerificationFormProps = {
  onSubmit: (code: string) => void;
  onResend: () => void;
  isLoading: boolean;
  isResending: boolean;
};

export function ProfileOtpVerificationForm({
  onSubmit,
  onResend,
  isLoading,
  isResending,
}: ProfileOtpVerificationFormProps) {
  const labels = useOtpVerificationFormLabels("profile");

  return (
    <OtpVerificationForm
      labels={labels}
      onSubmit={onSubmit}
      onResend={onResend}
      isLoading={isLoading}
      isResending={isResending}
    />
  );
}
