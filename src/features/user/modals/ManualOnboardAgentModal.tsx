"use client";

import { Button } from "@/src/components/ui";
import {
  Modal,
  ModalBackdrop,
  ModalCloseButton,
  ModalContainer,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalPanel,
  ModalTitle,
} from "@/src/components/ui/modal";
import { UserRoundPen } from "lucide-react";
import { ManualOnboardAgentContent } from "../components/ManualOnboardAgentContent";
import type { UseManualOnboardAgentModalReturn } from "../hooks/useManualOnboardAgentModal";

export type ManualOnboardAgentModalProps = UseManualOnboardAgentModalReturn;

export function ManualOnboardAgentModal({
  isOpen,
  closeModal,
  title,
  description,
  cancelLabel,
  primaryActionLabel,
  submittingLabel,
  isSubmitting,
  hasSubmittedSuccessfully,
  onPrimaryAction,
  content,
}: ManualOnboardAgentModalProps) {
  return (
    <Modal open={isOpen} onClose={closeModal} size="md">
      <ModalBackdrop />
      <ModalContainer>
        <ModalPanel size="md">
          <ModalHeader>
            <div className="min-w-0 flex-1 space-y-1">
              <ModalTitle>{title}</ModalTitle>
              <ModalDescription>{description}</ModalDescription>
            </div>
            <ModalCloseButton />
          </ModalHeader>

          <ModalContent className="px-4 sm:px-6">
            <ManualOnboardAgentContent {...content} />
          </ModalContent>

          <ModalFooter className="sm:gap-4">
            <Button
              type="button"
              color="inherit"
              variant="outline"
              size="md"
              className="w-full rounded-lg sm:w-auto"
              disabled={isSubmitting}
              onClick={closeModal}
            >
              {cancelLabel}
            </Button>

            <Button
              type="button"
              color="primary"
              variant="solid"
              size="md"
              className="w-full rounded-lg sm:w-auto"
              iconStart={
                hasSubmittedSuccessfully ? undefined : (
                  <UserRoundPen className="size-4" aria-hidden />
                )
              }
              isLoading={isSubmitting}
              loadingLabel={submittingLabel}
              onClick={onPrimaryAction}
            >
              {primaryActionLabel}
            </Button>
          </ModalFooter>
        </ModalPanel>
      </ModalContainer>
    </Modal>
  );
}
