"use client";

import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import {
  DEFAULT_PHONE_INPUT_COUNTRY_CODE,
  type PhoneInputCountry,
} from "@/src/components/ui/phone-input";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useToast } from "@/src/hooks/useToast";
import {
  launchEmailTo,
  launchPhoneCall,
  launchWhatsAppChat,
} from "@/src/features/property/utils/propertyContactActions.utils";
import { parseStoredPhoneNumber } from "@/src/features/profile/utils/parseStoredPhoneNumber";
import type {
  ContactModalContext,
  ContactModalFormValues,
  ContactModalLabels,
  ContactModalMode,
  ContactModalOpenParams,
} from "../types/contactModal.types";
import {
  buildMailtoHref,
  buildWhatsAppShareText,
  resolveWhatsAppPhone,
} from "../utils/contactMessage.utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM: ContactModalFormValues = {
  name: "",
  email: "",
  phone: "",
  phoneCountryCode: DEFAULT_PHONE_INPUT_COUNTRY_CODE,
  phoneNationalNumber: "",
  message: "",
  keepInformed: false,
};

function formatContactPhone(
  country: PhoneInputCountry,
  nationalNumber: string,
): string {
  const digits = nationalNumber.replace(/\D/g, "");
  if (!digits) return "";
  return `${country.dialCode} ${digits}`;
}

