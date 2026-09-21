"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import {
  confirmSignUp,
  agencySignUp,
  changePassword,
  forgotPassword,
  getLoggedInUser,
  logout,
  resendConfirmation,
  resetPassword,
  signInWithOtpRequest,
  signInWithOtpVerify,
  signInWithPassword,
  signUp,
} from "../services/auth.service";
import { useToast } from "@/src/hooks/useToast";
import { clearNotificationQueryCache } from "@/src/features/notifications/utils/clearNotificationQueryCache";
import { isConflictStatus, type ApiError } from "@/src/apis/core/error.normalizer";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import type {
  LoggedInUser,
  SignInResponse,
  SignInWithOtpResponse,
  SignInWithOtpVerifyResponse,
} from "../types/auth.types";
import type { SignInRole } from "../types/signIn.types";
import {
  getPostSignInRedirectPath,
  resolveImmediateDashboardPath,
} from "../utils/postSignInRedirect";
import { navigateTo } from "@/src/utils/navigation.utils";
import { AppLocale } from "@/src/i18n/routing";

async function completeSignInFlow(
  accessToken: string,
  locale: AppLocale,
  setUser: (user: LoggedInUser) => void,
  onProfileError: (message: string) => void,
  signInRole?: SignInRole,
) {
  await Promise.resolve();

  const dashboardPath = resolveImmediateDashboardPath(
    accessToken,
    locale,
    signInRole,
  );

  if (dashboardPath) {
    useAuthStore.getState().closeAuth();
    navigateTo(dashboardPath);

    try {
      const userResponse = await getLoggedInUser();
      setUser(userResponse.data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed";
      onProfileError(message);
    }
    return;
  }

  try {
    const userResponse = await getLoggedInUser();
    const user = userResponse.data;
    setUser(user);

    const path = getPostSignInRedirectPath(user, locale);
    useAuthStore.getState().closeAuth();
    if (path) navigateTo(path);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed";
    onProfileError(message);
  }
}

export const useSignInWithPassword = () => {
  const toast = useToast();
  const tApi = useTranslations("auth.api");
  const locale = useLocale() as AppLocale;
  const { setAuth, setUser } = useAuthStore();

  return useMutation({
    mutationFn: signInWithPassword,
    onSuccess: async (response: SignInResponse, variables) => {
      const { access_token, refresh_token, remember_me_cookie, requires_password_set } = response.data;
      setAuth(access_token, refresh_token, {
        rememberMeCookie: remember_me_cookie,
        username: variables.username,
      });
      if (requires_password_set) {
        useAuthStore.getState().closeAuth();
        navigateTo(`/${locale}/set-new-password`);
        return;
      }
      await completeSignInFlow(
        access_token,
        locale,
        setUser,
        (message) => {
          toast.error(tApi("profileLoadFailedTitle"), { description: message });
        },
      );
    },
    onError: (error: ApiError) => {
      toast.error(tApi("signInFailedTitle"), {
        description: error.message,
      });
    },
  });
};

export const useLogout = () => {
  const toast = useToast();
  const tApi = useTranslations("auth.api");
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();
  const locale = useLocale() as AppLocale;

  return useMutation({
    mutationFn: logout,
    onSettled: (_data, error) => {
      clearNotificationQueryCache(queryClient);
      clearAuth();
      navigateTo(`/${locale}`);

      if (error) {
        toast.error(tApi("logoutFailedTitle"), {
          description: error.message,
        });
      }
    },
  });
};

export const useSignUp = () => {
  const toast = useToast();
  const tApi = useTranslations("auth.api");

  return useMutation({
    mutationFn: signUp,
    onSuccess: (response) => {
      toast.success(tApi("signUpSuccessTitle"), {
        description: response.message || tApi("signUpSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      if (isConflictStatus(error)) {
        toast.error(tApi("signUpEmailExistsTitle"), {
          description: error.message || tApi("signUpEmailExistsDescription"),
        });
        return;
      }

      toast.error(tApi("signUpFailedTitle"), {
        description: error.message,
      });
    },
  });
};

export const useConfirmSignUp = () => {
  const toast = useToast();
  const tApi = useTranslations("auth.api");

  return useMutation({
    mutationFn: confirmSignUp,
    onSuccess: (response) => {
      toast.success(tApi("confirmSuccessTitle"), {
        description: response.message || tApi("confirmSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(tApi("confirmFailedTitle"), {
        description: error.message,
      });
    },
  });
};

export const useResendConfirmation = () => {
  const toast = useToast();
  const tApi = useTranslations("auth.api");

  return useMutation({
    mutationFn: resendConfirmation,
    onSuccess: (response) => {
      toast.success(tApi("resendSuccessTitle"), {
        description: response.message || tApi("resendSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(tApi("resendFailedTitle"), {
        description: error.message,
      });
    },
  });
};

export const useSignInWithOtpRequest = () => {
  const toast = useToast();
  const tApi = useTranslations("auth.api");
  const setOtpSession = useAuthStore((state) => state.setOtpSession);

  return useMutation({
    mutationFn: signInWithOtpRequest,
    onSuccess: (response: SignInWithOtpResponse) => {
      setOtpSession(response.data.session);
      toast.success(tApi("otpSentTitle"), {
        description: response.message || tApi("otpSentDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(tApi("otpSendFailedTitle"), {
        description: error.message,
      });
    },
  });
};

export const useSignInWithOtpVerify = () => {
  const toast = useToast();
  const tApi = useTranslations("auth.api");
  const locale = useLocale() as AppLocale;
  const { setAuth, setUser, clearOtpSession } = useAuthStore();

  return useMutation({
    mutationFn: signInWithOtpVerify,
    onSuccess: async (response: SignInWithOtpVerifyResponse, variables) => {
      const { access_token, refresh_token, remember_me_cookie } = response.data;
      setAuth(access_token, refresh_token, {
        rememberMeCookie: remember_me_cookie,
        username: variables.username,
      });
      clearOtpSession();
      await completeSignInFlow(
        access_token,
        locale,
        setUser,
        (message) => {
          toast.error(tApi("profileLoadFailedTitle"), { description: message });
        },
      );
    },
    onError: (error: ApiError) => {
      toast.error(tApi("otpVerifyFailedTitle"), {
        description: error.message,
      });
    },
  });
};

export const useAgencySignUp = () => {
  const toast = useToast();
  const tApi = useTranslations("auth.api");

  return useMutation({
    mutationFn: agencySignUp,
    onSuccess: (response) => {
      toast.success(tApi("agencySignUpSuccessTitle"), {
        description: response.message || tApi("agencySignUpSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      if (isConflictStatus(error)) {
        toast.error(tApi("signUpEmailExistsTitle"), {
          description: error.message || tApi("signUpEmailExistsDescription"),
        });
        return;
      }

      toast.error(tApi("agencySignUpFailedTitle"), {
        description: error.message,
      });
    },
  });
};

export const useForgotPassword = () => {
  const toast = useToast();
  const tApi = useTranslations("auth.api");

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (response) => {
      toast.success(tApi("forgotPasswordSuccessTitle"), {
        description: response.message || tApi("forgotPasswordSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(tApi("forgotPasswordFailedTitle"), {
        description: error.message,
      });
    },
  });
};

export const useResetPassword = () => {
  const toast = useToast();
  const tApi = useTranslations("auth.api");

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (response) => {
      toast.success(tApi("resetPasswordSuccessTitle"), {
        description: response.message || tApi("resetPasswordSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(tApi("resetPasswordFailedTitle"), {
        description: error.message,
      });
    },
  });
};

export const useChangePassword = () => {
  const toast = useToast();
  const tApi = useTranslations("auth.api");

  return useMutation({
    mutationFn: changePassword,
    onSuccess: (response) => {
      toast.success(tApi("changePasswordSuccessTitle"), {
        description: response.message || tApi("changePasswordSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(tApi("changePasswordFailedTitle"), {
        description: error.message,
      });
    },
  });
};
