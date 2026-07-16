"use client";

import { Button } from "@/src/components/ui";
import { Skeleton } from "@/src/components/ui/skeleton";
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
import type { UseOwnerViewModalReturn } from "../hooks/useOwnerViewModal";

type OwnerViewModalProps = Omit<
  UseOwnerViewModalReturn,
  "openModal"
>;

export function OwnerViewModal({
  open,
  title,
  description,
  closeLabel,
  loadingLabel,
  errorTitle,
  errorDescription,
  isLoading,
  isError,
  fields,
  closeModal,
}: OwnerViewModalProps) {
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

          <ModalContent className="space-y-3 px-4 sm:space-y-4 sm:px-6">
            {isLoading ? (
              <div className="space-y-3" aria-hidden aria-label={loadingLabel}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="space-y-1.5">
                    <Skeleton variant="text" className="h-3 w-24" />
                    <Skeleton variant="text" className="h-5 w-full" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-xl border border-danger/20 bg-danger/5 p-4">
                <p className="text-sm font-semibold text-danger">{errorTitle}</p>
                <p className="mt-1 text-sm text-muted">{errorDescription}</p>
              </div>
            ) : (
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {fields.map((field) => (
                  <div key={field.key} className="min-w-0">
                    <dt className="text-xs font-medium text-muted">{field.label}</dt>
                    <dd className="mt-1 truncate text-sm font-medium text-text">
                      {field.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </ModalContent>

          <ModalFooter className="px-4 sm:px-6">
            <Button
              type="button"
              color="inherit"
              variant="outline"
              size="md"
              className="w-full rounded-lg sm:w-auto"
              onClick={closeModal}
            >
              {closeLabel}
            </Button>
          </ModalFooter>
        </ModalPanel>
      </ModalContainer>
    </Modal>
  );
}
