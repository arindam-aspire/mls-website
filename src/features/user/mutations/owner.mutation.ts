"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useToast } from "@/src/hooks/useToast";
import { updateOwner, updateOwnerStatus } from "../services/owner.service";
import type { OwnerStatusUpdateRequest, UpdateOwnerRequest } from "../types/owner.types";

export function useUpdateOwnerStatus() {
  const t = useTranslations("user.owners.statusUpdate");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ownerId,
      body,
    }: {
      ownerId: string;
      body: OwnerStatusUpdateRequest;
    }) => updateOwnerStatus(ownerId, body),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ["owners", "list"] });

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

export function useUpdateOwner() {
  const t = useTranslations("user.owners.editModal");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ownerId,
      body,
    }: {
      ownerId: string;
      body: UpdateOwnerRequest;
    }) => updateOwner(ownerId, body),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ["owners", "list"] });

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
