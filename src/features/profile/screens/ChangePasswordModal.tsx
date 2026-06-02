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
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { useChangePasswordModal } from "../hooks/useChangePasswordModal";

type ChangePasswordModalProps = {
  isOpenChangePassword: boolean;
  setIsOpenChangePassword: Dispatch<SetStateAction<boolean>>;
  isLoading?: boolean;
};

export function ChangePasswordModal({
  isOpenChangePassword,
  setIsOpenChangePassword,
  isLoading: isLoadingProp = false,
}: ChangePasswordModalProps) {
  const { title, description, isSubmitting, closeModal, handleSubmit } =
    useChangePasswordModal({ setIsOpenChangePassword });

  return (
    <Modal open={isOpenChangePassword} onClose={closeModal} size="md">
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
            <ChangePasswordForm
              onSubmit={handleSubmit}
              isLoading={isLoadingProp || isSubmitting}
            />
          </ModalContent>
        </ModalPanel>
      </ModalContainer>
    </Modal>
  );
}

export type { ChangePasswordModalProps };
