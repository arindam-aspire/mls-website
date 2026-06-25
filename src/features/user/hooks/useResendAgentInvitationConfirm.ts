"use client";

import type { Agent } from "@abdoun/abdoun-library";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { useResendAgentInvitation } from "../mutations/agent.mutation";

export function useResendAgentInvitationConfirm() {
  const t = useTranslations("user.agents.resendConfirm");
  const { mutateAsync: resendInvitation, isPending: isResending } =
    useResendAgentInvitation();

  const [pendingAgent, setPendingAgent] = useState<Agent | null>(null);

  const openConfirm = useCallback((agent: Agent) => {
    setPendingAgent(agent);
  }, []);

  const closeConfirm = useCallback(() => {
    if (isResending) {
      return;
    }

    setPendingAgent(null);
  }, [isResending]);

  const confirmResend = useCallback(async () => {
    if (!pendingAgent) {
      return;
    }

    try {
      await resendInvitation(pendingAgent.id);
      setPendingAgent(null);
    } catch {
      // Error toast handled in mutation.
    }
  }, [pendingAgent, resendInvitation]);

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

  return {
    openConfirm,
    confirmModal,
  };
}

export type UseResendAgentInvitationConfirmReturn = ReturnType<
  typeof useResendAgentInvitationConfirm
>;
