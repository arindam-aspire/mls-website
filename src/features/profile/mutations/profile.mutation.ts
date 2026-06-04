"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useToast } from "@/src/hooks/useToast";
import {
  deleteAgencyLogo,
  deleteProfilePicture,
  requestProfileUpdate,
  updateProfile,
  updateAgency,
  uploadAgencyLegalDocument,
  uploadAgencyLogo,
  uploadProfilePicture,
  verifyProfileUpdateAndRefreshUser,
} from "../services/profile.service";
import type {
  GetAgencyResponse,
  NormalizedGetAgencyResponse,
  UpdateAgencyRequest,
  ProfileUpdateRequestBody,
  ProfileUpdateVerifyBody,
} from "../types/profile.types";

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

function agencyQueryKey(agencyId: string) {
  return ["agency", agencyId] as const;
}

function patchAgencyQueryCache(
  queryClient: ReturnType<typeof useQueryClient>,
  agencyId: string,
  agency: NormalizedGetAgencyResponse["data"],
) {
  queryClient.setQueryData<NormalizedGetAgencyResponse>(agencyQueryKey(agencyId), (current) =>
    current
      ? { ...current, data: agency }
      : {
          success: true,
          message: null,
          data: agency,
          error: null,
          meta: {},
        },
  );
}

export function useUpdateAgency(agencyId: string) {
  const t = useTranslations("profile");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateAgencyRequest) => updateAgency(agencyId, body),
    onSuccess: (agency) => {
      patchAgencyQueryCache(queryClient, agencyId, agency);
      toast.success(t("editAgencySuccessTitle"), {
        description: t("editAgencySuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("editAgencyErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useUpdateAgencyDisplayPreferences(agencyId: string) {
  const t = useTranslations("profile.displayPreferences");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateAgencyRequest) => updateAgency(agencyId, body),
    onSuccess: (agency) => {
      patchAgencyQueryCache(queryClient, agencyId, agency);
      toast.success(t("updateSuccessTitle"), {
        description: t("updateSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("updateErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useUploadAgencyLogo(agencyId: string) {
  const t = useTranslations("profile");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadAgencyLogo(agencyId, file),
    onSuccess: (agency) => {
      patchAgencyQueryCache(queryClient, agencyId, agency);
      toast.success(t("uploadAgencyLogoSuccessTitle"), {
        description: t("uploadAgencyLogoSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("uploadAgencyLogoErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useUploadAgencyLegalDocument(agencyId: string) {
  const t = useTranslations("profile");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadAgencyLegalDocument(agencyId, file),
    onSuccess: (agency) => {
      patchAgencyQueryCache(queryClient, agencyId, agency);
      toast.success(t("uploadAgencyLicenseSuccessTitle"), {
        description: t("uploadAgencyLicenseSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("uploadAgencyLicenseErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useDeleteAgencyLogo(agencyId: string) {
  const t = useTranslations("profile");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteAgencyLogo(agencyId),
    onSuccess: (agency) => {
      patchAgencyQueryCache(queryClient, agencyId, agency);
      toast.success(t("removeAgencyLogoSuccessTitle"), {
        description: t("removeAgencyLogoSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("removeAgencyLogoErrorTitle"), {
        description: error.message,
      });
    },
  });
}
