"use client";

import { useClose } from "@headlessui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useLogout } from "@/src/features/auth/mutations/auth.mutation";
import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import { resolveProfileRoleLabel } from "@/src/features/auth/utils/resolveProfileRoleLabel";
import { useRouter } from "@/src/i18n/navigation";

const PROFILE_MENU_ITEMS = [
  { labelKey: "profile", path: "/my-profile" },
  { labelKey: "myListings", path: "/listing" },
  { labelKey: "myFavourites", path: "/favourites" },
  { labelKey: "mySavedSearches", path: "/saved-searches" },
  { labelKey: "myRecentlyViewed", path: "/recently-viewed" },
  { labelKey: "myInquiries", path: "/inquiries" },
] as const;

export function useProtectedProfileMenu(user: LoggedInUser) {
  const t = useTranslations("common");
  const tAuth = useTranslations("auth");
  const router = useRouter();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { mutate: logout, isPending: isLoggingOut, isSuccess: isLoggedOut } =
    useLogout();

  const roleLabel = useMemo(
    () => resolveProfileRoleLabel(user, tAuth),
    [user, tAuth],
  );

  const menuItems = useMemo(
    () =>
      PROFILE_MENU_ITEMS.map((item) => ({
        ...item,
        label: t(item.labelKey),
      })),
    [t],
  );

  const openLogoutConfirm = useCallback(() => {
    setShowLogoutConfirm(true);
  }, []);

  const closeLogoutConfirm = useCallback(() => {
    setShowLogoutConfirm(false);
  }, []);

  const confirmLogout = useCallback(() => {
    logout();
  }, [logout]);

  useEffect(() => {
    if (isLoggedOut) {
      setShowLogoutConfirm(false);
    }
  }, [isLoggedOut]);

  return {
    t,
    user,
    roleLabel,
    menuItems,
    showLogoutConfirm,
    isLoggingOut,
    openLogoutConfirm,
    closeLogoutConfirm,
    confirmLogout,
    router,
  };
}

export function useProtectedProfileMenuItem(
  router: ReturnType<typeof useRouter>,
) {
  const close = useClose();

  const navigate = useCallback(
    (path: string) => {
      close();
      router.push(path);
    },
    [close, router],
  );

  return { navigate };
}
