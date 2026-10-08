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
  signInWithSocial,
  signUp,
} from "../services/auth.service";
import { tokenStore } from "@/src/apis/core/token.store";
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
import type { SocialLoginRequest } from "../types/socialLogin.types";
import { resolveSocialAuthErrorMessage } from "../utils/socialAuthError";
import {
  buildCognitoLogoutUrl,
  isSocialOAuthPopup,
  markCognitoHostedSession,
  takeCognitoHostedSession,
} from "../utils/socialOAuth";
import { readSocialOAuthPublicConfig } from "@/src/configs/environment.config";
import {
  getPostSignInRedirectPath,
  resolveImmediateDashboardPath,
} from "../utils/postSignInRedirect";
import { navigateTo } from "@/src/utils/navigation.utils";
import { AppLocale } from "@/src/i18n/routing";
import { AUTH_VIEW } from "../authViews";
import {
  resolveRegisteredPhoneForVerification,
  shouldOpenSignupPhoneVerification,
} from "../utils/signupPhoneVerification";

function continueToSignupPhoneVerification(user: LoggedInUser): boolean {
  const state = useAuthStore.getState();
  const phoneNumber = resolveRegisteredPhoneForVerification({
    accountPhone: user.phone_number,
    signupPhone: state.pendingPhone,
  });

  if (
    !shouldOpenSignupPhoneVerification({
      pending: state.signupPhoneVerificationPending,
      phoneNumber,
      isPhoneVerified: user.is_phone_verified,
    })
  ) {
    if (state.signupPhoneVerificationPending) {
      state.setSignupPhoneVerificationPending(false);
    }
    return false;
  }

  state.setPendingPhone(phoneNumber);
  state.navigate(AUTH_VIEW.verifyPhone);
  return true;
}

async function completeSignInFlow(
  accessToken: string,
  locale: AppLocale,
  setUser: (user: LoggedInUser) => void,
  onProfileError: (message: string) => void,
  signInRole?: SignInRole,
  fallbackPath?: string | null,
) {
  await Promise.resolve();

  if (useAuthStore.getState().signupPhoneVerificationPending) {
    try {
      const userResponse = await getLoggedInUser();
      const user = userResponse.data;
      setUser(user);
      if (continueToSignupPhoneVerification(user)) {
        return;
      }
    } catch (error: unknown) {
      useAuthStore.getState().setSignupPhoneVerificationPending(false);
      const message = error instanceof Error ? error.message : "Failed";
      onProfileError(message);
      return;
    }
  }


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

    const path = getPostSignInRedirectPath(user, locale) ?? fallbackPath ?? null;
    useAuthStore.getState().closeAuth();
    if (path) navigateTo(path);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed";
    onProfileError(message);
  }
}

/** Applies a social session that was created in the provider window to this page. */
export async function resumeSocialSignInFromPopup(input: {
  locale: AppLocale;
  role: SignInRole;
  requiresPasswordSet: boolean;
  rememberMeCookie: boolean;
  onProfileError: (message: string) => void;
}) {
  const accessToken = tokenStore.getAccessToken();
  if (!accessToken) return;
  useAuthStore.getState().setAccessToken(accessToken);

  if (input.requiresPasswordSet) {
    useAuthStore.getState().closeAuth();
    navigateTo(`/${input.locale}/set-new-password`);
    return;
  }

  await completeSignInFlow(
    accessToken,
    input.locale,
    useAuthStore.getState().setUser,
    input.onProfileError,
    input.role,
    `/${input.locale}`,
  );

  const email = useAuthStore.getState().user?.email?.trim();
  if (email) {
    tokenStore.setAuthPreferences(input.rememberMeCookie, email);
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
      useAuthStore.getState().setSignupPhoneVerificationPending(false);
      toast.error(tApi("signInFailedTitle"), {
        description: error.message,
      });
    },
  });
};

type SocialSignInVariables = SocialLoginRequest & {
  username?: string;
  locale?: AppLocale;
};

export const useSignInWithSocial = () => {
  const toast = useToast();
  const tApi = useTranslations("auth.api");
  const tSocial = useTranslations("auth.socialOAuth");
  const locale = useLocale() as AppLocale;
  const { setAuth, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (variables: SocialSignInVariables) => signInWithSocial(variables),
    onSuccess: async (response, variables) => {
      const { access_token, refresh_token, remember_me_cookie, requires_password_set } = response.data;
      const sessionLocale = variables.locale ?? locale;
      const username = variables.username?.trim() ?? "";
      setAuth(access_token, refresh_token, {
        rememberMeCookie: remember_me_cookie,
        username,
      });
      markCognitoHostedSession();

      if (isSocialOAuthPopup()) return;

      if (requires_password_set) {
        useAuthStore.getState().closeAuth();
        navigateTo(`/${sessionLocale}/set-new-password`);
        return;
      }

      await completeSignInFlow(
        access_token,
        sessionLocale,
        setUser,
        (message) => {
          toast.error(tApi("profileLoadFailedTitle"), { description: message });
        },
        variables.role,
        `/${sessionLocale}`,
      );

      const email = useAuthStore.getState().user?.email?.trim();
      if (email) {
        tokenStore.setAuthPreferences(remember_me_cookie, email);
      }
    },
    onError: (error: ApiError) => {
      if (isSocialOAuthPopup()) return;
      toast.error(tSocial("failedTitle"), {
        description: resolveSocialAuthErrorMessage(error, tSocial),
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

      const config = readSocialOAuthPublicConfig();
      const cognitoLogoutUrl = takeCognitoHostedSession()
        ? buildCognitoLogoutUrl({
            domain: config.cognitoDomain,
            clientId: config.cognitoAppClientId,
            logoutUri: config.logoutUri,
          })
        : null;

      if (cognitoLogoutUrl) {
        window.location.assign(cognitoLogoutUrl);
      } else {
        navigateTo(`/${locale}`);
      }

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
    onSuccess: () => {
      toast.success(tApi("signUpSuccessTitle"), {
        description: tApi("signUpSuccessDescription"),
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
    onSuccess: () => {
      toast.success(tApi("resendSuccessTitle"), {
        description: tApi("resendSuccessDescription"),
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
        description: tApi("otpSentDescription"),
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
    onSuccess: () => {
      toast.success(tApi("agencySignUpSuccessTitle"), {
        description: tApi("agencySignUpSuccessDescription"),
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
    onSuccess: () => {
      toast.success(tApi("forgotPasswordSuccessTitle"), {
        description: tApi("forgotPasswordSuccessDescription"),
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
