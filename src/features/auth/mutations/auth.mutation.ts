"use client";

import { useMutation } from "@tanstack/react-query";
import { confirmSignUp, agencySignUp, changePassword, forgotPassword, getLoggedInUser, logout, resetPassword, signInWithOtpRequest, signInWithOtpVerify, signInWithPassword, signUp } from "../services/auth.service";
import { useToast } from "@/src/hooks/useToast";
import { type ApiError } from "@/src/apis/core/error.normalizer";
import { useAuthStore } from "../store/auth.store";
import type { SignInResponse, SignInWithOtpResponse, SignInWithOtpVerifyResponse } from "../types/auth.types";
import { navigateTo } from "@/src/utils/navigation.utils";
import { AppLocale } from "@/src/i18n/routing";
import { useLocale } from "next-intl";

export const useSignInWithPassword = () => {
  const toast = useToast();
  const { setAuth, setUser } = useAuthStore();

  return useMutation({
    mutationFn: signInWithPassword,
    onSuccess: async (response: SignInResponse, variables) => {
      const { access_token, refresh_token, remember_me_cookie } = response.data;
      setAuth(access_token, refresh_token, {
        rememberMeCookie: remember_me_cookie,
        username: variables.username,
      });
      try {
        // ✅ Wait for next tick so cookies are set before the request fires
        await Promise.resolve();
        const userResponse = await getLoggedInUser();
        setUser(userResponse.data);
      } catch (error:any) {
        toast.error("Failed", {
          description: error.message,
        });
      }
    },
    onError: (error: ApiError) => {
      toast.error("Sign in failed", {
        description: error.message,
      });
    },
  });
};

export const useLogout = () => {
  const toast = useToast();
  const { clearAuth } = useAuthStore();
  const locale = useLocale() as AppLocale;

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
      navigateTo(`/${locale}`);
    },
    onError: (error: ApiError) => {
      toast.error("Logout failed", {
        description: error.message,
      });
    },
  });
};

export const useSignUp = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success("Account created successfully", {
        description: "Check your email for the verification code.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Sign up failed", {
        description: error.message,
      });
    },
  });
};

export const useConfirmSignUp = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: confirmSignUp,
    onSuccess: () => {
      toast.success("Account verified successfully", {
        description: "You can now sign in with your credentials.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Verification failed", {
        description: error.message,
      });
    },
  });
};

export const useSignInWithOtpRequest = () => {
  const toast = useToast();
  const setOtpSession = useAuthStore((state) => state.setOtpSession);
  const setOtpCode = useAuthStore((state) => state.setOtpCode);

  return useMutation({
    mutationFn: signInWithOtpRequest,
    onSuccess: (response: SignInWithOtpResponse) => {
      setOtpSession(response.data.session);
      setOtpCode(response.data.otp);
      toast.success("OTP Sent Successfully", {
        description: "A verification code has been sent. Please check your inbox.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Failed to send OTP", {
        description: error.message,
      });
    },
  });
};

export const useSignInWithOtpVerify = () => {
  const toast = useToast();
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
      try {
        await Promise.resolve();
        const userResponse = await getLoggedInUser();
        setUser(userResponse.data);
      } catch (error: any) {
        toast.error("Failed", {
          description: error.message,
        });
      }
    },
    onError: (error: ApiError) => {
      toast.error("OTP verification failed", {
        description: error.message,
      });
    },
  });
};

export const useAgencySignUp = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: agencySignUp,
    onSuccess: () => {
      toast.success("Registration submitted", {
        description: "Check your email for the verification code.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Agency registration failed", {
        description: error.message,
      });
    },
  });
};

export const useForgotPassword = () => {
  const toast = useToast();
  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("OTP Sent Successfully", {
        description: "A verification code has been sent. Please check your inbox.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Failed to send OTP", {
        description: error.message,
      });
    },
  });
};

export const useResetPassword = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully", {
        description: "You can now sign in with your new password.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Password reset failed", {
        description: error.message,
      });
    },
  });
};

export const useChangePassword = () => {
  const toast = useToast();

  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password updated successfully", {
        description: "Your password has been changed.",
      });
    },
    onError: (error: ApiError) => {
      toast.error("Change password failed", {
        description: error.message,
      });
    },
  });
};