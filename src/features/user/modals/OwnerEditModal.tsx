"use client";

import { Button, Input } from "@/src/components/ui";
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
import type { UseOwnerEditModalReturn } from "../hooks/useOwnerEditModal";

type OwnerEditModalProps = NonNullable<UseOwnerEditModalReturn["modal"]>;

export function OwnerEditModal({
  open,
  title,
  description,
  fullNameLabel,
  emailLabel,
  phoneLabel,
  saveLabel,
  cancelLabel,
  savingLabel,
  form,
  errors,
  isSaving,
  onFieldChange,
  onClose,
  onSubmit,
}: OwnerEditModalProps) {
  return (
    <Modal open={open} onClose={onClose} size="md">
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

          <ModalContent className="space-y-4 px-4 sm:px-6">
            <Input
              label={fullNameLabel}
              value={form.fullName}
              onChange={(event) => onFieldChange("fullName", event.target.value)}
              error={errors.fullName}
              disabled={isSaving}
            />
            <Input
              label={emailLabel}
              type="email"
              value={form.email}
              onChange={(event) => onFieldChange("email", event.target.value)}
              error={errors.email}
              disabled={isSaving}
            />
            <Input
              label={phoneLabel}
              value={form.phone}
              onChange={(event) => onFieldChange("phone", event.target.value)}
              error={errors.phone}
              disabled={isSaving}
            />
          </ModalContent>

          <ModalFooter className="flex flex-col-reverse gap-2 px-4 sm:flex-row sm:justify-end sm:px-6">
            <Button
              type="button"
              color="inherit"
              variant="outline"
              size="md"
              className="w-full rounded-lg sm:w-auto"
              disabled={isSaving}
              onClick={onClose}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              color="primary"
              variant="solid"
              size="md"
              className="w-full rounded-lg sm:w-auto"
              isLoading={isSaving}
              loadingLabel={savingLabel}
              onClick={onSubmit}
            >
              {saveLabel}
            </Button>
          </ModalFooter>
        </ModalPanel>
      </ModalContainer>
    </Modal>
  );
}
