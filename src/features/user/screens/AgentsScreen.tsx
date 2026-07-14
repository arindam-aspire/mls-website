"use client";

import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { Button } from "@/src/components/ui";
import { AgentKPICards } from "@/src/features/user/components/AgentKPICards";
import { AgentKPICardsSkeleton } from "@/src/features/user/components/AgentKPICardsSkeleton";
import { AgentList } from "@/src/features/user/components/AgentList";
import { useAgentsScreen } from "@/src/features/user/hooks/useAgentsScreen";
import { CopyInvitationLinkModal } from "@/src/features/user/modals/CopyInvitationLinkModal";
import { InviteAgentByEmailModal } from "@/src/features/user/modals/InviteAgentByEmailModal";
import { ManualOnboardAgentModal } from "@/src/features/user/modals/ManualOnboardAgentModal";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";
import { Mail, UserRoundPen } from "lucide-react";

export function AgentsScreen() {
  const {
    pageTitle,
    pageSubtitle,
    inviteByEmailLabel,
    manualOnboardLabel,
    kpiMetrics,
    kpiSectionAriaLabel,
    isKpiLoading,
    canManageAgents,
    listFilters,
    agentList,
    onOpenInviteAgentByEmail,
    onOpenManualOnboardAgent,
    inviteAgentByEmailModal,
    manualOnboardAgentModal,
    resendAgentConfirm,
    deleteAgentConfirm,
  } = useAgentsScreen();

  return (
    <>
      <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:gap-4 lg:gap-6">
          <div className="min-w-0 flex-1">
            <h1 className={headingPageClasses}>{pageTitle}</h1>
            <p className={cn("text-muted", bodyLargeTextClasses)}>{pageSubtitle}</p>
          </div>

          {canManageAgents ? (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-2 md:gap-4 lg:gap-6">
              <Button
                type="button"
                color="inherit"
                variant="outline"
                size="md"
                className="w-full shrink-0 rounded-lg sm:w-auto"
                iconStart={<Mail className="size-4" aria-hidden />}
                onClick={onOpenInviteAgentByEmail}
              >
                {inviteByEmailLabel}
              </Button>

              <Button
                type="button"
                color="primary"
                variant="solid"
                size="md"
                className="w-full shrink-0 rounded-lg sm:w-auto"
                iconStart={<UserRoundPen className="size-4" aria-hidden />}
                onClick={onOpenManualOnboardAgent}
              >
                {manualOnboardLabel}
              </Button>
            </div>
          ) : null}
        </div>

        {isKpiLoading ? (
          <AgentKPICardsSkeleton />
        ) : (
          <AgentKPICards
            metrics={kpiMetrics}
            sectionAriaLabel={kpiSectionAriaLabel}
          />
        )}

        <AgentList filters={listFilters} list={agentList} />
      </div>

      {canManageAgents ? (
        <>
          <InviteAgentByEmailModal {...inviteAgentByEmailModal} />
          <ManualOnboardAgentModal {...manualOnboardAgentModal} />
        </>
      ) : null}

      {resendAgentConfirm.confirmModal ? (
        <ConfirmModal {...resendAgentConfirm.confirmModal} />
      ) : null}

      {resendAgentConfirm.copyLinkModal ? (
        <CopyInvitationLinkModal {...resendAgentConfirm.copyLinkModal} />
      ) : null}

      {deleteAgentConfirm.confirmModal ? (
        <ConfirmModal {...deleteAgentConfirm.confirmModal} />
      ) : null}
    </>
  );
}
