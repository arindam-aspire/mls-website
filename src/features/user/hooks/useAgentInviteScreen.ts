"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "@/src/hooks/useToast";
import { useRouter } from "@/src/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  submitAgentInvitation,
  validateAgentInvitation,
} from "../services/agent.service";
import type { AgentInvitationPreview } from "../types/agent.types";
import {
  isAgentInvitationPendingPassword,
  isAgentInvitationProfileSubmitted,
  mapAgentInviteMutationFieldErrors,
  resolveAgentApiErrorMessage,
} from "../utils/agentOnboardingErrors.utils";
import { formatAgentStatusLabel } from "../utils/formatAgentStatusLabel";
import { resolveInvitationFullName } from "../utils/resolveInvitationFullName";
import { useAgentOnboardingForm } from "./useAgentOnboardingForm";

type AgentInviteStep = "loading" | "error" | "form" | "passwordInstruction" | "active";

function buildInitialFormValues(
  invitation: AgentInvitationPreview,
): Partial<ReturnType<typeof useAgentOnboardingForm>["formState"]> {
  return {
    fullName: resolveInvitationFullName(invitation.fullName, invitation.email),
    email: invitation.email ?? "",
    position: invitation.position ?? "",
    serviceAreaValues:
      invitation.serviceArea?.trim().length
        ? invitation.serviceArea.split(",").map((value) => value.trim()).filter(Boolean)
        : [],
  };
}

