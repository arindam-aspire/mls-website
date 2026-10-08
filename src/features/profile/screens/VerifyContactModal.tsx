"use client";

import { ProfileEditContactModal } from "../components/ProfileEditContactModal";
import { ProfileOtpVerificationForm } from "../components/ProfileOtpVerificationForm";
import type { ContactVerificationChannel } from "../types/profile.types";

type VerifyContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  verificationType: ContactVerificationChannel | null;
  contactEmail?: string;
  contactPhone?: string;
  contactPhoneCountry?: string;
  title: string;
  subtitle: string;
  resendLabel: string;
  confirmLabel: string;
  emailVisibleLocalChars?: number;
  otpSessionKey: number;
  onSubmit: (code: string) => void;
  onResend: () => void;
  isLoading: boolean;
  isResending: boolean;
};

export function VerifyContactModal({
  isOpen,
  onClose,
  verificationType,
  contactEmail,
  contactPhone,
  contactPhoneCountry,
  title,
  subtitle,
  resendLabel,
  confirmLabel,
  emailVisibleLocalChars,
  otpSessionKey,
  onSubmit,
  onResend,
  isLoading,
  isResending,
}: VerifyContactModalProps) {
  const isEmail = verificationType === "email";

  return (
    <ProfileEditContactModal
      isOpen={isOpen}
      onClose={onClose}
      showBack={false}
      isFormStep={false}
      title={title}
      otpContact={
        verificationType == null
          ? undefined
          : {
              contactEmail: isEmail ? contactEmail : undefined,
              contactPhone: isEmail ? undefined : contactPhone,
              contactPhoneCountry,
              title,
              subtitle,
              emailVisibleLocalChars,
            }
      }
    >
      {isOpen && verificationType != null ? (
        <ProfileOtpVerificationForm
          key={`${verificationType}-${otpSessionKey}`}
          onSubmit={onSubmit}
          onResend={onResend}
          isLoading={isLoading}
          isResending={isResending}
          resendLabel={resendLabel}
          continueLabel={confirmLabel}
        />
      ) : null}
    </ProfileEditContactModal>
  );
}

export type { VerifyContactModalProps };
