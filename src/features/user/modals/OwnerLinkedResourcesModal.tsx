"use client";

import { Button, Skeleton } from "@/src/components/ui";
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
import type { UseOwnerLinkedResourcesModalReturn } from "../hooks/useOwnerLinkedResourcesModal";

type OwnerLinkedResourcesModalProps = Omit<
  UseOwnerLinkedResourcesModalReturn,
  "openProperties" | "openLeads"
>;

export function OwnerLinkedResourcesModal({
  open,
  title,
  description,
  closeLabel,
  loadingLabel,
  emptyTitle,
  emptyDescription,
  errorTitle,
  errorDescription,
  previousLabel,
  nextLabel,
  pageLabel,
  isLoading,
  isError,
  isEmpty,
  columns,
  rows,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  closeModal,
}: OwnerLinkedResourcesModalProps) {
  return (
    <Modal open={open} onClose={closeModal} size="lg">
      <ModalBackdrop />
      <ModalContainer>
        <ModalPanel size="lg">
          <ModalHeader>
            <div className="min-w-0 space-y-1">
              <ModalTitle>{title}</ModalTitle>
              <ModalDescription>{description}</ModalDescription>
            </div>
            <ModalCloseButton />
          </ModalHeader>

          <ModalContent className="space-y-4 px-4 sm:px-6">
            {isLoading ? (
              <div className="space-y-3" aria-hidden aria-label={loadingLabel}>
                <Skeleton variant="block" className="h-10 w-full rounded-xl" />
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="block"
                    className="h-12 w-full rounded-xl"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-xl border border-danger/20 bg-danger/5 p-4">
                <p className="text-sm font-semibold text-danger">{errorTitle}</p>
                <p className="mt-1 text-sm text-muted">{errorDescription}</p>
              </div>
            ) : isEmpty ? (
              <div className="rounded-xl border border-secondary/15 bg-page px-4 py-8 text-center">
                <p className="text-sm font-semibold text-text">{emptyTitle}</p>
                <p className="mt-1 text-sm text-muted">{emptyDescription}</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-secondary/15">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-secondary/10 text-sm">
                    <thead className="bg-page">
                      <tr className="text-left text-xs font-semibold uppercase text-muted">
                        {columns.map((column) => (
                          <th key={column.key} className="px-4 py-3">
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary/10 bg-surface">
                      {rows.map((row) => (
                        <tr key={row.id}>
                          {columns.map((column) => (
                            <td
                              key={`${row.id}-${column.key}`}
                              className="max-w-[14rem] truncate px-4 py-3 text-text"
                            >
                              {row[column.key] ?? ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </ModalContent>

          <ModalFooter className="flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm text-muted">{pageLabel}</p>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button
                type="button"
                color="inherit"
                variant="outline"
                size="md"
                className="w-full rounded-lg sm:w-auto"
                disabled={!hasPrevious || isLoading}
                onClick={onPrevious}
              >
                {previousLabel}
              </Button>
              <Button
                type="button"
                color="inherit"
                variant="outline"
                size="md"
                className="w-full rounded-lg sm:w-auto"
                disabled={!hasNext || isLoading}
                onClick={onNext}
              >
                {nextLabel}
              </Button>
              <Button
                type="button"
                color="primary"
                variant="solid"
                size="md"
                className="w-full rounded-lg sm:w-auto"
                onClick={closeModal}
              >
                {closeLabel}
              </Button>
            </div>
          </ModalFooter>
        </ModalPanel>
      </ModalContainer>
    </Modal>
  );
}
