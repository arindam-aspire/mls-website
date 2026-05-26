"use client";

import { useMutation } from "@tanstack/react-query";
import { getLoggedInUser, logout, signInWithPassword } from "../services/auth.service";
import { useToast } from "@/src/hooks/useToast";
import { type ApiError } from "@/src/apis/core/error.normalizer";
import { useAuthStore } from "../store/auth.store";
import type { LoggedInUserResponse, SignInResponse } from "../types/auth.types";

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