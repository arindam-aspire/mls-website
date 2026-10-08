"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import {
  confirmSignUp,
  resendConfirmation,
  resendPhoneOtp,
  sendPhoneOtp,
  verifyPhoneOtp,
} from "@/src/features/auth/services/auth.service";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import { useToast } from "@/src/hooks/useToast";
import { resolveDisplayableImageSrc } from "@/src/lib/shouldUnoptimizeImageSrc";
import {
  deleteAgencyLogo,
  deleteProfilePicture,
  refreshAuthenticatedProfile,
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
import {
  isContactAlreadyVerifiedError,
  registeredContactChannel,
  type RegisteredContactOtpConfirm,
  type RegisteredContactOtpRequest,
} from "../utils/contactVerification.utils";
import { sanitizeSmsErrorMessage } from "../utils/registeredMobileSms.utils";

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
        description: sanitizeSmsErrorMessage(
          error.message,
          t("verificationErrorDescription"),
        ),
      });
    },
  });
}

type RegisteredContactOtpRequestResult = {
  alreadyVerified: boolean;
  user: LoggedInUser | null;
};

export function useRequestRegisteredContactOtp() {
  const t = useTranslations("profile.contactVerification");
  const toast = useToast();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (
      body: RegisteredContactOtpRequest,
    ): Promise<RegisteredContactOtpRequestResult> => {
      try {
        if (body.channel === "email") {
          await resendConfirmation({ email: body.email, channel: "email" });
          return { alreadyVerified: false, user: null };
        }

        const response = body.resend
          ? await resendPhoneOtp({ phone_number: body.phoneNumber })
          : await sendPhoneOtp({ phone_number: body.phoneNumber });
        if (response.data?.phone_verified === true) {
          const user = await refreshAuthenticatedProfile();
          return { alreadyVerified: true, user };
        }
        return { alreadyVerified: false, user: null };
      } catch (error) {
        if (!isContactAlreadyVerifiedError(error)) {
          throw error;
        }
        const user = await refreshAuthenticatedProfile();
        return { alreadyVerified: true, user };
      }
    },
    onSuccess: (result, variables) => {
      if (!result.alreadyVerified || !result.user) return;

      setUser(result.user);
      const channel = registeredContactChannel(variables);
      toast.success(t("alreadyVerifiedTitle"), {
        description: t(
          channel === "email"
            ? "emailAlreadyVerifiedDescription"
            : "phoneAlreadyVerifiedDescription",
        ),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("sendErrorTitle"), {
        description: sanitizeSmsErrorMessage(error.message, t("sendErrorDescription")),
      });
    },
  });
}

type RegisteredContactOtpConfirmResult = {
  alreadyVerified: boolean;
  user: LoggedInUser;
};

export function useConfirmRegisteredContactOtp() {
  const t = useTranslations("profile.contactVerification");
  const toast = useToast();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: async (
      body: RegisteredContactOtpConfirm,
    ): Promise<RegisteredContactOtpConfirmResult> => {
      try {
        if (body.channel === "email") {
          await confirmSignUp({ email: body.email, code: body.code });
        } else {
          await verifyPhoneOtp({
            phone_number: body.phoneNumber,
            phone_otp: body.phoneOtp,
          });
        }
        const user = await refreshAuthenticatedProfile();
        return { alreadyVerified: false, user };
      } catch (error) {
        if (!isContactAlreadyVerifiedError(error)) {
          throw error;
        }
        const user = await refreshAuthenticatedProfile();
        return { alreadyVerified: true, user };
      }
    },
    onSuccess: (result, variables) => {
      setUser(result.user);
      const channel = registeredContactChannel(variables);

      if (result.alreadyVerified) {
        toast.success(t("alreadyVerifiedTitle"), {
          description: t(
            channel === "email"
              ? "emailAlreadyVerifiedDescription"
              : "phoneAlreadyVerifiedDescription",
          ),
        });
        return;
      }

      toast.success(
        t(channel === "email" ? "emailSuccessTitle" : "phoneSuccessTitle"),
        {
          description: t(
            channel === "email" ? "emailSuccessDescription" : "phoneSuccessDescription",
          ),
        },
      );
    },
    onError: (error: ApiError, variables) => {
      const channel = registeredContactChannel(variables);
      toast.error(t(channel === "email" ? "emailErrorTitle" : "phoneErrorTitle"), {
        description: sanitizeSmsErrorMessage(
          error.message,
          t("confirmErrorDescription"),
        ),
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
        description: sanitizeSmsErrorMessage(
          error.message,
          t("verificationErrorDescription"),
        ),
      });
    },
  });
}

function retainDisplayableProfilePicture(incoming: LoggedInUser): LoggedInUser {
  const nextUrl = resolveDisplayableImageSrc(
    incoming.profile_picture_url,
    useAuthStore.getState().user?.profile_picture_url,
  );
  if (nextUrl === (incoming.profile_picture_url?.trim() || null)) {
    return incoming;
  }
  return { ...incoming, profile_picture_url: nextUrl };
}

export function useUploadProfilePicture() {
  const t = useTranslations("profile");
  const toast = useToast();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: (user) => {
      setUser(retainDisplayableProfilePicture(user));
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
