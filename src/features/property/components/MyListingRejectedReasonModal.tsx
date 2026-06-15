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
  ModalTitle,
} from "@/src/components/ui/modal";
import { cn } from "@/src/lib/cn";
import { MessageSquareText } from "lucide-react";

type MyListingRejectedReasonModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  reason: string;
  emptyReason: string;
  closeLabel: string;
};

export function MyListingRejectedReasonModal({
  open,
  onClose,
  title,
  reason,
  emptyReason,
  closeLabel,
}: MyListingRejectedReasonModalProps) {
  const hasReason = Boolean(reason.trim());

  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalBackdrop />
      <ModalContainer>
        <ModalPanel>
          <ModalHeader>
            <div className="flex min-w-0 items-start gap-3 pe-10 sm:pe-12">
              <span
                className={cn(
                  "inline-flex size-10 shrink-0 items-center justify-center rounded-xl",
                  "bg-danger/10 text-danger",
                )}
                aria-hidden
              >
                <MessageSquareText className="size-5" />
              </span>
              <ModalTitle className="pt-1">{title}</ModalTitle>
            </div>
            <ModalCloseButton />
          </ModalHeader>

          <ModalContent className="px-4 sm:px-6">
            <div
              className={cn(
                "rounded-xl border border-secondary/15 bg-page p-4 sm:p-5",
                !hasReason && "text-center",
              )}
            >
              <p
                className={cn(
                  "whitespace-pre-wrap text-sm leading-relaxed text-text",
                  !hasReason && "text-muted",
                )}
              >
                {hasReason ? reason : emptyReason}
              </p>
            </div>
          </ModalContent>

          <ModalFooter className="!flex-row !justify-end">
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
