"use client";

import type { Dispatch, SetStateAction } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalCloseButton,
  ModalContainer,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalPanel,
  ModalTitle,
} from "@/src/components/ui/modal";
import { EditProfileForm } from "../components/EditProfileForm";
import { useEditProfileModal } from "../hooks/useEditProfileModal";

type EditProfileModalProps = {
  isOpenEditProfile: boolean;
  setIsOpenEditProfile: Dispatch<SetStateAction<boolean>>;
};

export function EditProfileModal({
  isOpenEditProfile,
  setIsOpenEditProfile,
}: EditProfileModalProps) {
  const { title, description, closeModal, formProps } = useEditProfileModal({
    isOpen: isOpenEditProfile,
    setIsOpenEditProfile,
  });

  return (
    <Modal open={isOpenEditProfile} onClose={closeModal} size="md">
      <ModalBackdrop />
      <ModalContainer>
        <ModalPanel size="md">
          <ModalHeader>
            <div className="min-w-0 space-y-1">
              <ModalTitle>{title}</ModalTitle>
              <ModalDescription>{description}</ModalDescription>
            </div>
            <ModalCloseButton />
          </ModalHeader>

          <ModalContent className="px-4 sm:px-6">
            <EditProfileForm {...formProps} />
          </ModalContent>
        </ModalPanel>
      </ModalContainer>
    </Modal>
  );
}

export type { EditProfileModalProps };