export function useContactModal() {
  const t = useTranslations("contact");
  const toast = useToast();
  const user = useAuthStore((state) => state.user);

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ContactModalMode>("email");
  const [context, setContext] = useState<ContactModalContext | null>(null);
  const [form, setForm] = useState<ContactModalFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactModalFormValues, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [callConfirmOpen, setCallConfirmOpen] = useState(false);

  const labels: ContactModalLabels = useMemo(
    () => ({
      emailTitle: t("emailTitle"),
      whatsappTitle: t("whatsappTitle"),
      callTitle: t("callTitle"),
      toLabel: t("toLabel"),
      sentToLabel: t("sentToLabel"),
      nameLabel: t("nameLabel"),
      emailLabel: t("emailLabel"),
      phoneLabel: t("phoneLabel"),
      phonePlaceholder: t("phonePlaceholder"),
      phoneSearchPlaceholder: t("phoneSearchPlaceholder"),
      phoneEmptySearchLabel: t("phoneEmptySearchLabel"),
      messageLabel: t("messageLabel"),
      keepInformedLabel: t("keepInformedLabel"),
      agencyNameLabel: t("agencyNameLabel"),
      phoneNumberLabel: t("phoneNumberLabel"),
      propertyLabel: t("propertyLabel"),
      sendLabel: t("sendLabel"),
      cancelLabel: t("cancelLabel"),
      callConfirmTitle: t("callConfirmTitle"),
      callConfirmDescription: t("callConfirmDescription"),
      callConfirmLabel: t("callConfirmLabel"),
      callCancelLabel: t("callCancelLabel"),
      nameRequired: t("validation.nameRequired"),
      emailRequired: t("validation.emailRequired"),
      emailInvalid: t("validation.emailInvalid"),
      messageRequired: t("validation.messageRequired"),
      missingRecipientEmail: t("errors.missingRecipientEmail"),
      missingRecipientPhone: t("errors.missingRecipientPhone"),
      sendErrorTitle: t("errors.sendErrorTitle"),
    }),
    [t],
  );

  const buildDefaultMessage = useCallback(
    (propertyTitle: string, propertyReference: string) =>
      t("defaultMessageTemplate", {
        propertyTitle: propertyTitle || "—",
        propertyReference: propertyReference || "—",
      }),
    [t],
  );

  const resetFormFromContext = useCallback(
    (nextContext: ContactModalContext) => {
      const rawPhone =
        nextContext.customerPhone || user?.phone_number?.trim() || "";
      const parsed = parseStoredPhoneNumber(rawPhone);

      setForm({
        name: nextContext.customerName || user?.full_name?.trim() || "",
        email: nextContext.customerEmail || user?.email?.trim() || "",
        phone: parsed.formatted || rawPhone,
        phoneCountryCode: parsed.countryCode,
        phoneNationalNumber: parsed.nationalNumber,
        message: nextContext.defaultMessage?.trim() || "",
        keepInformed: false,
      });
      setErrors({});
    },
    [user],
  );

  const close = useCallback(() => {
    setOpen(false);
    setCallConfirmOpen(false);
    setIsSubmitting(false);
    setContext(null);
    setForm(EMPTY_FORM);
    setErrors({});
  }, []);

  const openContact = useCallback(
    ({ mode: nextMode, context: nextContext }: ContactModalOpenParams) => {
      if (nextMode === "email" && !nextContext.recipientEmail.trim()) {
        toast.error(labels.sendErrorTitle, {
          description: labels.missingRecipientEmail,
        });
        return;
      }

      if (
        (nextMode === "whatsapp" || nextMode === "call") &&
        !resolveWhatsAppPhone(nextContext) &&
        !nextContext.recipientPhone.trim()
      ) {
        toast.error(labels.sendErrorTitle, {
          description: labels.missingRecipientPhone,
        });
        return;
      }

      setMode(nextMode);
      setContext(nextContext);
      resetFormFromContext(nextContext);
      setOpen(true);
      setCallConfirmOpen(false);
    },
    [labels, resetFormFromContext, toast],
  );

  const setField = useCallback(
    <K extends keyof ContactModalFormValues>(
      key: K,
      value: ContactModalFormValues[K],
    ) => {
      setForm((previous) => ({ ...previous, [key]: value }));
      setErrors((previous) => {
        if (!previous[key]) return previous;
        const next = { ...previous };
        delete next[key];
        return next;
      });
    },
    [],
  );

  const setPhone = useCallback(
    (payload: { country: PhoneInputCountry; nationalNumber: string }) => {
      setForm((previous) => ({
        ...previous,
        phoneCountryCode: payload.country.iso2,
        phoneNationalNumber: payload.nationalNumber,
        phone: formatContactPhone(payload.country, payload.nationalNumber),
      }));
      setErrors((previous) => {
        if (!previous.phone) return previous;
        const next = { ...previous };
        delete next.phone;
        return next;
      });
    },
    [],
  );

  const validateForm = useCallback((): boolean => {
    const nextErrors: Partial<Record<keyof ContactModalFormValues, string>> =
      {};
    if (!form.name.trim()) {
      nextErrors.name = labels.nameRequired;
    }
    if (!form.email.trim()) {
      nextErrors.email = labels.emailRequired;
    } else if (!EMAIL_PATTERN.test(form.email.trim())) {
      nextErrors.email = labels.emailInvalid;
    }
    if (!form.message.trim()) {
      nextErrors.message = labels.messageRequired;
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [form, labels]);

  const submitEmailOrWhatsApp = useCallback(() => {
    if (!context) return;
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (mode === "email") {
        const to = context.recipientEmail.trim();
        if (!to) {
          toast.error(labels.sendErrorTitle, {
            description: labels.missingRecipientEmail,
          });
          return;
        }

        const subject = t("emailSubject", {
          propertyTitle: context.propertyTitle,
          propertyReference: context.propertyReference,
        });

        const bodyLines = [
          form.message.trim(),
          "",
          `${labels.nameLabel}: ${form.name.trim()}`,
          `${labels.emailLabel}: ${form.email.trim()}`,
          form.phone.trim()
            ? `${labels.phoneLabel}: ${form.phone.trim()}`
            : null,
          form.keepInformed ? labels.keepInformedLabel : null,
        ].filter(Boolean);

        // keepInformed is UI-only until a preferences API exists.
        void form.keepInformed;

        window.location.href = buildMailtoHref({
          to,
          subject,
          body: bodyLines.join("\n"),
        });
        close();
        return;
      }

      if (mode === "whatsapp") {
        const phone = resolveWhatsAppPhone(context);
        if (!phone) {
          toast.error(labels.sendErrorTitle, {
            description: labels.missingRecipientPhone,
          });
          return;
        }

        const text = buildWhatsAppShareText({
          message: form.message,
          name: form.name,
          email: form.email,
          phone: form.phone,
          propertyTitle: context.propertyTitle,
          propertyReference: context.propertyReference,
        });

        launchWhatsAppChat(phone, text);
        close();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [close, context, form, labels, mode, t, toast, validateForm]);

  const requestCall = useCallback(() => {
    if (!context?.recipientPhone.trim()) {
      toast.error(labels.sendErrorTitle, {
        description: labels.missingRecipientPhone,
      });
      return;
    }
    setCallConfirmOpen(true);
  }, [context, labels, toast]);

  const confirmCall = useCallback(() => {
    if (!context?.recipientPhone.trim()) return;
    launchPhoneCall(context.recipientPhone);
    setCallConfirmOpen(false);
    close();
  }, [close, context]);

  const onPrimaryAction = useCallback(() => {
    if (mode === "call") {
      requestCall();
      return;
    }
    submitEmailOrWhatsApp();
  }, [mode, requestCall, submitEmailOrWhatsApp]);

  return {
    open,
    mode,
    context,
    form,
    errors,
    isSubmitting,
    callConfirmOpen,
    labels,
    buildDefaultMessage,
    openContact,
    close,
    setField,
    setPhone,
    onPrimaryAction,
    confirmCall,
    cancelCallConfirm: () => setCallConfirmOpen(false),
    /** Re-export unused helpers for clarity of available launches. */
    launchEmailTo,
  };
}

export type UseContactModalReturn = ReturnType<typeof useContactModal>;
