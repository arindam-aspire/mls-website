import { create } from "zustand";
import { tokenStore } from "@/src/apis/core/token.store";
import { LoggedInUser } from "../types/auth.types";

interface AuthState {
  user: LoggedInUser | null;
  isLoadingUser: boolean;
  access_token: string | null;
  refresh_token: string | null;
  setAuth: (access_token: string, refresh_token: string) => void;
  setAccessToken: (access_token: string) => void;
  setRefreshToken: (refresh_token: string) => void;
  setUser: (user: LoggedInUser) => void;
  setIsLoadingUser: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoadingUser: false,
  access_token: null,
  refresh_token: null,

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

  clearAuth: () => {
    tokenStore.removeAccessToken();
    tokenStore.removeRefreshToken();
    set({ user: null, isLoadingUser: false, access_token: null, refresh_token: null });
  },
}));