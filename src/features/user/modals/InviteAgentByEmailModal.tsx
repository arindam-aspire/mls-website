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
import { Link2, Mail } from "lucide-react";
import { cn } from "@/src/lib/cn";
import { InviteAgentByEmailContent } from "../components/InviteAgentByEmailContent";
import type { UseInviteAgentByEmailModalReturn } from "../hooks/useInviteAgentByEmailModal";

export type InviteAgentByEmailModalProps = UseInviteAgentByEmailModalReturn;

export function InviteAgentByEmailModal({
  isOpen,
  closeModal,
  title,
  description,
  cancelLabel,
  primaryActionLabel,
  generatingLabel,
  isGenerating,
  hasGeneratedInvite,
  onPrimaryAction,
  content,
}: InviteAgentByEmailModalProps) {
  return (
    <Modal open={isOpen} onClose={closeModal} size="md">
      <ModalBackdrop />
      <ModalContainer>
        <ModalPanel size="md">
          <ModalHeader className={cn(hasGeneratedInvite && "border-b-0 pb-0")}>
            {!hasGeneratedInvite ? (
              <div className="min-w-0 flex-1 space-y-1">
                <ModalTitle>{title}</ModalTitle>
                <ModalDescription>{description}</ModalDescription>
              </div>
            ) : (
              <div className="min-w-0 flex-1" />
            )}
            <ModalCloseButton />
          </ModalHeader>

          <ModalContent className="px-4 sm:px-6">
            <InviteAgentByEmailContent {...content} />
          </ModalContent>

          <ModalFooter className={cn("sm:gap-4", hasGeneratedInvite && "border-t-0 pt-0")}>
            <Button
              type="button"
              color="inherit"
              variant="outline"
              size="md"
              className="w-full rounded-lg sm:w-auto"
              disabled={isGenerating}
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
                hasGeneratedInvite ? (
                  <Mail className="size-4" aria-hidden />
                ) : (
                  <Link2 className="size-4" aria-hidden />
                )
              }
              isLoading={isGenerating}
              loadingLabel={generatingLabel}
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
