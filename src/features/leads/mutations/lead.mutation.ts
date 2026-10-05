"use client";

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { getLoggedInUser } from "@/src/features/auth/services/auth.service";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import {
  createSmsApiFailure,
  createSmsRequestLock,
  extractApiErrorCode,
  isMobileNotVerifiedApiError,
  requestRegisteredMobileSms,
  sanitizeSmsErrorMessage,
  shouldRetrySmsSend,
} from "@/src/features/profile/utils/registeredMobileSms.utils";
import { useToast } from "@/src/hooks/useToast";
import { LEADS_QUERY_KEY } from "../constants/leadList.constants";
import {
  addLeadMessage,
  addLeadNote,
  assignLeadAgent,
  closeLead,
  createLead,
  requestCloseLead,
  updateLeadStatus,
} from "../services/lead.service";
import type {
  AddLeadMessageRequest,
  AddLeadNoteRequest,
  AssignLeadRequest,
  CloseLeadRequest,
  CreateLeadRequest,
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

/**
 * Creates a lead from a property email inquiry (`EMAIL_FORM`).
 * Success/error toasts are handled by the contact modal when used from that flow;
 * list queries are invalidated here so manager views stay fresh.
 */
export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateLeadRequest) => createLead(body),
    onSuccess: async () => {
      await invalidateLeadQueries(queryClient);
    },
  });
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
  const tSms = useTranslations("leads");
  const toast = useToast();
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const smsLockRef = useRef(createSmsRequestLock());

  return useMutation({
    retry: (_failureCount, error) => shouldRetrySmsSend(error),
    mutationFn: async ({
      leadId,
      body,
    }: {
      leadId: string;
      body: AddLeadMessageRequest;
    }) => {
      if (body.channel.toString().toUpperCase() !== "SMS") {
        return addLeadMessage(leadId, body);
      }

      const outcome = await requestRegisteredMobileSms({
        lock: smsLockRef.current,
        loadUser: async () => {
          const currentUser = await getLoggedInUser();
          setUser(currentUser.data);
          return currentUser.data;
        },
        send: () => addLeadMessage(leadId, body),
      });

      if (outcome.status === "sent") {
        return outcome.result;
      }

      if (outcome.status === "busy") {
        throw createSmsApiFailure({ code: "SMS_IN_FLIGHT", message: "" });
      }

      if (outcome.status === "load_failed") {
        throw outcome.error;
      }

      const code =
        outcome.reason === "missing_phone"
          ? "MOBILE_MISSING"
          : "MOBILE_NOT_VERIFIED";
      throw createSmsApiFailure({ code, message: "" });
    },
    onSuccess: async (_data, variables) => {
      await invalidateLeadQueries(queryClient, variables.leadId);
      if (variables.body.channel.toString().toUpperCase() === "SMS") {
        toast.success(tSms("sms.successTitle"), {
          description: tSms("sms.successDescription"),
        });
        return;
      }
      toast.success(t("messageSuccessTitle"), {
        description: t("messageSuccessDescription"),
      });
    },
    onError: (error: Error, variables) => {
      if (variables.body.channel.toString().toUpperCase() !== "SMS") {
        toast.error(t("messageErrorTitle"), {
          description: error.message,
        });
        return;
      }

      const errorCode = extractApiErrorCode(error);
      if (errorCode === "SMS_IN_FLIGHT") {
        return;
      }

      if (errorCode === "MOBILE_MISSING") {
        toast.error(tSms("sms.failureTitle"), {
          description: tSms("sms.missingPhone"),
        });
        return;
      }

      if (isMobileNotVerifiedApiError(error)) {
        toast.error(tSms("sms.failureTitle"), {
          description: tSms("sms.notVerified"),
        });
        return;
      }

      toast.error(tSms("sms.failureTitle"), {
        description: sanitizeSmsErrorMessage(
          error.message,
          tSms("sms.failureDescription"),
        ),
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
