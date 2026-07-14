"use client";

import type { Agent } from "@abdoun/abdoun-library";
import { useToast } from "@/src/hooks/useToast";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { useResendAgentInvitation } from "../mutations/agent.mutation";

export function useResendAgentInvitationConfirm() {
  const t = useTranslations("user.agents.resendConfirm");
  const toast = useToast();
  const { mutateAsync: resendInvitation, isPending: isResending } =
    useResendAgentInvitation();

  const [pendingAgent, setPendingAgent] = useState<Agent | null>(null);
  const [copyLinkInviteUrl, setCopyLinkInviteUrl] = useState<string | null>(null);
  const [copyLinkAgentLabel, setCopyLinkAgentLabel] = useState("");

  const openConfirm = useCallback((agent: Agent) => {
    setPendingAgent(agent);
  }, []);

  const closeConfirm = useCallback(() => {
    if (isResending) {
      return;
    }

    setPendingAgent(null);
  }, [isResending]);

  const closeCopyLinkModal = useCallback(() => {
    setCopyLinkInviteUrl(null);
    setCopyLinkAgentLabel("");
  }, []);

  const confirmResend = useCallback(async () => {
    if (!pendingAgent) {
      return;
    }

    const agentLabel = pendingAgent.name || pendingAgent.email || pendingAgent.id;

    try {
      const result = await resendInvitation(pendingAgent.id);
      const invitationUrl = result.invite.inviteLink?.trim() ?? "";

      setPendingAgent(null);

      if (invitationUrl) {
        setCopyLinkAgentLabel(agentLabel);
        setCopyLinkInviteUrl(invitationUrl);
      }
    } catch {
      // Error toast handled in mutation.
    }
  }, [pendingAgent, resendInvitation]);

  const onCopyLink = useCallback(async () => {
    if (!copyLinkInviteUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(copyLinkInviteUrl);
      toast.success(t("copyLink.copySuccessTitle"), {
        description: t("copyLink.copySuccessDescription"),
      });
    } catch {
      toast.error(t("copyLink.copyErrorTitle"), {
        description: t("copyLink.copyErrorDescription"),
      });
    }
  }, [copyLinkInviteUrl, t, toast]);

  const confirmModal = useMemo(() => {
    if (!pendingAgent) {
      return null;
    }

    const agentLabel = pendingAgent.name || pendingAgent.email || pendingAgent.id;

    return {
      open: true,
      title: t("title"),
      description: t("description", { name: agentLabel }),
      confirmLabel: t("confirm"),
      cancelLabel: t("cancel"),
      loadingLabel: t("resending"),
      variant: "primary" as const,
      isLoading: isResending,
      onClose: closeConfirm,
      onConfirm: confirmResend,
    };
  }, [closeConfirm, confirmResend, isResending, pendingAgent, t]);

  const copyLinkModal = useMemo(() => {
    if (!copyLinkInviteUrl) {
      return null;
    }

    return {
      open: true,
      onClose: closeCopyLinkModal,
      readyTitle: t("copyLink.readyTitle"),
      generatedMessage: t("copyLink.description", { name: copyLinkAgentLabel }),
      shareHint: t("copyLink.shareHint"),
      linkLabel: t("copyLink.linkLabel"),
      inviteLink: copyLinkInviteUrl,
      copyLinkLabel: t("copyLink.copyLink"),
      closeLabel: t("copyLink.close"),
      onCopyLink,
    };
  }, [
    closeCopyLinkModal,
    copyLinkAgentLabel,
    copyLinkInviteUrl,
    onCopyLink,
    t,
  ]);

  return {
    openConfirm,
    confirmModal,
    copyLinkModal,
  };
}

export type UseResendAgentInvitationConfirmReturn = ReturnType<
  typeof useResendAgentInvitationConfirm
>;
