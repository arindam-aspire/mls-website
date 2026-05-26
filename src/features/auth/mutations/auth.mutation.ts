"use client";

import { useMutation } from "@tanstack/react-query";
import { confirmSignUp, forgotPassword, getLoggedInUser, logout, signInWithOtpRequest, signInWithOtpVerify, signInWithPassword, signUp } from "../services/auth.service";
import { useToast } from "@/src/hooks/useToast";
import { type ApiError } from "@/src/apis/core/error.normalizer";
import { useAuthStore } from "../store/auth.store";
import type { SignInResponse, SignInWithOtpResponse, SignInWithOtpVerifyResponse } from "../types/auth.types";

export const useSignInWithPassword = () => {
  const toast = useToast();
  const { setAuth, setUser } = useAuthStore();

  return useMutation({
    mutationFn: signInWithPassword,
    onSuccess: async (response: SignInResponse) => {
      const { access_token, refresh_token } = response.data;
      setAuth(access_token, refresh_token);
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

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearAuth();
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
        description: "You can now sign in with your credentials.",
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
  const { setPendingOtpSession } = useAuthStore();

  return useMutation({
    mutationFn: signInWithOtpRequest,
    onSuccess: (response: SignInWithOtpResponse) => {
      setPendingOtpSession(response.data);
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
  const { setAuth, setUser } = useAuthStore();

  return useMutation({
    mutationFn: signInWithOtpVerify,
    onSuccess: async (response: SignInWithOtpVerifyResponse) => {
      const { access_token, refresh_token } = response.data;
      setAuth(access_token, refresh_token);
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