"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import {
  isAgencyUser,
  isAgentUser,
  isSuperAdminUser,
} from "@/src/features/auth/utils/profileMenuRoleAccess";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useContactModal } from "@/src/features/contact/hooks/useContactModal";
import { mapLeadToContactContext } from "@/src/features/contact/mappers/mapLeadToContactContext";
import { useToast } from "@/src/hooks/useToast";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import {
  LEADS_QUERY_KEY,
  LEAD_DETAIL_REFETCH_INTERVAL_MS,
} from "../constants/leadList.constants";
import {
  LEAD_ADMIN_OVERRIDE_STATUSES,
  LEAD_AGENT_UPDATABLE_STATUSES,
  LEAD_STATUSES_ALLOWING_APPROVE_CLOSE,
  LEAD_STATUSES_ALLOWING_REQUEST_CLOSE,
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
  formatLeadDate,
  resolveAssignedAgentLabel,
  resolveLeadCustomerName,
  resolveLeadPropertyTitle,
  resolveLeadStatus,
} from "../utils/leadDisplay.utils";

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
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const canManageAsAdmin = isAgencyUser(user) || isSuperAdminUser(user);
  const canActAsAgent = isAgentUser(user) || canManageAsAdmin;

  const contactModal = useContactModal();
  const { openContact, buildDefaultMessage } = contactModal;

  const [tab, setTab] = useState<LeadDetailTab>(parseTab(initialTab ?? null));
  const [replyOpen, setReplyOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusOverrideMode, setStatusOverrideMode] = useState(false);
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

  useEffect(() => {
    if (!isError || !error) return;
    toast.error(t("details.fetchErrorTitle"), {
      description: (error as unknown as ApiError).message,
    });
  }, [isError, error, t, toast]);

  useEffect(() => {
    setTab(parseTab(initialTab ?? null));
  }, [initialTab]);

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
    [pathname, router],
  );

  const resolvedStatus = resolveLeadStatus(lead?.status);

  const canRequestClose =
    canActAsAgent &&
    resolvedStatus !== null &&
    LEAD_STATUSES_ALLOWING_REQUEST_CLOSE.includes(resolvedStatus);

  const canApproveOrRejectClose =
    canManageAsAdmin &&
    resolvedStatus !== null &&
    LEAD_STATUSES_ALLOWING_APPROVE_CLOSE.includes(resolvedStatus);

  const canUpdateStatus = canActAsAgent && resolvedStatus !== "CLOSED";
  const canOverrideStatus = canManageAsAdmin && resolvedStatus !== "CLOSED";
  const canAssign = canManageAsAdmin && resolvedStatus !== "CLOSED";
  const canReply = canActAsAgent && resolvedStatus !== "CLOSED";
  const canAddNote = canActAsAgent && resolvedStatus !== "CLOSED";

  const statusOptionsForModal = useMemo(() => {
    const values = statusOverrideMode
      ? LEAD_ADMIN_OVERRIDE_STATUSES
      : LEAD_AGENT_UPDATABLE_STATUSES;
    return values.map((value) => ({
      value,
      label: tStatus(value),
    }));
  }, [statusOverrideMode, tStatus]);

  const timelineItems = useMemo(() => {
    const fromApi = activityQuery.data ?? [];
    if (fromApi.length > 0) return fromApi;
    if (!lead) return [];
    return buildLeadTimelineFromLead(lead).map((item) => ({
      ...item,
      title: tTimeline(item.title as "created" | "assigned" | "requestClose" | "closed" | "lastActivity"),
    }));
  }, [activityQuery.data, lead, tTimeline]);

  const openStatusModal = useCallback(
    (override: boolean) => {
      setStatusOverrideMode(override);
      setStatusValue(override ? "IN_PROGRESS" : "IN_PROGRESS");
      setStatusReason("");
      setStatusOpen(true);
    },
    [],
  );

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
  }, [replyMessage, replyChannel, leadId, lead?.user_id, messageMutation, t]);

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
  }, [noteText, leadId, noteMutation, t]);

  const submitStatus = useCallback(() => {
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
  }, [leadId, statusValue, statusReason, statusMutation]);

  const confirmRequestClose = useCallback(() => {
    requestCloseMutation.mutate(leadId, {
      onSuccess: () => setRequestCloseOpen(false),
    });
  }, [leadId, requestCloseMutation]);

  const confirmApproveClose = useCallback(() => {
    closeMutation.mutate(
      {
        leadId,
        body: { reason: closeReason.trim() || null },
      },
      {
        onSuccess: () => {
          setApproveCloseOpen(false);
          setCloseReason("");
        },
      },
    );
  }, [leadId, closeReason, closeMutation]);

  const confirmRejectClose = useCallback(() => {
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
  }, [leadId, rejectReason, rejectCloseMutation]);

  const onAssign = useCallback(
    (agentId: string) => {
      assignMutation.mutate(
        { leadId, body: { agent_id: agentId } },
        {
          onSuccess: () => setAssignOpen(false),
        },
      );
    },
    [assignMutation, leadId],
  );

  const openCustomerContact = useCallback(
    (mode: "email" | "whatsapp" | "call") => {
      if (!lead) return;
      openContact({
        mode,
        context: mapLeadToContactContext({
          lead,
          user,
          buildMessage: buildDefaultMessage,
        }),
      });
    },
    [buildDefaultMessage, lead, openContact, user],
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
        overrideStatus: t("actions.overrideStatus"),
        emailCustomer: t("actions.emailCustomer"),
        callCustomer: t("actions.callCustomer"),
        whatsappCustomer: t("actions.whatsappCustomer"),
      },
      conversation: {
        title: t("conversation.title"),
        emptyTitle: t("conversation.emptyTitle"),
        emptyDescription: t("conversation.emptyDescription"),
        listUnavailable: t("conversation.listUnavailable"),
        channel: t("conversation.channel"),
      },
      notes: {
        title: t("notes.title"),
        emptyTitle: t("notes.emptyTitle"),
        emptyDescription: t("notes.emptyDescription"),
        listUnavailable: t("notes.listUnavailable"),
      },
      timeline: {
        title: t("timeline.title"),
        emptyTitle: t("timeline.emptyTitle"),
        emptyDescription: t("timeline.emptyDescription"),
      },
      close: {
        title: t("close.title"),
        pendingDescription: t("close.pendingDescription"),
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
          title: statusOverrideMode
            ? t("modals.status.overrideTitle")
            : t("modals.status.title"),
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
    tab,
    onTabChange,
    onBack: () => router.push("/leads"),
    display: lead
      ? {
          leadNumber: lead.lead_number,
          status: lead.status,
          statusLabel: resolvedStatus
            ? tStatus(resolvedStatus)
            : lead.status,
          customerName: resolveLeadCustomerName(lead),
          customerEmail: lead.contact_email?.trim() || t("details.emptyValue"),
          customerPhone: lead.contact_phone?.trim() || t("details.emptyValue"),
          communicationMode:
            lead.communication_mode?.trim() || t("details.emptyValue"),
          propertyTitle: resolveLeadPropertyTitle(lead),
          propertyId: lead.property_id || t("details.emptyValue"),
          propertyHash:
            lead.property_hash != null
              ? String(lead.property_hash)
              : t("details.emptyValue"),
          inquiryType: lead.inquiry_type?.trim() || t("details.emptyValue"),
          sourceLabel,
          message: lead.message?.trim() || t("details.emptyValue"),
          assignedAgent: lead.assigned_agent_id
            ? resolveAssignedAgentLabel(lead)
            : t("details.unassigned"),
          createdAt: formatLeadDate(lead.created_at, locale),
          lastActivity: formatLeadDate(lead.last_activity_at, locale),
          requestCloseAt: formatLeadDate(lead.request_close_at, locale),
          closedAt: formatLeadDate(lead.closed_at, locale),
        }
      : null,
    permissions: {
      canReply,
      canAddNote,
      canUpdateStatus,
      canOverrideStatus,
      canRequestClose,
      canApproveOrRejectClose,
      canAssign,
      assignMode: lead?.assigned_agent_id ? ("reassign" as const) : ("assign" as const),
    },
    conversation: {
      items: messagesQuery.data ?? [],
      isLoading: messagesQuery.isPending,
      hasList: (messagesQuery.data?.length ?? 0) > 0,
    },
    notes: {
      items: notesQuery.data ?? [],
      isLoading: notesQuery.isPending,
      hasList: (notesQuery.data?.length ?? 0) > 0,
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
      isSubmitting: statusMutation.isPending,
      onOpenUpdate: () => openStatusModal(false),
      onOpenOverride: () => openStatusModal(true),
      onClose: () => setStatusOpen(false),
      onValueChange: setStatusValue,
      onReasonChange: setStatusReason,
      onSubmit: submitStatus,
    },
    requestClose: {
      open: requestCloseOpen,
      isSubmitting: requestCloseMutation.isPending,
      onOpen: () => setRequestCloseOpen(true),
      onClose: () => setRequestCloseOpen(false),
      onConfirm: confirmRequestClose,
    },
    approveClose: {
      open: approveCloseOpen,
      reason: closeReason,
      isSubmitting: closeMutation.isPending,
      onOpen: () => setApproveCloseOpen(true),
      onClose: () => setApproveCloseOpen(false),
      onReasonChange: setCloseReason,
      onConfirm: confirmApproveClose,
    },
    rejectClose: {
      open: rejectCloseOpen,
      reason: rejectReason,
      isSubmitting: rejectCloseMutation.isPending,
      onOpen: () => setRejectCloseOpen(true),
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
    contactModal,
    customerContact: {
      onEmail: () => openCustomerContact("email"),
      onCall: () => openCustomerContact("call"),
      onWhatsApp: () => openCustomerContact("whatsapp"),
    },
    formatDate: (value: string | null | undefined) =>
      formatLeadDate(value, locale),
  };
}
