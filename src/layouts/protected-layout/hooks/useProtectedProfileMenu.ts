"use client";

import { useClose } from "@headlessui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useLogout } from "@/src/features/auth/mutations/auth.mutation";
import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import { resolveProfileRoleLabel } from "@/src/features/auth/utils/resolveProfileRoleLabel";
import { filterProfileMenuItemsWithRoleAccess } from "@/src/features/auth/utils/shouldShowRecentlyViewedMenu";
import { useRouter } from "@/src/i18n/navigation";
import { UserRole } from "@/src/lib/auth/roles";

const PROFILE_MENU_ITEMS = [
  { labelKey: "profile", path: "/my-profile" },
  { labelKey: "myListings", path: "/listing" },
  { labelKey: "manageListings", path: "/manage-listings" },
  { labelKey: "myFavourites", path: "/favourites" },
  { labelKey: "mySavedSearches", path: "/saved-searches" },
  { labelKey: "myRecentlyViewed", path: "/recently-viewed" },
  { labelKey: "myInquiries", path: "/inquiries" },
] as const;

/** Agency and agent popover: profile link only (logout is separate). */
const AGENCY_AGENT_PROFILE_MENU_ROLE_NAMES = new Set<string>([
  UserRole.AGENCY,
  UserRole.AGENT,
  "agency",
]);

function resolveProtectedProfileMenuItems(user: LoggedInUser) {
  const roleName = user.roles?.[0]?.name;

  const baseItems =
    roleName && AGENCY_AGENT_PROFILE_MENU_ROLE_NAMES.has(roleName)
      ? PROFILE_MENU_ITEMS.filter((item) => item.labelKey === "profile")
      : PROFILE_MENU_ITEMS;

  return filterProfileMenuItemsWithRoleAccess(baseItems, user);
}

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

  const menuItems = useMemo(() => {
    const items = resolveProtectedProfileMenuItems(user);

    return items.map((item) => ({
      ...item,
      label: t(item.labelKey),
    }));
  }, [t, user]);

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
