"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useToast } from "@/src/hooks/useToast";
import { updateProfile } from "../services/profile.service";

export function useUpdateProfile() {
  const t = useTranslations("profile");
  const toast = useToast();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (response) => {
      setUser(response.data);
      toast.success(t("updateProfileSuccessTitle"), {
        description: t("updateProfileSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("updateProfileErrorTitle"), {
        description: error.message,
      });
    },
  });
}
