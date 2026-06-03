"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { PERMISSIONS, type PermissionKey } from "./permissions";

export function useAuthorize(requiredPermission: PermissionKey) {
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);
  const router = useRouter();
  const pathname = usePathname();

  const allowedRoles = new Set<string>(PERMISSIONS[requiredPermission]);
  const userRoles = user?.roles?.map((role) => role.name) ?? [];
  const hasAllowedPermission = userRoles.some((role) => allowedRoles.has(role));

  useEffect(() => {
    if (isLoadingUser) return;

    const signInPath = "/";
    const unauthorizedPath = "/unauthorized";

    if (!user) {
      if (pathname !== signInPath) {
        router.replace(signInPath);
      }
      return;
    }

    if (!hasAllowedPermission && pathname !== unauthorizedPath) {
      router.replace(unauthorizedPath);
    }
  }, [hasAllowedPermission, isLoadingUser, pathname, router, user]);

  return { user };
}
