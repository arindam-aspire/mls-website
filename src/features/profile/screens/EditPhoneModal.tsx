"use client";

import type { Dispatch, SetStateAction } from "react";
import { useTranslations } from "next-intl";
import {
  Modal,
  ModalBackdrop,
  ModalBackButton,
  ModalCloseButton,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalPanel,
} from "@/src/components/ui/modal";
import { ProfileEditContactModalTitle } from "../components/ProfileEditContactModalTitle";
import { EditPhoneForm } from "../components/EditPhoneForm";
import { ProfileOtpVerificationForm } from "../components/ProfileOtpVerificationForm";
import { ProfileOtpVerificationTitle } from "../components/ProfileOtpVerificationTitle";
import { profileEditModalHeaderClassName } from "../constants/profileEditModal.constants";
import { useEditPhoneModal } from "../hooks/useEditPhoneModal";

type EditPhoneModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export function EditPhoneModal({ isOpen, setIsOpen }: EditPhoneModalProps) {
  const tAuth = useTranslations("auth");
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
  const titleSectionClassName = "px-4 sm:px-6";

  return (
    <Modal open={isOpen} onClose={closeModal} size="md">
      <ModalBackdrop />
      <ModalContainer>
        <ModalPanel size="md">
          <ModalHeader className={profileEditModalHeaderClassName}>
            {showBack && onBack != null ? (
              <ModalBackButton aria-label={tAuth("goBack")} onClick={onBack} />
            ) : null}
          </ModalHeader>
          <ModalCloseButton />

          <ModalContent className="!py-0 sm:!py-0">
            {isFormStep ? (
              <ProfileEditContactModalTitle
                title={title}
                description={description}
                className={titleSectionClassName}
              />
            ) : (
              <ProfileOtpVerificationTitle
                contactPhone={otpProps.contactPhone}
                contactPhoneCountry={otpProps.contactPhoneCountry}
                displayOtp={otpProps.displayOtp}
                className={titleSectionClassName}
              />
            )}

            <div className="px-4 pb-4 sm:px-6 sm:pb-6">
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
            </div>
          </ModalContent>
        </ModalPanel>
      </ModalContainer>
    </Modal>
  );
}

export type { EditPhoneModalProps };
