"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useLayoutEffect, type ReactNode } from "react";
import { tokenStore } from "@/src/apis/core/token.store";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { getLoggedInUser } from "@/src/features/auth/services/auth.service";
import { getAccessTokenRoleName } from "@/src/features/auth/utils/getAccessTokenRoleName";
import { clearNotificationQueryCache } from "@/src/features/notifications/utils/clearNotificationQueryCache";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoggedInUserRole = useAuthStore((state) => state.setLoggedInUserRole);
  const setIsLoadingUser = useAuthStore((state) => state.setIsLoadingUser);

  useLayoutEffect(() => {
    const accessToken = tokenStore.getAccessToken();

    if (!accessToken) {
      setLoggedInUserRole(null);
      setIsLoadingUser(false);
      return;
    }

    setLoggedInUserRole(getAccessTokenRoleName(accessToken));

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
          clearNotificationQueryCache(queryClient);
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
  }, [queryClient, user, setUser, setLoggedInUserRole, setIsLoadingUser]);

  return <>{children}</>;
}
