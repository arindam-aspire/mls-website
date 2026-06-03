"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useToast } from "@/src/hooks/useToast";
import {
  deleteProfilePicture,
  requestProfileUpdate,
  updateProfile,
  uploadProfilePicture,
  verifyProfileUpdateAndRefreshUser,
} from "../services/profile.service";
import type {
  ProfileUpdateRequestBody,
  ProfileUpdateVerifyBody,
} from "../types/profile.api.types";

function useProfileUpdateMutation(
  successTitleKey: "updateEmailSuccessTitle" | "updatePhoneSuccessTitle" | "updateProfileSuccessTitle",
  successDescriptionKey:
    | "updateEmailSuccessDescription"
    | "updatePhoneSuccessDescription"
    | "updateProfileSuccessDescription",
  errorTitleKey: "updateEmailErrorTitle" | "updatePhoneErrorTitle" | "updateProfileErrorTitle",
) {
  const t = useTranslations("profile");
  const toast = useToast();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (response) => {
      setUser(response.data);
      toast.success(t(successTitleKey), {
        description: t(successDescriptionKey),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t(errorTitleKey), {
        description: error.message,
      });
    },
  });
}

export function useUpdateProfile() {
  return useProfileUpdateMutation(
    "updateProfileSuccessTitle",
    "updateProfileSuccessDescription",
    "updateProfileErrorTitle",
  );
}

export function useRequestProfileUpdate() {
  const t = useTranslations("profile");
  const toast = useToast();

  return useMutation({
    mutationFn: (body: ProfileUpdateRequestBody) => requestProfileUpdate(body),
    onError: (error: ApiError) => {
      toast.error(t("requestProfileUpdateErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useVerifyProfileUpdate(field: "email" | "phone") {
  const t = useTranslations("profile");
  const toast = useToast();
  const setUser = useAuthStore((state) => state.setUser);

  const successTitleKey =
    field === "email" ? "updateEmailSuccessTitle" : "updatePhoneSuccessTitle";
  const successDescriptionKey =
    field === "email"
      ? "updateEmailSuccessDescription"
      : "updatePhoneSuccessDescription";
  const errorTitleKey =
    field === "email" ? "updateEmailErrorTitle" : "updatePhoneErrorTitle";

  return useMutation({
    mutationFn: (body: ProfileUpdateVerifyBody) =>
      verifyProfileUpdateAndRefreshUser(body),
    onSuccess: (user) => {
      setUser(user);
      toast.success(t(successTitleKey), {
        description: t(successDescriptionKey),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t(errorTitleKey), {
        description: error.message,
      });
    },
  });
}

export function useUploadProfilePicture() {
  const t = useTranslations("profile");
  const toast = useToast();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: (user) => {
      setUser(user);
      toast.success(t("uploadProfilePhotoSuccessTitle"), {
        description: t("uploadProfilePhotoSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("uploadProfilePhotoErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useDeleteProfilePicture() {
  const t = useTranslations("profile");
  const toast = useToast();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: deleteProfilePicture,
    onSuccess: (user) => {
      setUser(user);
      toast.success(t("removeProfilePhotoSuccessTitle"), {
        description: t("removeProfilePhotoSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("removeProfilePhotoErrorTitle"), {
        description: error.message,
      });
    },
  });
}
