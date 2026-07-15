"use client";

import { useToast } from "@/src/hooks/useToast";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { useManualOnboardAgent } from "../mutations/agent.mutation";
import type { ManualOnboardAgentResult } from "../types/agent.types";
import {
  mapAgentInviteMutationFieldErrors,
  resolveAgentApiErrorMessage,
} from "../utils/agentOnboardingErrors.utils";
import { useAgentOnboardingForm } from "./useAgentOnboardingForm";

export function useManualOnboardAgentModal() {
  const t = useTranslations("user.agents.manualOnboardModal");
  const tErrors = useTranslations("user.agents.errors");
  const toast = useToast();
  const {
    mutateAsync: submitManualOnboard,
    reset: resetManualOnboardMutation,
    isPending: isSubmitting,
  } = useManualOnboardAgent();

  const [isOpen, setIsOpen] = useState(false);
  const [onboardResult, setOnboardResult] = useState<ManualOnboardAgentResult | null>(
    null,
  );

  const hasSubmittedSuccessfully = onboardResult !== null;
  const wasOpenRef = useRef(false);

  const onboardingForm = useAgentOnboardingForm({
    disabled: hasSubmittedSuccessfully,
  });

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (isSubmitting) {
      return;
    }

    setIsOpen(false);
  }, [isSubmitting]);

  const onSubmit = useCallback(async () => {
    if (isSubmitting || hasSubmittedSuccessfully) {
      return;
    }

    const nextErrors = onboardingForm.validateForm();

    if (Object.values(nextErrors).some(Boolean)) {
      onboardingForm.setFieldErrors(nextErrors);
      return;
    }

    onboardingForm.setFieldErrors({});

    try {
      const result = await submitManualOnboard(onboardingForm.buildSubmitPayload());
      setOnboardResult(result);
    } catch (error) {
      if (error && typeof error === "object" && "message" in error) {
        const fieldErrors = mapAgentInviteMutationFieldErrors(
          error as Parameters<typeof mapAgentInviteMutationFieldErrors>[0],
          {
            duplicateEmail: tErrors("duplicateEmail"),
            duplicatePhone: tErrors("duplicatePhone"),
          },
        );

        if (Object.keys(fieldErrors).length > 0) {
          onboardingForm.setFieldErrors(fieldErrors);
          return;
        }

        toast.error(t("errorTitle"), {
          description: resolveAgentApiErrorMessage(error as Error, {
            duplicateEmail: tErrors("duplicateEmail"),
            duplicatePhone: tErrors("duplicatePhone"),
            invalidInvitation: tErrors("invalidInvitation"),
            expiredInvitation: tErrors("expiredInvitation"),
            validationError: tErrors("validationError"),
            generic: tErrors("generic"),
          }),
        });
      }
    }
  }, [
    hasSubmittedSuccessfully,
    isSubmitting,
    onboardingForm,
    submitManualOnboard,
    t,
    tErrors,
    toast,
  ]);

  const onCopyPassword = useCallback(async () => {
    const temporaryPassword = onboardResult?.agent.temporaryPassword?.trim();

    if (!temporaryPassword) {
      return;
    }

    try {
      await navigator.clipboard.writeText(temporaryPassword);
      toast.success(t("success.copyPasswordSuccessTitle"), {
        description: t("success.copyPasswordSuccessDescription"),
      });
    } catch {
      toast.error(t("success.copyPasswordErrorTitle"), {
        description: t("success.copyPasswordErrorDescription"),
      });
    }
  }, [onboardResult?.agent.temporaryPassword, t, toast]);

  const onCopySetupLink = useCallback(async () => {
    const setupLink = onboardResult?.agent.inviteLink;

    if (!setupLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(setupLink);
      toast.success(t("success.copySetupLinkSuccessTitle"), {
        description: t("success.copySetupLinkSuccessDescription"),
      });
    } catch {
      toast.error(t("success.copySetupLinkErrorTitle"), {
        description: t("success.copySetupLinkErrorDescription"),
      });
    }
  }, [onboardResult?.agent.inviteLink, t, toast]);

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      onboardingForm.resetForm();
      setOnboardResult(null);
      resetManualOnboardMutation();
    }

    wasOpenRef.current = isOpen;
  }, [isOpen, onboardingForm, resetManualOnboardMutation]);

  const successMessage =
    onboardResult?.message ||
    (onboardResult
      ? t("success.descriptionWithName", {
          name: onboardResult.agent.fullName,
        })
      : "");

  return {
    isOpen,
    openModal,
    closeModal,
    title: t("title"),
    description: hasSubmittedSuccessfully
      ? t("success.subtitle")
      : t("description"),
    cancelLabel: t("cancel"),
    primaryActionLabel: hasSubmittedSuccessfully ? t("success.done") : t("submit"),
    submittingLabel: t("submitting"),
    isSubmitting,
    hasSubmittedSuccessfully,
    onPrimaryAction: hasSubmittedSuccessfully ? closeModal : onSubmit,
    content: {
      ...onboardingForm.formState,
      serviceAreaOptions: onboardingForm.serviceAreaOptions,
      ...onboardingForm.labels,
      fullNameError: onboardingForm.errors.fullName,
      emailError: onboardingForm.errors.email,
      phoneError: onboardingForm.errors.phone,
      whatsappError: onboardingForm.errors.whatsappNumber,
      serviceAreaError: onboardingForm.errors.serviceArea,
      positionError: onboardingForm.errors.position,
      identityDocumentError: onboardingForm.errors.identityDocument,
      identityDocumentFileName: onboardingForm.formState.identityDocumentFileName,
      disabled: isSubmitting,
      isServiceAreaLoading: onboardingForm.isServiceAreaLoading,
      isIdentityDocumentUploading: onboardingForm.isIdentityDocumentUploading,
      ...onboardingForm.handlers,
      hasSubmittedSuccessfully,
      success: onboardResult
        ? {
            readyTitle: t("success.readyTitle"),
            successMessage,
            passwordLabel: t("success.temporaryPasswordLabel"),
            temporaryPassword:
              onboardResult.agent.temporaryPassword?.trim() ?? "",
            copyPasswordLabel: t("success.copyPassword"),
            setupLinkLabel: t("success.setupLinkLabel"),
            setupLink: onboardResult.agent.inviteLink?.trim() || null,
            copySetupLinkLabel: t("success.copySetupLink"),
            passwordHint: t("success.passwordHint"),
            onCopyPassword,
            onCopySetupLink,
          }
        : null,
    },
  };
}

export type UseManualOnboardAgentModalReturn = ReturnType<
  typeof useManualOnboardAgentModal
>;
