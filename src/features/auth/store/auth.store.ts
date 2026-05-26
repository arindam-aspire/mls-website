import { create } from "zustand";
import { tokenStore } from "@/src/apis/core/token.store";
import { LoggedInUser, SignUpFormValues } from "../types/auth.types";

interface AuthState {
  user: LoggedInUser | null;
  isLoadingUser: boolean;
  access_token: string | null;
  refresh_token: string | null;
  forgotPasswordOtp: string | null;
  pendingSignUp: SignUpFormValues | null;
  setAuth: (access_token: string, refresh_token: string) => void;
  setAccessToken: (access_token: string) => void;
  setRefreshToken: (refresh_token: string) => void;
  setUser: (user: LoggedInUser) => void;
  setIsLoadingUser: (loading: boolean) => void;
  setForgotPasswordOtp: (otp: string) => void;
  clearForgotPasswordOtp: () => void;
  setPendingSignUp: (data: SignUpFormValues) => void;
  clearPendingSignUp: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoadingUser: false,
  access_token: null,
  refresh_token: null,
  forgotPasswordOtp: null,
  pendingSignUp: null,

  setAuth: (access_token, refresh_token) => {
    tokenStore.setAccessToken(access_token);
    tokenStore.setRefreshToken(refresh_token);
    set({ access_token, refresh_token });
  },

  setAccessToken: (access_token) => {
    tokenStore.setAccessToken(access_token);
    set({ access_token });
  },

  setRefreshToken: (refresh_token) => {
    tokenStore.setRefreshToken(refresh_token);
    set({ refresh_token });
  },

  setUser: (user) => {
    set({ user, isLoadingUser: false });
  },

  setIsLoadingUser: (loading) => {
    set({ isLoadingUser: loading });
  },

  setForgotPasswordOtp: (otp) => {
    set({ forgotPasswordOtp: otp });
  },

  clearForgotPasswordOtp: () => {
    set({ forgotPasswordOtp: null });
  },

  setPendingSignUp: (data) => {
    set({ pendingSignUp: data });
  },

  clearPendingSignUp: () => {
    set({ pendingSignUp: null });
  },

  clearAuth: () => {
    tokenStore.removeAccessToken();
    tokenStore.removeRefreshToken();
    set({ user: null, isLoadingUser: false, access_token: null, refresh_token: null });
  },
}));