"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useToast } from "@/src/hooks/useToast";
import { LEADS_QUERY_KEY } from "../constants/leadList.constants";
import {
  addLeadMessage,
  addLeadNote,
  assignLeadAgent,
  closeLead,
  requestCloseLead,
  updateLeadStatus,
} from "../services/lead.service";
import type {
  AddLeadMessageRequest,
  AddLeadNoteRequest,
  AssignLeadRequest,
  CloseLeadRequest,
  UpdateLeadStatusRequest,
} from "../types/lead.types";

async function invalidateLeadQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  leadId?: string,
) {
  await queryClient.invalidateQueries({ queryKey: [LEADS_QUERY_KEY, "list"] });
  if (leadId) {
    await queryClient.invalidateQueries({
      queryKey: [LEADS_QUERY_KEY, "detail", leadId],
    });
    await queryClient.invalidateQueries({
      queryKey: [LEADS_QUERY_KEY, "notes", leadId],
    });
    await queryClient.invalidateQueries({
      queryKey: [LEADS_QUERY_KEY, "messages", leadId],
    });
    await queryClient.invalidateQueries({
      queryKey: [LEADS_QUERY_KEY, "activity", leadId],
    });
  }
}

export function useAssignLeadAgent() {
  const t = useTranslations("leads.mutations");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      leadId,
      body,
    }: {
      leadId: string;
      body: AssignLeadRequest;
    }) => assignLeadAgent(leadId, body),
    onSuccess: async (_data, variables) => {
      await invalidateLeadQueries(queryClient, variables.leadId);
      toast.success(t("assignSuccessTitle"), {
        description: t("assignSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("assignErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useUpdateLeadStatus() {
  const t = useTranslations("leads.mutations");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      leadId,
      body,
    }: {
      leadId: string;
      body: UpdateLeadStatusRequest;
    }) => updateLeadStatus(leadId, body),
    onSuccess: async (_data, variables) => {
      await invalidateLeadQueries(queryClient, variables.leadId);
      toast.success(t("statusSuccessTitle"), {
        description: t("statusSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("statusErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useRequestCloseLead() {
  const t = useTranslations("leads.mutations");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leadId: string) => requestCloseLead(leadId),
    onSuccess: async (_data, leadId) => {
      await invalidateLeadQueries(queryClient, leadId);
      toast.success(t("requestCloseSuccessTitle"), {
        description: t("requestCloseSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("requestCloseErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useCloseLead() {
  const t = useTranslations("leads.mutations");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      leadId,
      body,
    }: {
      leadId: string;
      body?: CloseLeadRequest;
    }) => closeLead(leadId, body),
    onSuccess: async (_data, variables) => {
      await invalidateLeadQueries(queryClient, variables.leadId);
      toast.success(t("closeSuccessTitle"), {
        description: t("closeSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("closeErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useAddLeadNote() {
  const t = useTranslations("leads.mutations");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      leadId,
      body,
    }: {
      leadId: string;
      body: AddLeadNoteRequest;
    }) => addLeadNote(leadId, body),
    onSuccess: async (_data, variables) => {
      await invalidateLeadQueries(queryClient, variables.leadId);
      toast.success(t("noteSuccessTitle"), {
        description: t("noteSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("noteErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useAddLeadMessage() {
  const t = useTranslations("leads.mutations");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      leadId,
      body,
    }: {
      leadId: string;
      body: AddLeadMessageRequest;
    }) => addLeadMessage(leadId, body),
    onSuccess: async (_data, variables) => {
      await invalidateLeadQueries(queryClient, variables.leadId);
      toast.success(t("messageSuccessTitle"), {
        description: t("messageSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("messageErrorTitle"), {
        description: error.message,
      });
    },
  });
}

/** Reject close request by moving status back to IN_PROGRESS. */
export function useRejectCloseLead() {
  const t = useTranslations("leads.mutations");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      leadId,
      reason,
    }: {
      leadId: string;
      reason?: string | null;
    }) =>
      updateLeadStatus(leadId, {
        status: "IN_PROGRESS",
        reason: reason ?? undefined,
      }),
    onSuccess: async (_data, variables) => {
      await invalidateLeadQueries(queryClient, variables.leadId);
      toast.success(t("rejectCloseSuccessTitle"), {
        description: t("rejectCloseSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("rejectCloseErrorTitle"), {
        description: error.message,
      });
    },
  });
}
