"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import {
  isAgencyUser,
  isAgentUser,
  isSuperAdminUser,
} from "@/src/features/auth/utils/profileMenuRoleAccess";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { getPropertyDetails } from "@/src/features/property/services/property.service";
import { resolveAgentNameFromCache } from "@/src/features/user/utils/resolveAgentNameFromCache";
import { useToast } from "@/src/hooks/useToast";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import {
  LEADS_QUERY_KEY,
  LEAD_DETAIL_REFETCH_INTERVAL_MS,
} from "../constants/leadList.constants";
import {
  LEAD_ADMIN_APPROVAL_STATUSES,
  LEAD_TERMINAL_STATUSES,
  LEAD_UPDATABLE_STATUSES,
} from "../constants/leadStatus.constants";
import {
  useAddLeadMessage,
  useAddLeadNote,
  useAssignLeadAgent,
  useCloseLead,
  useRejectCloseLead,
  useRequestCloseLead,
  useUpdateLeadStatus,
} from "../mutations/lead.mutation";
import {
  getLeadActivity,
  getLeadDetail,
  getLeadMessages,
  getLeadNotes,
} from "../services/lead.service";
import { LEAD_SOURCES } from "../types/lead.types";
import type {
  LeadDetailTab,
  LeadMessageChannel,
  LeadStatus,
} from "../types/lead.types";
import {
  buildLeadTimelineFromLead,
  filterLeadActivityItemsForViewer,
  formatLeadDate,
  formatLeadShortDate,
  hasAssignedLeadAgent,
  mapLeadActivityToDisplay,
  mapLeadMessagesToConversationDisplay,
  mapLeadNotesToDisplay,
  resolveAssignedAgentLabel,
  resolveLeadCustomerName,
  resolveLeadPropertyAddress,
  resolveLeadPropertyTitle,
  resolvePropertyAgentComparableIds,
  resolvePropertyAgentDisplayName,
  isLeadAssignedToCurrentUser,
  resolveLeadStatus,
  resolveLeadStatusForViewer,
} from "../utils/leadDisplay.utils";
import { resolveLeadClosePermissions } from "../utils/resolveLeadClosePermissions";

const DETAIL_TABS: LeadDetailTab[] = [
  "overview",
  "conversation",
  "notes",
  "timeline",
  "close",
];

function parseTab(value: string | null): LeadDetailTab {
  if (value && DETAIL_TABS.includes(value as LeadDetailTab)) {
    return value as LeadDetailTab;
  }
  return "overview";
}

type UseLeadDetailsScreenParams = {
  leadId: string;
  initialTab?: string | null;
};

