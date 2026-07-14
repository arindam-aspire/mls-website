"use client";

import { Button } from "@/src/components/ui";
import {
  Modal,
  ModalBackdrop,
  ModalCloseButton,
  ModalContainer,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalPanel,
} from "@/src/components/ui/modal";
import { InviteAgentReadyPanel } from "../components/InviteAgentReadyPanel";

export type CopyInvitationLinkModalProps = {
  open: boolean;
  onClose: () => void;
  readyTitle: string;
  generatedMessage: string;
  shareHint: string;
  linkLabel: string;
  inviteLink: string;
  copyLinkLabel: string;
  closeLabel: string;
  onCopyLink: () => void;
};

export function CopyInvitationLinkModal({
  open,
  onClose,
  readyTitle,
  generatedMessage,
  shareHint,
  linkLabel,
  inviteLink,
  copyLinkLabel,
  closeLabel,
  onCopyLink,
}: CopyInvitationLinkModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalBackdrop />
      <ModalContainer>
        <ModalPanel size="md">
          <ModalHeader className="border-b-0 pb-0">
            <div className="min-w-0 flex-1" />
            <ModalCloseButton />
          </ModalHeader>

          <ModalContent className="px-4 sm:px-6">
            <InviteAgentReadyPanel
              readyTitle={readyTitle}
              generatedMessage={generatedMessage}
              shareHint={shareHint}
              linkLabel={linkLabel}
              inviteLink={inviteLink}
              copyLinkLabel={copyLinkLabel}
              onCopyLink={onCopyLink}
            />
          </ModalContent>

          <ModalFooter className="border-t-0 pt-0 sm:gap-4">
            <Button
              type="button"
              color="primary"
              variant="solid"
              size="md"
              className="w-full rounded-lg sm:w-auto"
              onClick={onClose}
            >
              {closeLabel}
            </Button>
          </ModalFooter>
        </ModalPanel>
      </ModalContainer>
    </Modal>
  );
}
