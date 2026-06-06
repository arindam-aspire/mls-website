"use client";

import {
  Modal,
  ModalBackdrop,
  ModalCloseButton,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalPanel,
  ModalTitle,
} from "@/src/components/ui/modal";
import type { SavedSearchRecord } from "../types/savedSearch.types";
import { SearchCriteriaForm } from "../components/SearchCriteriaForm";

type SaveSearchFormModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  record?: SavedSearchRecord;
};

export function SaveSearchFormModal({
  open,
  onClose,
  title,
  record,
}: SaveSearchFormModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="xl">
      <ModalBackdrop />
      <ModalContainer>
        <ModalPanel size="xl">
          <ModalHeader className="border-b-0">
            <div className="min-w-0">
              <ModalTitle>{title}</ModalTitle>
            </div>
            <ModalCloseButton />
          </ModalHeader>

          <ModalContent className="!pt-0 max-h-[min(85vh,48rem)] overflow-y-auto px-4 sm:px-6">
            <SearchCriteriaForm
              key={record?.id ?? "create"}
              record={record}
              onCancel={onClose}
            />
          </ModalContent>
        </ModalPanel>
      </ModalContainer>
    </Modal>
  );
}
