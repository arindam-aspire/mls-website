"use client";

import type { Dispatch, SetStateAction } from "react";
import { EditPhoneForm } from "../components/EditPhoneForm";
import { ProfileEditContactModal } from "../components/ProfileEditContactModal";
import { ProfileOtpVerificationForm } from "../components/ProfileOtpVerificationForm";
import { useEditPhoneModal } from "../hooks/useEditPhoneModal";

type EditPhoneModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export function EditPhoneModal({ isOpen, setIsOpen }: EditPhoneModalProps) {
  const {
    step,
    title,
    description,
    showBack,
    onBack,
    closeModal,
    formProps,
    otpProps,
  } = useEditPhoneModal({
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
              contactPhone: otpProps.contactPhone,
              contactPhoneCountry: otpProps.contactPhoneCountry,
              displayOtp: otpProps.displayOtp,
            }
      }
    >
      {isFormStep ? (
        <EditPhoneForm {...formProps} />
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

export type { EditPhoneModalProps };
