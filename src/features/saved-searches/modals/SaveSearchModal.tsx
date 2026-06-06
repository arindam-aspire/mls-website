"use client";

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
import { SaveSearchForm } from "../components/SaveSearchForm";
import { useSaveSearchModal } from "../hooks/useSaveSearchModal";
import type {
  SavedSearchCriteria,
  SaveSearchFilterItem,
} from "../types/savedSearch.types";

type SaveSearchModalProps = {
  open: boolean;
  onClose: () => void;
  filterItems: SaveSearchFilterItem[];
  searchCriteria: SavedSearchCriteria;
  savedSearchId?: string;
  initialName?: string;
};

export function SaveSearchModal({
  open,
  onClose,
  filterItems,
  searchCriteria,
  savedSearchId,
  initialName = "",
}: SaveSearchModalProps) {
  const { title, description, closeModal, handleSave, isSaving, isUpdateMode } =
    useSaveSearchModal({
      onClose,
      searchCriteria,
      savedSearchId,
    });

  return (
    <Modal open={open} onClose={closeModal} size="md">
      <ModalBackdrop />
      <ModalContainer>
        <ModalPanel size="md">
          <ModalHeader className="border-b-0">
            <div className="min-w-0 space-y-1">
              <ModalTitle>{title}</ModalTitle>
              <ModalDescription>{description}</ModalDescription>
            </div>
            <ModalCloseButton />
          </ModalHeader>

          <ModalContent className="px-4 !pt-0 sm:px-6">
            <SaveSearchForm
              key={`${savedSearchId ?? "create"}-${initialName}`}
              filterItems={filterItems}
              initialName={initialName}
              mode={isUpdateMode ? "update" : "create"}
              onCancel={closeModal}
              onSubmit={handleSave}
              isLoading={isSaving}
            />
          </ModalContent>
        </ModalPanel>
      </ModalContainer>
    </Modal>
  );
}
