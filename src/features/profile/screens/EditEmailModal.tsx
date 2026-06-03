"use client";

import type { Dispatch, SetStateAction } from "react";
import { EditEmailForm } from "../components/EditEmailForm";
import { ProfileEditContactModal } from "../components/ProfileEditContactModal";
import { ProfileOtpVerificationForm } from "../components/ProfileOtpVerificationForm";
import { useEditEmailModal } from "../hooks/useEditEmailModal";

type EditEmailModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export function EditEmailModal({ isOpen, setIsOpen }: EditEmailModalProps) {
  const {
    step,
    title,
    description,
    showBack,
    onBack,
    closeModal,
    formProps,
    otpProps,
  } = useEditEmailModal({
    isOpen,
    setIsOpen,
  });

  const isFormStep = step === "form";

  return (
    <ProfileEditContactModal
      isOpen={isOpen}
      onClose={closeModal}
      showBack={showBack}
      onBack={onBack}
      isFormStep={isFormStep}
      title={title}
      description={description}
      otpContact={
        isFormStep
          ? undefined
          : {
              contactEmail: otpProps.contactEmail,
              displayOtp: otpProps.displayOtp,
            }
      }
    >
      {isFormStep ? (
        <EditEmailForm {...formProps} />
      ) : (
        <ProfileOtpVerificationForm
          onSubmit={otpProps.onSubmit}
          onResend={otpProps.onResend}
          isLoading={otpProps.isLoading}
          isResending={otpProps.isResending}
        />
      )}
    </ProfileEditContactModal>
  );
}

export type { EditEmailModalProps };