export function useLeadDetailsScreen({
  leadId,
  initialTab,
}: UseLeadDetailsScreenParams) {
  const t = useTranslations("leads");
  const tStatus = useTranslations("leads.status");
  const tSource = useTranslations("leads.source");
  const tTimeline = useTranslations("leads.timeline.events");
  const locale = useLocale();
  const toast = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const isAdmin = isAgencyUser(user) || isSuperAdminUser(user);
  const isAgent = isAgentUser(user);
  const canManageAsAdmin = isAdmin;
  const canActAsAgent = isAgent || canManageAsAdmin;

  const [tab, setTab] = useState<LeadDetailTab>(parseTab(initialTab ?? null));
  const [replyOpen, setReplyOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [requestCloseOpen, setRequestCloseOpen] = useState(false);
  const [approveCloseOpen, setApproveCloseOpen] = useState(false);
  const [rejectCloseOpen, setRejectCloseOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  const [replyMessage, setReplyMessage] = useState("");
  const [replyChannel, setReplyChannel] = useState<LeadMessageChannel>("IN_APP");
  const [replyError, setReplyError] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);
  const [statusValue, setStatusValue] = useState<LeadStatus>("IN_PROGRESS");
  const [statusReason, setStatusReason] = useState("");
  const [closeReason, setCloseReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const assignMutation = useAssignLeadAgent();
  const statusMutation = useUpdateLeadStatus();
  const requestCloseMutation = useRequestCloseLead();
  const closeMutation = useCloseLead();
  const rejectCloseMutation = useRejectCloseLead();
  const noteMutation = useAddLeadNote();
  const messageMutation = useAddLeadMessage();

  const {
    data: lead,
    isPending,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: [LEADS_QUERY_KEY, "detail", leadId],
    queryFn: () => getLeadDetail(leadId),
    enabled: Boolean(leadId),
    refetchInterval: LEAD_DETAIL_REFETCH_INTERVAL_MS,
  });

  const notesQuery = useQuery({
    queryKey: [LEADS_QUERY_KEY, "notes", leadId],
    queryFn: () => getLeadNotes(leadId),
    enabled: Boolean(leadId) && tab === "notes",
    refetchInterval: LEAD_DETAIL_REFETCH_INTERVAL_MS,
  });

  const messagesQuery = useQuery({
    queryKey: [LEADS_QUERY_KEY, "messages", leadId],
    queryFn: () => getLeadMessages(leadId),
    enabled: Boolean(leadId) && tab === "conversation",
    refetchInterval: LEAD_DETAIL_REFETCH_INTERVAL_MS,
  });

  const activityQuery = useQuery({
    queryKey: [LEADS_QUERY_KEY, "activity", leadId],
    queryFn: () => getLeadActivity(leadId),
    enabled: Boolean(leadId) && tab === "timeline",
    refetchInterval: LEAD_DETAIL_REFETCH_INTERVAL_MS,
  });

  const propertyDetailsQuery = useQuery({
    queryKey: ["property", "details", lead?.property_id],
    queryFn: () => getPropertyDetails(lead!.property_id!),
    enabled: Boolean(lead?.property_id),
  });

  const propertyDetails = propertyDetailsQuery.data?.data ?? null;

  const assignedAgentDisplayName = useMemo(() => {
    if (!lead || !hasAssignedLeadAgent(lead)) {
      return null;
    }

    const assignedAgentId = lead.assigned_agent_id?.trim();
    const cachedAgentName = resolveAgentNameFromCache(
      queryClient,
      assignedAgentId,
    );
    const currentUserName =
      assignedAgentId && user?.id === assignedAgentId
        ? user.full_name?.trim() || null
        : null;

    return (
      resolveAssignedAgentLabel(lead, {
        propertyAgentName: resolvePropertyAgentDisplayName(propertyDetails),
        propertyAgentIds: resolvePropertyAgentComparableIds(propertyDetails),
        cachedAgentName,
        currentUserName,
      }) || null
    );
  }, [lead, propertyDetails, queryClient, user]);

  const conversationChannelLabel = useCallback(
    (channel: string) => {
      const normalized = channel.trim().toUpperCase();
      if (normalized === "IN_APP") return t("conversation.channelInApp");
      if (normalized === "EMAIL") return t("conversation.channelEmail");
      if (normalized === "SMS") return t("conversation.channelSms");
      return channel;
    },
    [t],
  );

  const resolveConversationDateGroupLabel = useCallback(
    (date: Date, dayDiff: number) => {
      const formattedDate = formatLeadShortDate(date, locale);

      if (dayDiff === 0) {
        return t("conversation.groupToday", { date: formattedDate });
      }

      if (dayDiff === 1) {
        return t("conversation.groupYesterday", { date: formattedDate });
      }

      return formattedDate;
    },
    [locale, t],
  );

  const resolveNotesDateGroupLabel = useCallback(
    (date: Date, dayDiff: number) => {
      const formattedDate = formatLeadShortDate(date, locale);

      if (dayDiff === 0) {
        return t("notes.groupToday", { date: formattedDate });
      }

      if (dayDiff === 1) {
        return t("notes.groupYesterday", { date: formattedDate });
      }

      return formattedDate;
    },
    [locale, t],
  );

  const resolveActivityDateGroupLabel = useCallback(
    (date: Date, dayDiff: number) => {
      const formattedDate = formatLeadShortDate(date, locale);

      if (dayDiff === 0) {
        return t("timeline.groupToday", { date: formattedDate });
      }

      if (dayDiff === 1) {
        return t("timeline.groupYesterday", { date: formattedDate });
      }

      return formattedDate;
    },
    [locale, t],
  );

  const conversationItems = useMemo(() => {
    if (!lead) {
      return [];
    }

    return mapLeadMessagesToConversationDisplay({
      messages: messagesQuery.data ?? [],
      lead,
      locale,
      assignedAgentName: assignedAgentDisplayName,
      currentUserId: user?.id,
      currentUserName: user?.full_name,
      unknownSenderLabel: t("conversation.unknownSender"),
      channelLabelFor: conversationChannelLabel,
    });
  }, [
    assignedAgentDisplayName,
    conversationChannelLabel,
    lead,
    locale,
    messagesQuery.data,
    t,
    user,
  ]);

  const noteItems = useMemo(
    () =>
      mapLeadNotesToDisplay({
        notes: notesQuery.data ?? [],
        locale,
        currentUserId: user?.id,
        currentUserName: user?.full_name,
        unknownAuthorLabel: t("notes.unknownAuthor"),
      }),
    [locale, notesQuery.data, t, user],
  );

  useEffect(() => {
    if (!isError || !error) return;
    toast.error(t("details.fetchErrorTitle"), {
      description: (error as unknown as ApiError).message,
    });
  }, [isError, error, t, toast]);

  const onTabChange = useCallback(
    (next: LeadDetailTab) => {
      setTab(next);
      const params = new URLSearchParams();
      if (next !== "overview") {
        params.set("tab", next);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, setTab],
  );

  const resolvedStatus = resolveLeadStatus(lead?.status);
  const hasPendingCloseRequest = Boolean(
    lead?.request_close_at && !lead.closed_at,
  );
  const isAssignedAgent = isLeadAssignedToCurrentUser(
    lead,
    user?.id,
    propertyDetails,
  );
  const { canRequestClose, canApproveOrRejectClose, canViewCloseStatus } =
    resolveLeadClosePermissions({
      isAdmin,
      isAgent,
      isAssignedAgent,
      status: resolvedStatus,
      hasPendingCloseRequest,
    });

  const isTerminalStatus =
    resolvedStatus !== null && LEAD_TERMINAL_STATUSES.includes(resolvedStatus);
  const canUpdateStatus = canActAsAgent && !isTerminalStatus;
  const canAssign = canManageAsAdmin && !isTerminalStatus;
  const canReply = canActAsAgent && !isTerminalStatus;
  const canAddNote = canActAsAgent && !isTerminalStatus;

  const statusOptionsForModal = useMemo(() => {
    const statuses = LEAD_UPDATABLE_STATUSES.filter(
      (value) => canViewCloseStatus || value !== "CLOSED",
    );

    return statuses.map((value) => ({
      value,
      label: tStatus(value),
      disabled:
        LEAD_ADMIN_APPROVAL_STATUSES.includes(value) ||
        (value === "REQUEST_FOR_CLOSE" && !canRequestClose),
    }));
  }, [canRequestClose, canViewCloseStatus, tStatus]);

  const effectiveTab = useMemo(
    () => (!canViewCloseStatus && tab === "close" ? "overview" : tab),
    [canViewCloseStatus, tab],
  );

  const timelineItems = useMemo(() => {
    const fromApi = activityQuery.data ?? [];
    const rawItems =
      fromApi.length > 0
        ? fromApi
        : lead
          ? buildLeadTimelineFromLead(lead, {
              assignedAgentName: assignedAgentDisplayName,
            })
          : [];

    const visibleItems = filterLeadActivityItemsForViewer(
      rawItems,
      canViewCloseStatus,
    );

    if (!lead || visibleItems.length === 0) {
      return [];
    }

    const resolvedSourceLabel = (() => {
      if (!lead.source) return t("details.emptyValue");
      if ((LEAD_SOURCES as readonly string[]).includes(lead.source)) {
        return tSource(lead.source as (typeof LEAD_SOURCES)[number]);
      }
      return lead.source;
    })();

    return mapLeadActivityToDisplay({
      items: visibleItems,
      locale,
      leadNumber: lead.lead_number || t("details.emptyValue"),
      sourceLabel: resolvedSourceLabel,
      labels: {
        createdDescription: ({ leadNumber, source }) =>
          t("timeline.events.createdDescription", { leadNumber, source }),
        assignedDescription: ({ agentName }) =>
          t("timeline.events.assignedDescription", { agentName }),
        assignedDescriptionUnknown: t(
          "timeline.events.assignedDescriptionUnknown",
        ),
        requestCloseDescription: t("timeline.events.requestCloseDescription"),
        closedDescription: t("timeline.events.closedDescription"),
        lastActivityDescription: t("timeline.events.lastActivityDescription"),
        typeCreated: t("timeline.types.created"),
        typeAssigned: t("timeline.types.assigned"),
        typeRequestClose: t("timeline.types.requestClose"),
        typeClosed: t("timeline.types.closed"),
        typeActivity: t("timeline.types.activity"),
        typeGeneric: t("timeline.types.generic"),
        resolveTitle: (key) => tTimeline(key),
      },
    });
  }, [
    activityQuery.data,
    assignedAgentDisplayName,
    canViewCloseStatus,
    lead,
    locale,
    t,
    tSource,
    tTimeline,
  ]);

  const openStatusModal = useCallback(() => {
    const viewerStatus = resolveLeadStatusForViewer(
      lead?.status,
      canViewCloseStatus,
    );
    const defaultStatus =
      viewerStatus && LEAD_UPDATABLE_STATUSES.includes(viewerStatus)
        ? viewerStatus
        : "IN_PROGRESS";
    setStatusValue(defaultStatus);
    setStatusReason("");
    setStatusOpen(true);
  }, [canViewCloseStatus, lead?.status, setStatusOpen, setStatusReason, setStatusValue]);

  const submitReply = useCallback(() => {
    const trimmed = replyMessage.trim();
    if (!trimmed) {
      setReplyError(t("modals.reply.messageRequired"));
      return;
    }
    setReplyError(null);
    messageMutation.mutate(
      {
        leadId,
        body: {
          message: trimmed,
          channel: replyChannel,
          recipient_user_id: lead?.user_id ?? null,
        },
      },
      {
        onSuccess: () => {
          setReplyMessage("");
          setReplyOpen(false);
        },
      },
    );
  }, [
    replyMessage,
    replyChannel,
    leadId,
    lead?.user_id,
    messageMutation,
    t,
    setReplyError,
    setReplyMessage,
    setReplyOpen,
  ]);

  const submitNote = useCallback(() => {
    const trimmed = noteText.trim();
    if (!trimmed) {
      setNoteError(t("modals.note.noteRequired"));
      return;
    }
    setNoteError(null);
    noteMutation.mutate(
      { leadId, body: { note: trimmed } },
      {
        onSuccess: () => {
          setNoteText("");
          setNoteOpen(false);
        },
      },
    );
  }, [
    noteText,
    leadId,
    noteMutation,
    t,
    setNoteError,
    setNoteOpen,
    setNoteText,
  ]);

  const submitStatus = useCallback(() => {
    if (LEAD_ADMIN_APPROVAL_STATUSES.includes(statusValue)) return;

    if (statusValue === "REQUEST_FOR_CLOSE") {
      if (!canRequestClose) return;

      requestCloseMutation.mutate(leadId, {
        onSuccess: () => {
          setStatusReason("");
          setStatusOpen(false);
        },
      });
      return;
    }

    statusMutation.mutate(
      {
        leadId,
        body: {
          status: statusValue,
          reason: statusReason.trim() || null,
        },
      },
      {
        onSuccess: () => {
          setStatusOpen(false);
        },
      },
    );
  }, [
    leadId,
    requestCloseMutation,
    statusMutation,
    statusReason,
    statusValue,
    canRequestClose,
    setStatusOpen,
    setStatusReason,
  ]);

  const confirmRequestClose = useCallback(() => {
    if (!canRequestClose) return;

    requestCloseMutation.mutate(leadId, {
      onSuccess: () => setRequestCloseOpen(false),
    });
  }, [canRequestClose, leadId, requestCloseMutation, setRequestCloseOpen]);

  const confirmApproveClose = useCallback(() => {
    if (!canApproveOrRejectClose) return;

    closeMutation.mutate(
      {
        leadId,
        body: { reason: closeReason.trim() || null },
      },
      {
        onSuccess: async () => {
          await queryClient.refetchQueries({
            queryKey: [LEADS_QUERY_KEY, "detail", leadId],
            type: "active",
          });
          setApproveCloseOpen(false);
          setCloseReason("");
        },
      },
    );
  }, [
    canApproveOrRejectClose,
    closeMutation,
    closeReason,
    leadId,
    queryClient,
    setApproveCloseOpen,
    setCloseReason,
  ]);

  const confirmRejectClose = useCallback(() => {
    if (!canApproveOrRejectClose) return;

    rejectCloseMutation.mutate(
      {
        leadId,
        reason: rejectReason.trim() || null,
      },
      {
        onSuccess: () => {
          setRejectCloseOpen(false);
          setRejectReason("");
        },
      },
    );
  }, [
    canApproveOrRejectClose,
    leadId,
    rejectReason,
    rejectCloseMutation,
    setRejectCloseOpen,
    setRejectReason,
  ]);

  const onAssign = useCallback(
    (agentId: string) => {
      const cachedAgentName = resolveAgentNameFromCache(queryClient, agentId);
      assignMutation.mutate(
        { leadId, body: { agent_id: agentId } },
        {
          onSuccess: (updatedLead) => {
            if (!updatedLead.assigned_agent_name?.trim() && cachedAgentName) {
              queryClient.setQueryData(
                [LEADS_QUERY_KEY, "detail", leadId],
                {
                  ...updatedLead,
                  assigned_agent_name: cachedAgentName,
                },
              );
            }
            setAssignOpen(false);
          },
        },
      );
    },
    [assignMutation, leadId, queryClient, setAssignOpen],
  );

  const sourceLabel = useMemo(() => {
    if (!lead?.source) return t("details.emptyValue");
    if ((LEAD_SOURCES as readonly string[]).includes(lead.source)) {
      return tSource(lead.source as (typeof LEAD_SOURCES)[number]);
    }
    return lead.source;
  }, [lead?.source, t, tSource]);

  return {
    labels: {
      backToList: t("details.backToList"),
      detailsPageTitle: t("detailsPageTitle"),
      customerInfo: t("details.customerInfo"),
      propertyInfo: t("details.propertyInfo"),
      inquiry: t("details.inquiry"),
      name: t("details.name"),
      email: t("details.email"),
      phone: t("details.phone"),
      communicationMode: t("details.communicationMode"),
      propertyTitle: t("details.propertyTitle"),
      propertyAddress: t("details.propertyAddress"),
      propertyId: t("details.propertyId"),
      propertyHash: t("details.propertyHash"),
      inquiryType: t("details.inquiryType"),
      source: t("details.source"),
      message: t("details.message"),
      leadNumber: t("details.leadNumber"),
      status: t("details.status"),
      assignedAgent: t("details.assignedAgent"),
      createdAt: t("details.createdAt"),
      lastActivity: t("details.lastActivity"),
      unassigned: t("details.unassigned"),
      emptyValue: t("details.emptyValue"),
      notFound: t("details.notFound"),
      tabs: {
        overview: t("tabs.overview"),
        conversation: t("tabs.conversation"),
        notes: t("tabs.notes"),
        timeline: t("tabs.timeline"),
        close: t("tabs.close"),
      },
      actions: {
        reply: t("actions.reply"),
        addNote: t("actions.addNote"),
        updateStatus: t("actions.updateStatus"),
        requestClose: t("actions.requestClose"),
        assign: t("actions.assign"),
        reassign: t("actions.reassign"),
        approveClose: t("actions.approveClose"),
        rejectClose: t("actions.rejectClose"),
      },
      conversation: {
        title: t("conversation.title"),
        subtitle: t("conversation.subtitle"),
        messageCount: t("conversation.messageCount", {
          count: conversationItems.length,
        }),
        emptyTitle: t("conversation.emptyTitle"),
        emptyDescription: t("conversation.emptyDescription"),
        listUnavailable: t("conversation.listUnavailable"),
        channel: t("conversation.channel"),
        agentRole: t("conversation.agentRole"),
        customerRole: t("conversation.customerRole"),
        toRecipient: (name: string) => t("conversation.toRecipient", { name }),
        channelWithValue: (channel: string) =>
          t("conversation.channelWithValue", { channel }),
        sentBadge: t("conversation.sentBadge"),
        resolveDateGroupLabel: resolveConversationDateGroupLabel,
      },
      notes: {
        title: t("notes.title"),
        subtitle: t("notes.subtitle"),
        noteCount: t("notes.noteCount", {
          count: noteItems.length,
        }),
        emptyTitle: t("notes.emptyTitle"),
        emptyDescription: t("notes.emptyDescription"),
        listUnavailable: t("notes.listUnavailable"),
        internalBadge: t("notes.internalBadge"),
        savedBadge: t("notes.savedBadge"),
        resolveDateGroupLabel: resolveNotesDateGroupLabel,
      },
      timeline: {
        title: t("timeline.title"),
        subtitle: t("timeline.subtitle"),
        activityCount: t("timeline.activityCount", {
          count: timelineItems.length,
        }),
        emptyTitle: t("timeline.emptyTitle"),
        emptyDescription: t("timeline.emptyDescription"),
        byActor: (name: string) => t("timeline.byActor", { name }),
        resolveDateGroupLabel: resolveActivityDateGroupLabel,
      },
      close: {
        title: t("close.title"),
        pendingDescription: t("close.pendingDescription"),
        awaitingApprovalDescription: t("close.awaitingApprovalDescription"),
        notPendingDescription: t("close.notPendingDescription"),
        requestCloseAt: t("close.requestCloseAt"),
        closedAt: t("close.closedAt"),
        reasonLabel: t("close.reasonLabel"),
        reasonPlaceholder: t("close.reasonPlaceholder"),
      },
      modals: {
        reply: {
          title: t("modals.reply.title"),
          description: t("modals.reply.description"),
          messageLabel: t("modals.reply.messageLabel"),
          messagePlaceholder: t("modals.reply.messagePlaceholder"),
          channelLabel: t("modals.reply.channelLabel"),
          submit: t("modals.reply.submit"),
          cancel: t("modals.reply.cancel"),
          channelInApp: t("conversation.channelInApp"),
          channelEmail: t("conversation.channelEmail"),
          channelSms: t("conversation.channelSms"),
        },
        note: {
          title: t("modals.note.title"),
          description: t("modals.note.description"),
          noteLabel: t("modals.note.noteLabel"),
          notePlaceholder: t("modals.note.notePlaceholder"),
          submit: t("modals.note.submit"),
          cancel: t("modals.note.cancel"),
        },
        status: {
          title: t("modals.status.title"),
          description: t("modals.status.description"),
          statusLabel: t("modals.status.statusLabel"),
          reasonLabel: t("modals.status.reasonLabel"),
          reasonPlaceholder: t("modals.status.reasonPlaceholder"),
          submit: t("modals.status.submit"),
          cancel: t("modals.status.cancel"),
        },
        requestClose: {
          title: t("modals.requestClose.title"),
          description: t("modals.requestClose.description"),
          confirm: t("modals.requestClose.confirm"),
          cancel: t("modals.requestClose.cancel"),
        },
        approveClose: {
          title: t("modals.approveClose.title"),
          description: t("modals.approveClose.description"),
          reasonLabel: t("modals.approveClose.reasonLabel"),
          reasonPlaceholder: t("modals.approveClose.reasonPlaceholder"),
          confirm: t("modals.approveClose.confirm"),
          cancel: t("modals.approveClose.cancel"),
        },
        rejectClose: {
          title: t("modals.rejectClose.title"),
          description: t("modals.rejectClose.description"),
          reasonLabel: t("modals.rejectClose.reasonLabel"),
          reasonPlaceholder: t("modals.rejectClose.reasonPlaceholder"),
          confirm: t("modals.rejectClose.confirm"),
          cancel: t("modals.rejectClose.cancel"),
        },
      },
    },
    lead,
    isLoading: isPending,
    isFetching,
    isError,
    tab: effectiveTab,
    onTabChange,
    onBack: () => router.push("/leads"),
    display: lead
      ? (() => {
          const viewerStatus = resolveLeadStatusForViewer(
            lead.status,
            canViewCloseStatus,
          );

          return {
            leadNumber: lead.lead_number,
            status: viewerStatus ?? lead.status,
            statusLabel: viewerStatus
              ? tStatus(viewerStatus)
              : lead.status,
          customerName: resolveLeadCustomerName(lead),
          customerEmail: lead.contact_email?.trim() || t("details.emptyValue"),
          customerPhone: lead.contact_phone?.trim() || t("details.emptyValue"),
          communicationMode:
            lead.communication_mode?.trim() || t("details.emptyValue"),
          propertyTitle: resolveLeadPropertyTitle(lead),
          propertyAddress:
            resolveLeadPropertyAddress(lead, locale, propertyDetails) ||
            t("details.emptyValue"),
          propertyId: lead.property_id || t("details.emptyValue"),
          propertyHash:
            lead.property_hash != null
              ? String(lead.property_hash)
              : t("details.emptyValue"),
          inquiryType: lead.inquiry_type?.trim() || t("details.emptyValue"),
          sourceLabel,
          message: lead.message?.trim() || t("details.emptyValue"),
          assignedAgent: hasAssignedLeadAgent(lead)
            ? assignedAgentDisplayName || t("details.emptyValue")
            : t("details.unassigned"),
          createdAt: formatLeadDate(lead.created_at, locale),
          lastActivity: formatLeadDate(lead.last_activity_at, locale),
          requestCloseAt: canViewCloseStatus
            ? formatLeadDate(lead.request_close_at, locale)
            : t("details.emptyValue"),
          closedAt: canViewCloseStatus
            ? formatLeadDate(lead.closed_at, locale)
            : t("details.emptyValue"),
          };
        })()
      : null,
    permissions: {
      canReply,
      canAddNote,
      canUpdateStatus,
      canRequestClose,
      canApproveOrRejectClose,
      canViewCloseStatus,
      hasPendingCloseRequest,
      canAssign,
      assignMode: lead?.assigned_agent_id ? ("reassign" as const) : ("assign" as const),
    },
    conversation: {
      items: conversationItems,
      isLoading: messagesQuery.isPending,
      hasList: conversationItems.length > 0,
    },
    notes: {
      items: noteItems,
      isLoading: notesQuery.isPending,
      hasList: noteItems.length > 0,
    },
    timeline: {
      items: timelineItems,
      isLoading: activityQuery.isPending,
    },
    reply: {
      open: replyOpen,
      message: replyMessage,
      channel: replyChannel,
      error: replyError,
      isSubmitting: messageMutation.isPending,
      onOpen: () => {
        setReplyError(null);
        setReplyOpen(true);
      },
      onClose: () => setReplyOpen(false),
      onMessageChange: setReplyMessage,
      onChannelChange: setReplyChannel,
      onSubmit: submitReply,
    },
    note: {
      open: noteOpen,
      text: noteText,
      error: noteError,
      isSubmitting: noteMutation.isPending,
      onOpen: () => {
        setNoteError(null);
        setNoteOpen(true);
      },
      onClose: () => setNoteOpen(false),
      onTextChange: setNoteText,
      onSubmit: submitNote,
    },
    statusModal: {
      open: statusOpen,
      value: statusValue,
      reason: statusReason,
      options: statusOptionsForModal,
      isSubmitting:
        statusMutation.isPending || requestCloseMutation.isPending,
      onOpen: openStatusModal,
      onClose: () => setStatusOpen(false),
      onValueChange: setStatusValue,
      onReasonChange: setStatusReason,
      onSubmit: submitStatus,
    },
    requestClose: {
      open: requestCloseOpen,
      isSubmitting: requestCloseMutation.isPending,
      onOpen: () => {
        if (canRequestClose) setRequestCloseOpen(true);
      },
      onClose: () => setRequestCloseOpen(false),
      onConfirm: confirmRequestClose,
    },
    approveClose: {
      open: approveCloseOpen,
      reason: closeReason,
      isSubmitting: closeMutation.isPending,
      onOpen: () => {
        if (canApproveOrRejectClose) setApproveCloseOpen(true);
      },
      onClose: () => setApproveCloseOpen(false),
      onReasonChange: setCloseReason,
      onConfirm: confirmApproveClose,
    },
    rejectClose: {
      open: rejectCloseOpen,
      reason: rejectReason,
      isSubmitting: rejectCloseMutation.isPending,
      onOpen: () => {
        if (canApproveOrRejectClose) setRejectCloseOpen(true);
      },
      onClose: () => setRejectCloseOpen(false),
      onReasonChange: setRejectReason,
      onConfirm: confirmRejectClose,
    },
    assign: {
      open: assignOpen,
      isAssigning: assignMutation.isPending,
      onOpen: () => setAssignOpen(true),
      onClose: () => setAssignOpen(false),
      onAssign,
    },
    formatDate: (value: string | null | undefined) =>
      formatLeadDate(value, locale),
  };
}
