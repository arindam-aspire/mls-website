"use client";

import type { ReactNode } from "react";
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
import { profileEditModalHeaderClassName } from "../constants/profileEditModal.constants";
import { ProfileEditContactModalTitle } from "./ProfileEditContactModalTitle";
import { ProfileOtpVerificationContact } from "./ProfileOtpVerificationContact";

const titleSectionClassName = "px-4 sm:px-6";

type ProfileEditContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  showBack: boolean;
  onBack?: () => void;
  isFormStep: boolean;
  title: string;
  description?: string;
  otpContact?: {
    contactEmail?: string;
    contactPhone?: string;
    contactPhoneCountry?: string;
    displayOtp?: string;
  };
  children: ReactNode;
};

export function ProfileEditContactModal({
  isOpen,
  onClose,
  showBack,
  onBack,
  isFormStep,
  title,
  description,
  otpContact,
  children,
}: ProfileEditContactModalProps) {
  const tAuth = useTranslations("auth");

  return (
    <Modal open={isOpen} onClose={onClose} size="md">
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
            ) : otpContact != null ? (
              <ProfileOtpVerificationContact
                contactEmail={otpContact.contactEmail}
                contactPhone={otpContact.contactPhone}
                contactPhoneCountry={otpContact.contactPhoneCountry}
                displayOtp={otpContact.displayOtp}
                className={titleSectionClassName}
              />
            ) : null}

            <div className="px-4 pb-4 sm:px-6 sm:pb-6">{children}</div>
          </ModalContent>
        </ModalPanel>
      </ModalContainer>
    </Modal>
  );
}