export function useAgentInviteScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();
  const t = useTranslations("user.agents.inviteScreen");
  const tErrors = useTranslations("user.agents.errors");

  const token = searchParams.get("token")?.trim() ?? "";
  const [invitation, setInvitation] = useState<AgentInvitationPreview | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [passwordSetupLink, setPasswordSetupLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onboardingForm = useAgentOnboardingForm({
    invitationToken: token,
    initialValues: invitation ? buildInitialFormValues(invitation) : undefined,
    disabled: isSubmitting,
  });

  const step = useMemo((): AgentInviteStep => {
    if (isLoading) {
      return "loading";
    }

    if (validationError) {
      return "error";
    }

    if (invitation?.status?.trim().toUpperCase() === "ACTIVE") {
      return "active";
    }

    if (
      passwordSetupLink ||
      invitation?.passwordSetupLink ||
      isAgentInvitationPendingPassword(invitation?.status)
    ) {
      return "passwordInstruction";
    }

    return "form";
  }, [invitation, isLoading, passwordSetupLink, validationError]);

  const resolvedPasswordSetupLink =
    passwordSetupLink ?? invitation?.passwordSetupLink ?? null;

  const loadInvitation = useCallback(async () => {
    if (!token) {
      setValidationError(tErrors("missingToken"));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await validateAgentInvitation(token);
      setInvitation(data);
      setValidationError(null);

      if (isAgentInvitationProfileSubmitted(data) && data.passwordSetupLink) {
        setPasswordSetupLink(data.passwordSetupLink);
      }
    } catch (error) {
      setValidationError(
        resolveAgentApiErrorMessage(error as Error, {
          duplicateEmail: tErrors("duplicateEmail"),
          duplicatePhone: tErrors("duplicatePhone"),
          invalidInvitation: tErrors("invalidInvitation"),
          expiredInvitation: tErrors("expiredInvitation"),
          validationError: tErrors("validationError"),
          generic: tErrors("generic"),
        }),
      );
    } finally {
      setIsLoading(false);
    }
  }, [tErrors, token]);

  useEffect(() => {
    void loadInvitation();
  }, [loadInvitation]);

  useEffect(() => {
    if (!invitation || isAgentInvitationProfileSubmitted(invitation)) {
      return;
    }

    onboardingForm.hydrateForm(buildInitialFormValues(invitation));
  }, [invitation]);

  const onSubmitProfile = useCallback(async () => {
    if (!token) {
      return;
    }

    const nextErrors = onboardingForm.validateForm();

    if (Object.values(nextErrors).some(Boolean)) {
      onboardingForm.setFieldErrors(nextErrors);
      return;
    }

    onboardingForm.setFieldErrors({});
    setSubmitError(null);

    try {
      setIsSubmitting(true);
      const result = await submitAgentInvitation({
        token,
        ...onboardingForm.buildSubmitPayload(),
      });
      setPasswordSetupLink(result?.passwordSetupLink ?? null);
      setInvitation((previous) =>
        previous
          ? {
              ...previous,
              status: result?.status ?? previous.status,
              formSubmittedAt: new Date().toISOString(),
              passwordSetupLink: result?.passwordSetupLink ?? previous.passwordSetupLink,
            }
          : previous,
      );
      toast.success(t("profileSubmittedTitle"), {
        description: t("profileSubmittedDescription"),
      });
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
      }

      setSubmitError(
        resolveAgentApiErrorMessage(error as Error, {
          duplicateEmail: tErrors("duplicateEmail"),
          duplicatePhone: tErrors("duplicatePhone"),
          invalidInvitation: tErrors("invalidInvitation"),
          expiredInvitation: tErrors("expiredInvitation"),
          validationError: tErrors("validationError"),
          generic: tErrors("generic"),
        }),
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [onboardingForm, t, tErrors, toast, token]);

  const onOpenPasswordSetup = useCallback(() => {
    const url = resolvedPasswordSetupLink?.trim();

    if (!url) {
      toast.error(t("missingSetupLinkTitle"), {
        description: t("missingSetupLinkDescription"),
      });
      return;
    }

    const opened = window.open(url, "_blank", "noopener,noreferrer");

    if (!opened) {
      toast.error(t("openSetupLinkErrorTitle"), {
        description: t("openSetupLinkErrorDescription"),
      });
    }
  }, [resolvedPasswordSetupLink, t, toast]);

  const onCopyPasswordSetupLink = useCallback(async () => {
    if (!resolvedPasswordSetupLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(resolvedPasswordSetupLink);
      toast.success(t("copySetupLinkSuccessTitle"), {
        description: t("copySetupLinkSuccessDescription"),
      });
    } catch {
      toast.error(t("copySetupLinkErrorTitle"), {
        description: t("copySetupLinkErrorDescription"),
      });
    }
  }, [resolvedPasswordSetupLink, t, toast]);

  const onGoToSignIn = useCallback(() => {
    router.push("/");
  }, [router]);

  return {
    token,
    invitation,
    step,
    validationError,
    submitError,
    isSubmitting,
    resolvedPasswordSetupLink,
    onboardingForm,
    labels: {
      title: t("title"),
      subtitle: t("subtitle"),
      loading: t("loading"),
      errorTitle: t("errorTitle"),
      activeTitle: t("activeTitle"),
      activeDescription: t("activeDescription"),
      passwordInstructionTitle: t("passwordInstructionTitle"),
      passwordInstructionDescription: t("passwordInstructionDescription"),
      passwordInstructionHint: t("passwordInstructionHint"),
      setupLinkLabel: t("setupLinkLabel"),
      openPasswordSetup: t("openPasswordSetup"),
      missingSetupLinkTitle: t("missingSetupLinkTitle"),
      missingSetupLinkDescription: t("missingSetupLinkDescription"),
      openSetupLinkErrorTitle: t("openSetupLinkErrorTitle"),
      openSetupLinkErrorDescription: t("openSetupLinkErrorDescription"),
      copySetupLink: t("copySetupLink"),
      submitProfile: t("submitProfile"),
      submittingProfile: t("submittingProfile"),
      goToSignIn: t("goToSignIn"),
      statusLabel: formatAgentStatusLabel(invitation?.status) || t("statusPendingPassword"),
    },
    handlers: {
      onSubmitProfile,
      onOpenPasswordSetup,
      onCopyPasswordSetupLink,
      onGoToSignIn,
    },
  };
}
