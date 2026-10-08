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
  resendLabel?: string;
  continueLabel?: string;
};

export function ProfileOtpVerificationForm({
  onSubmit,
  onResend,
  isLoading,
  isResending,
  resendLabel,
  continueLabel,
}: ProfileOtpVerificationFormProps) {
  const labels = useOtpVerificationFormLabels("profile");
  const resolvedLabels = {
    ...labels,
    ...(resendLabel ? { resend: resendLabel } : {}),
    ...(continueLabel ? { continue: continueLabel } : {}),
  };

  return (
    <OtpVerificationForm
      labels={resolvedLabels}
      onSubmit={onSubmit}
      onResend={onResend}
      isLoading={isLoading}
      isResending={isResending}
    />
  );
}
