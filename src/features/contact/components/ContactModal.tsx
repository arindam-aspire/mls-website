"use client";

import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import {
  Button,
  CheckboxField,
  Input,
  PhoneInput,
  Textarea,
} from "@/src/components/ui";
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
import type { UseContactModalReturn } from "../hooks/useContactModal";

type ContactModalProps = {
  contactModal: UseContactModalReturn;
};

export function ContactModal({ contactModal }: ContactModalProps) {
  const {
    open,
    mode,
    context,
    form,
    errors,
    isSubmitting,
    callConfirmOpen,
    labels,
    close,
    setField,
    setPhone,
    onPrimaryAction,
    confirmCall,
    cancelCallConfirm,
  } = contactModal;

  if (!context) {
    return (
      <ConfirmModal
        open={false}
        onClose={cancelCallConfirm}
        onConfirm={confirmCall}
        title={labels.callConfirmTitle}
      />
    );
  }

  const title =
    mode === "email"
      ? labels.emailTitle
      : mode === "whatsapp"
        ? labels.whatsappTitle
        : labels.callTitle;

  const primaryLabel =
    mode === "call" ? labels.callConfirmLabel : labels.sendLabel;

  return (
    <>
      <Modal open={open} onClose={close} size="md">
        <ModalBackdrop />
        <ModalContainer>
          <ModalPanel size="md">
            <ModalHeader>
              <ModalTitle>{title}</ModalTitle>
              <ModalCloseButton />
            </ModalHeader>

            {mode === "call" ? (
              <>
                <ModalDescription className="px-4 sm:px-6">
                  {labels.callConfirmDescription}
                </ModalDescription>
                <ModalContent className="space-y-3 px-4 sm:space-y-4 sm:px-6">
                  <dl className="space-y-3 text-sm">
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
                      <dt className="text-muted">{labels.agencyNameLabel}</dt>
                      <dd className="font-medium text-text sm:text-end">
                        {context.recipientName || "—"}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
                      <dt className="text-muted">{labels.phoneNumberLabel}</dt>
                      <dd className="font-medium text-text sm:text-end" dir="ltr">
                        {context.recipientPhone || "—"}
                      </dd>
                    </div>
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between sm:gap-4">
                      <dt className="text-muted">{labels.propertyLabel}</dt>
                      <dd className="font-medium text-text sm:text-end">
                        {context.propertyTitle
                          ? `${context.propertyTitle}${
                              context.propertyReference
                                ? ` — #${context.propertyReference}`
                                : ""
                            }`
                          : context.propertyReference
                            ? `#${context.propertyReference}`
                            : "—"}
                      </dd>
                    </div>
                  </dl>
                </ModalContent>
              </>
            ) : (
              <>
                <ModalDescription className="space-y-1 px-4 sm:px-6">
                  <span className="block">
                    {labels.toLabel}: {context.recipientName || "—"}
                  </span>
                  {mode === "email" ? (
                    <span className="block">
                      {labels.sentToLabel}: {context.recipientEmail || "—"}
                    </span>
                  ) : (
                    <span className="block" dir="ltr">
                      {labels.sentToLabel}:{" "}
                      {context.recipientWhatsApp?.trim() ||
                        context.recipientPhone ||
                        "—"}
                    </span>
                  )}
                </ModalDescription>
                <ModalContent className="space-y-4 px-4 sm:px-6">
                  <Input
                    label={labels.nameLabel}
                    isRequired
                    value={form.name}
                    onChange={(event) => setField("name", event.target.value)}
                    error={errors.name}
                    autoComplete="name"
                  />
                  <Input
                    label={labels.emailLabel}
                    type="email"
                    isRequired
                    value={form.email}
                    onChange={(event) => setField("email", event.target.value)}
                    error={errors.email}
                    autoComplete="email"
                  />
                  <PhoneInput
                    label={labels.phoneLabel}
                    placeholder={labels.phonePlaceholder}
                    countryCode={form.phoneCountryCode}
                    nationalNumber={form.phoneNationalNumber}
                    onChange={setPhone}
                    error={errors.phone}
                    searchPlaceholder={labels.phoneSearchPlaceholder}
                    emptySearchLabel={labels.phoneEmptySearchLabel}
                    showPhoneIcon={false}
                    autoComplete="tel-national"
                  />
                  <Textarea
                    label={labels.messageLabel}
                    isRequired
                    value={form.message}
                    onChange={(event) => setField("message", event.target.value)}
                    error={errors.message}
                    rows={5}
                  />
                  <CheckboxField
                    checked={form.keepInformed}
                    onChange={(checked) => setField("keepInformed", checked)}
                    label={labels.keepInformedLabel}
                  />
                </ModalContent>
              </>
            )}

            <ModalFooter>
              <Button
                type="button"
                variant="outline"
                color="secondary"
                className="min-h-11"
                onClick={close}
              >
                {labels.cancelLabel}
              </Button>
              <Button
                type="button"
                className="min-h-11"
                isLoading={isSubmitting}
                onClick={onPrimaryAction}
              >
                {primaryLabel}
              </Button>
            </ModalFooter>
          </ModalPanel>
        </ModalContainer>
      </Modal>

      <ConfirmModal
        open={callConfirmOpen}
        onClose={cancelCallConfirm}
        onConfirm={confirmCall}
        variant="primary"
        title={labels.callConfirmTitle}
        description={
          context.recipientPhone
            ? `${labels.callConfirmDescription}\n${context.recipientName} · ${context.recipientPhone}`
            : labels.callConfirmDescription
        }
        confirmLabel={labels.callConfirmLabel}
        cancelLabel={labels.callCancelLabel}
      />
    </>
  );
}
