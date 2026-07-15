"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useToast } from "@/src/hooks/useToast";
import {
  deleteAgent,
  inviteAgentByEmail,
  manualOnboardAgent,
  resendAgentInvitation,
  updateAgentStatus,
} from "../services/agent.service";
import type {
  AgentInviteRequest,
  AgentStatusUpdateRequest,
  ManualOnboardAgentRequest,
} from "../types/agent.types";

export function useInviteAgentByEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: AgentInviteRequest) => inviteAgentByEmail(body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["agents", "summary"] }),
        queryClient.invalidateQueries({ queryKey: ["agents", "list"] }),
      ]);
    },
  });
}

export function useManualOnboardAgent() {
  const t = useTranslations("user.agents.manualOnboardModal");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ManualOnboardAgentRequest) => manualOnboardAgent(body),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["agents", "summary"] }),
        queryClient.invalidateQueries({ queryKey: ["agents", "list"] }),
      ]);
    },
    onError: (error: ApiError) => {
      toast.error(t("errorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useResendAgentInvitation() {
  const t = useTranslations("user.agents.resendConfirm");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agentId: string) => resendAgentInvitation(agentId),
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["agents", "summary"] }),
        queryClient.invalidateQueries({ queryKey: ["agents", "list"] }),
      ]);

      toast.success(t("successTitle"), {
        description: result.message || t("successDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("errorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useUpdateAgentStatus() {
  const t = useTranslations("user.agents.statusUpdate");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      agentId,
      body,
    }: {
      agentId: string;
      body: AgentStatusUpdateRequest;
    }) => updateAgentStatus(agentId, body),
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["agents", "summary"] }),
        queryClient.invalidateQueries({ queryKey: ["agents", "list"] }),
      ]);

      toast.success(t("successTitle"), {
        description: result.message || t("successDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("errorTitle"), {
        description: error.message || t("errorDescription"),
      });
    },
  });
}

export function useDeleteAgent() {
  const t = useTranslations("user.agents.deleteConfirm");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agentId: string) => deleteAgent(agentId),
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["agents", "summary"] }),
        queryClient.invalidateQueries({ queryKey: ["agents", "list"] }),
      ]);

      toast.success(t("successTitle"), {
        description: result.message || t("successDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("errorTitle"), {
        description: error.message,
      });
    },
  });
}
