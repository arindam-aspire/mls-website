"use client";

import type { Agent } from "@abdoun/abdoun-library";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import { useDeleteAgent } from "../mutations/agent.mutation";

export type DeleteAgentIntent = "revoke" | "remove";

type PendingDeleteAgent = {
  agent: Agent;
  intent: DeleteAgentIntent;
};

export function useDeleteAgentConfirm() {
  const t = useTranslations("user.agents.deleteConfirm");
  const { mutateAsync: deleteAgent, isPending: isDeleting } = useDeleteAgent();

  const [pendingDelete, setPendingDelete] = useState<PendingDeleteAgent | null>(null);

  const openConfirm = useCallback((agent: Agent, intent: DeleteAgentIntent) => {
    setPendingDelete({ agent, intent });
  }, []);

  const closeConfirm = useCallback(() => {
    if (isDeleting) {
      return;
    }

    setPendingDelete(null);
  }, [isDeleting]);

  const confirmDelete = useCallback(async () => {
    if (!pendingDelete) {
      return;
    }

    try {
      await deleteAgent(pendingDelete.agent.id);
      setPendingDelete(null);
    } catch {
      // Error toast handled in mutation.
    }
  }, [deleteAgent, pendingDelete]);

  const confirmModal = useMemo(() => {
    if (!pendingDelete) {
      return null;
    }

    const { agent, intent } = pendingDelete;
    const agentLabel = agent.name || agent.email || agent.id;

    return {
      open: true,
      title: intent === "revoke" ? t("revokeTitle") : t("removeTitle"),
      description:
        intent === "revoke"
          ? t("revokeDescription", { name: agentLabel })
          : t("removeDescription", { name: agentLabel }),
      confirmLabel: intent === "revoke" ? t("revokeConfirm") : t("removeConfirm"),
      cancelLabel: t("cancel"),
      loadingLabel: t("deleting"),
      variant: "danger" as const,
      isLoading: isDeleting,
      onClose: closeConfirm,
      onConfirm: confirmDelete,
    };
  }, [closeConfirm, confirmDelete, isDeleting, pendingDelete, t]);

  return {
    openConfirm,
    confirmModal,
  };
}

export type UseDeleteAgentConfirmReturn = ReturnType<typeof useDeleteAgentConfirm>;
