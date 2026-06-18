"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { useToast } from "@/src/hooks/useToast";
import { useInviteAgentByEmail } from "../mutations/agent.mutation";
import type { AgentInviteResult } from "../types/agent.types";
import { validateInviteEmailValue } from "../utils/validateOnboardAgentForms";

type InviteFormErrors = {
  email?: string;
};

const EMPTY_INVITE_FORM_ERRORS: InviteFormErrors = {};

export function useInviteAgentByEmailModal() {
  const t = useTranslations("user.agents.inviteByEmailModal");
  const tAuth = useTranslations("auth");
  const toast = useToast();
  const { mutateAsync: inviteAgent, reset: resetInviteMutation, isPending: isGenerating } =
    useInviteAgentByEmail();

  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<InviteFormErrors>(EMPTY_INVITE_FORM_ERRORS);
  const [inviteResult, setInviteResult] = useState<AgentInviteResult | null>(null);

  const hasGeneratedInvite = inviteResult !== null;

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const wasOpenRef = useRef(false);

  const closeModal = useCallback(() => {
    if (isGenerating) {
      return;
    }

    setIsOpen(false);
  }, [isGenerating]);

  const resolveEmailErrorMessage = useCallback(
    (error: "required" | "invalid" | null) => {
      if (error === "required") {
        return tAuth("signUpEmailRequired");
      }

      if (error === "invalid") {
        return tAuth("signUpEmailInvalid");
      }

      return undefined;
    },
    [tAuth],
  );

  const onEmailChange = useCallback(
    (value: string) => {
      if (hasGeneratedInvite) {
        return;
      }

      setEmail(value);
      setErrors(EMPTY_INVITE_FORM_ERRORS);
    },
    [hasGeneratedInvite],
  );

  const onGenerateInvite = useCallback(async () => {
    if (isGenerating || hasGeneratedInvite) {
      return;
    }

    const emailError = validateInviteEmailValue(email);

    if (emailError) {
      setErrors({
        email: resolveEmailErrorMessage(emailError),
      });
      return;
    }

    setErrors(EMPTY_INVITE_FORM_ERRORS);

    try {
      const result = await inviteAgent({
        email: email.trim(),
      });
      setInviteResult(result);
    } catch {
      // Error toast handled in mutation.
    }
  }, [
    email,
    hasGeneratedInvite,
    inviteAgent,
    isGenerating,
    resolveEmailErrorMessage,
  ]);

  const onCopyLink = useCallback(async () => {
    const inviteLink = inviteResult?.invite.inviteLink;

    if (!inviteLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success(t("generated.copyLinkSuccessTitle"), {
        description: t("generated.copyLinkSuccessDescription"),
      });
    } catch {
      toast.error(t("generated.copyLinkErrorTitle"), {
        description: t("generated.copyLinkErrorDescription"),
      });
    }
  }, [inviteResult?.invite.inviteLink, t, toast]);

  const onSendViaEmail = useCallback(() => {
    if (!inviteResult) {
      return;
    }

    const subject = encodeURIComponent(t("generated.emailSubject"));
    const body = encodeURIComponent(
      t("generated.emailBody", { link: inviteResult.invite.inviteLink }),
    );
    const mailtoUrl = `mailto:${encodeURIComponent(inviteResult.invite.email)}?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;
  }, [inviteResult, t]);

  const onPrimaryAction = useCallback(() => {
    if (hasGeneratedInvite) {
      onSendViaEmail();
      return;
    }

    void onGenerateInvite();
  }, [hasGeneratedInvite, onGenerateInvite, onSendViaEmail]);

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      setEmail("");
      setErrors(EMPTY_INVITE_FORM_ERRORS);
      setInviteResult(null);
      resetInviteMutation();
    }

    wasOpenRef.current = isOpen;
  }, [isOpen, resetInviteMutation]);

  const generatedMessage = hasGeneratedInvite
    ? t("generated.descriptionWithEmail", {
        email: inviteResult?.invite.email ?? email.trim(),
      })
    : undefined;

  return {
    isOpen,
    openModal,
    closeModal,
    title: t("title"),
    description: hasGeneratedInvite
      ? t("generated.subtitle")
      : t("description"),
    cancelLabel: hasGeneratedInvite
      ? t("generated.done")
      : t("cancel"),
    primaryActionLabel: hasGeneratedInvite
      ? t("generated.sendViaEmail")
      : t("generate"),
    generatingLabel: t("generating"),
    isGenerating,
    hasGeneratedInvite,
    onPrimaryAction,
    content: {
      email,
      emailLabel: t("emailLabel"),
      emailPlaceholder: t("emailPlaceholder"),
      emailError: errors.email,
      isEmailDisabled: isGenerating || hasGeneratedInvite,
      onEmailChange,
      isGenerating,
      generatingMessage: t("generating"),
      generatingHint: t("generatingHint"),
      hasGeneratedInvite,
      readyTitle: t("generated.readyTitle"),
      generatedMessage: generatedMessage ?? "",
      shareHint: t("generated.shareHint"),
      linkLabel: t("generated.linkLabel"),
      inviteLink: inviteResult?.invite.inviteLink ?? "",
      copyLinkLabel: t("generated.copyLink"),
      onCopyLink,
    },
  };
}

export type UseInviteAgentByEmailModalReturn = ReturnType<
  typeof useInviteAgentByEmailModal
>;
