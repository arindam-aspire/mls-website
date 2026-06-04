"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { tokenStore } from "@/src/apis/core/token.store";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { getLoggedInUser } from "@/src/features/auth/services/auth.service";

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setIsLoadingUser = useAuthStore((state) => state.setIsLoadingUser);

  useLayoutEffect(() => {
    const accessToken = tokenStore.getAccessToken();

    if (!accessToken) {
      setIsLoadingUser(false);
      return;
    }

    if (user) {
      setIsLoadingUser(false);
      return;
    }

    setIsLoadingUser(true);

    let cancelled = false;

    getLoggedInUser()
      .then((response) => {
        if (!cancelled) {
          setUser(response.data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          useAuthStore.getState().clearAuth();
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingUser(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user, setUser, setIsLoadingUser]);

  return <>{children}</>;
}
