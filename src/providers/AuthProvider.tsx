"use client";

import { useEffect, type ReactNode } from "react";
import { tokenStore } from "@/src/apis/core/token.store";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { getLoggedInUser } from "@/src/features/auth/services/auth.service";

export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const setIsLoadingUser = useAuthStore((s) => s.setIsLoadingUser);

  useEffect(() => {
    const accessToken = tokenStore.getAccessToken();

    if (accessToken && !user) {
      setIsLoadingUser(true);
      getLoggedInUser()
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          useAuthStore.getState().clearAuth();
        });
    }
  }, [user, setUser, setIsLoadingUser]);

  return <>{children}</>;
}
