"use client";

import type { Dispatch, SetStateAction } from "react";
import { Save } from "lucide-react";
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
import {
  EDIT_AGENCY_FORM_ID,
  EditAgencyForm,
} from "../components/EditAgencyForm";
import { useEditAgencyModal } from "../hooks/useEditAgencyModal";
import type { Agency } from "../types/profile.types";

type EditAgencyModalProps = {
  agencyId: string;
  agency: Agency | null;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export function EditAgencyModal({
  agencyId,
  agency,
  isOpen,
  setIsOpen,
}: EditAgencyModalProps) {
  const { title, description, closeModal, formProps, isSubmitting, isSubmitDisabled } =
    useEditAgencyModal({
      agencyId,
      agency,
      isOpen,
      setIsOpen,
    });

  const { labels, isLoading, isSubmitDisabled: formSubmitDisabled } = formProps;

  return (
    <Modal open={isOpen} onClose={closeModal} size="xl">
      <ModalBackdrop />
      <ModalContainer>
        <ModalPanel size="xl">
          <ModalHeader className="py-3 sm:py-4">
            <div className="min-w-0 space-y-0.5">
              <ModalTitle>{title}</ModalTitle>
              <ModalDescription>{description}</ModalDescription>
            </div>
            <ModalCloseButton />
          </ModalHeader>

          <ModalContent className="overflow-visible px-4 py-3 sm:px-6 sm:py-4">
            <EditAgencyForm {...formProps} hideSubmitButton />
          </ModalContent>

          <ModalFooter className="py-3 sm:py-4">
            <Button
              type="button"
              color="primary"
              size="md"
              className="w-full rounded-lg font-semibold sm:ms-auto sm:w-auto sm:min-w-[10rem]"
              isLoading={isLoading}
              loadingLabel={labels.loading}
              disabled={isSubmitDisabled || formSubmitDisabled || isSubmitting}
              iconStart={<Save className="size-4" aria-hidden />}
              onClick={() => {
                const form = document.getElementById(EDIT_AGENCY_FORM_ID);
                if (form instanceof HTMLFormElement) {
                  form.requestSubmit();
                }
              }}
            >
              {labels.submit}
            </Button>
          </ModalFooter>
        </ModalPanel>
      </ModalContainer>
    </Modal>
  );
}

export type { EditAgencyModalProps };
