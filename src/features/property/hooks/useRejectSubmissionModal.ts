"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/src/hooks/useToast";

type UseRejectSubmissionModalParams = {
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

export function useRejectSubmissionModal({
  open,
  listingTitle,
  isSubmitting = false,
  title,
  description,
  reasonLabel,
  reasonPlaceholder,
  submitLabel,
  submittingLabel,
  onClose,
  onSubmit,
}: UseRejectSubmissionModalParams) {
  const t = useTranslations("propertyList.manageListings.rejectSubmissionModal");
  const tManage = useTranslations("propertyList.manageListings");
  const toast = useToast();

  const [reason, setReason] = useState("");

  const closeModal = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    onClose();
  }, [isSubmitting, onClose]);

  const onReasonChange = useCallback(
    (value: string) => {
      if (isSubmitting) {
        return;
      }

      setReason(value);
    },
    [isSubmitting],
  );

  const onConfirm = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      toast.error(t("reasonRequiredTitle"), {
        description: t("reasonRequiredDescription"),
      });
      return;
    }

    onSubmit(trimmedReason);
  }, [isSubmitting, onSubmit, reason, t, toast]);

  useEffect(() => {
    if (!open) {
      setReason("");
    }
  }, [open]);

  return {
    title: title ?? t("title"),
    description: description ?? t("description", { title: listingTitle }),
    reason,
    reasonLabel: reasonLabel ?? t("reasonLabel"),
    reasonPlaceholder: reasonPlaceholder ?? t("reasonPlaceholder"),
    submitLabel: submitLabel ?? t("submit"),
    submittingLabel: submittingLabel ?? t("submittingLabel"),
    cancelLabel: tManage("cancelLabel"),
    closeModal,
    onReasonChange,
    onConfirm,
  };
}

export type { UseRejectSubmissionModalParams };
