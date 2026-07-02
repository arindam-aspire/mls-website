"use client";

import { Button, Textarea } from "@/src/components/ui";
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
import { cn } from "@/src/lib/cn";
import { XCircle } from "lucide-react";
import { useRejectSubmissionModal } from "../hooks/useRejectSubmissionModal";

type RejectSubmissionModalProps = {
  open: boolean;
  listingTitle: string;
  isSubmitting?: boolean;
  title?: string;
  description?: string;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  submitLabel?: string;
  submittingLabel?: string;
  onClose: () => void;
  onSubmit: (reason: string) => void;
};

export function RejectSubmissionModal({
  open,
  listingTitle,
  isSubmitting = false,
  title: titleOverride,
  description: descriptionOverride,
  reasonLabel: reasonLabelOverride,
  reasonPlaceholder: reasonPlaceholderOverride,
  submitLabel: submitLabelOverride,
  submittingLabel: submittingLabelOverride,
  onClose,
  onSubmit,
}: RejectSubmissionModalProps) {
  const {
    title,
    description,
    reason,
    reasonLabel,
    reasonPlaceholder,
    submitLabel,
    submittingLabel,
    cancelLabel,
    closeModal,
    onReasonChange,
    onConfirm,
  } = useRejectSubmissionModal({
    open,
    listingTitle,
    isSubmitting,
    title: titleOverride,
    description: descriptionOverride,
    reasonLabel: reasonLabelOverride,
    reasonPlaceholder: reasonPlaceholderOverride,
    submitLabel: submitLabelOverride,
    submittingLabel: submittingLabelOverride,
    onClose,
    onSubmit,
  });

  return (
    <Modal open={open} onClose={closeModal} size="md">
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
            <Textarea
              label={reasonLabel}
              placeholder={reasonPlaceholder}
              value={reason}
              rows={5}
              disabled={isSubmitting}
              onChange={(event) => onReasonChange(event.target.value)}
              textareaClassName="min-h-28 rounded-lg"
              className="w-full"
            />
          </ModalContent>

          <ModalFooter
            className={cn(
              "flex flex-col gap-3 border-t border-secondary/10 px-4 pt-4 sm:flex-row sm:justify-end sm:px-6",
            )}
          >
            <Button
              type="button"
              color="inherit"
              variant="ghost"
              size="md"
              className="w-full rounded-lg sm:w-auto"
              disabled={isSubmitting}
              onClick={closeModal}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              color="danger"
              variant="solid"
              size="md"
              className="w-full rounded-lg sm:w-auto"
              iconStart={<XCircle className="size-4" aria-hidden />}
              isLoading={isSubmitting}
              loadingLabel={submittingLabel}
              onClick={onConfirm}
            >
              {submitLabel}
            </Button>
          </ModalFooter>
        </ModalPanel>
      </ModalContainer>
    </Modal>
  );
}

export type { RejectSubmissionModalProps };
