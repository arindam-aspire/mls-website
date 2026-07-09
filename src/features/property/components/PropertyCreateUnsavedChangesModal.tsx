"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Modal,
  ModalBackdrop,
  ModalCloseButton,
  ModalContainer,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalPanel,
  ModalTitle,
} from "@/src/components/ui/modal";

type PropertyCreateUnsavedChangesModalProps = {
  open: boolean;
  title: string;
  description: string;
  saveDraftLabel: string;
  discardLabel: string;
  cancelLabel: string;
  savingDraftLabel: string;
  isSavingDraft?: boolean;
  onSaveDraft: () => void;
  onDiscard: () => void;
  onCancel: () => void;
};

export function PropertyCreateUnsavedChangesModal({
  open,
  title,
  description,
  saveDraftLabel,
  discardLabel,
  cancelLabel,
  savingDraftLabel,
  isSavingDraft = false,
  onSaveDraft,
  onDiscard,
  onCancel,
}: PropertyCreateUnsavedChangesModalProps) {
  return (
    <Modal open={open} onClose={onCancel} size="md">
      <ModalBackdrop />
      <ModalContainer>
        <ModalPanel size="md">
          <ModalCloseButton />

          <ModalContent className="px-4 sm:px-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="inline-flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                <AlertTriangle className="size-6" aria-hidden />
              </span>

              <div className="space-y-1.5">
                <ModalTitle className="text-center">{title}</ModalTitle>
                <ModalDescription className="text-center">
                  {description}
                </ModalDescription>
              </div>
            </div>
          </ModalContent>

          <ModalFooter className="!flex-row flex-nowrap items-stretch gap-2 border-t-0 !justify-center px-3 sm:px-6">
            <Button
              type="button"
              color="secondary"
              variant="ghost"
              size="md"
              className="min-h-11 min-w-0 flex-1 px-2 text-xs leading-snug sm:px-3 sm:text-sm [&>span]:!overflow-visible [&>span]:whitespace-normal"
              onClick={onCancel}
              disabled={isSavingDraft}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              color="danger"
              variant="outline"
              size="md"
              className="min-h-11 min-w-0 flex-1 px-2 text-xs leading-snug sm:px-3 sm:text-sm [&>span]:!overflow-visible [&>span]:whitespace-normal"
              onClick={onDiscard}
              disabled={isSavingDraft}
            >
              {discardLabel}
            </Button>
            <Button
              type="button"
              color="primary"
              variant="solid"
              size="md"
              className="min-h-11 min-w-0 flex-1 px-2 text-xs leading-snug sm:px-3 sm:text-sm [&>span]:!overflow-visible [&>span]:whitespace-normal"
              onClick={onSaveDraft}
              isLoading={isSavingDraft}
              loadingLabel={savingDraftLabel}
            >
              {saveDraftLabel}
            </Button>
          </ModalFooter>
        </ModalPanel>
      </ModalContainer>
    </Modal>
  );
}
