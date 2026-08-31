"use client";

import { useClose } from "@headlessui/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useLogout } from "@/src/features/auth/mutations/auth.mutation";
import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import { resolveProfileRoleLabel } from "@/src/features/auth/utils/resolveProfileRoleLabel";
import {
  filterProfileMenuItemsWithRoleAccess,
  isAgencyUser,
} from "@/src/features/auth/utils/profileMenuRoleAccess";
import { useRouter } from "@/src/i18n/navigation";
import { UserRole } from "@/src/lib/auth/roles";

const PROFILE_MENU_ITEMS = [
  { labelKey: "profile", path: "/my-profile" },
  { labelKey: "myListings", path: "/my-listings" },
  { labelKey: "manageListings", path: "/manage-listings" },
  { labelKey: "draftListings", path: "/draft-listings" },
  { labelKey: "myFavourites", path: "/favourites" },
  { labelKey: "mySavedSearches", path: "/saved-searches" },
  { labelKey: "myRecentlyViewed", path: "/recently-viewed" },
  { labelKey: "myInquiries", path: "/inquiries" },
] as const;

const AGENCY_ACCOUNT_MENU_ITEMS = [
  { labelKey: "profile", path: "/my-profile" },
  { labelKey: "mySavedSearches", path: "/saved-searches" },
] as const;

/** Agent popover: profile link only (logout is separate). */
const AGENT_PROFILE_MENU_ROLE_NAMES = new Set<string>([UserRole.AGENT]);

export type ProtectedProfileMenuLinkItem = {
  kind: "link";
  labelKey: (typeof PROFILE_MENU_ITEMS)[number]["labelKey"];
  label: string;
  path: string;
};

export type ProtectedProfileMenuAccountGroupItem = {
  labelKey: (typeof AGENCY_ACCOUNT_MENU_ITEMS)[number]["labelKey"];
  label: string;
  path: string;
};

export type ProtectedProfileMenuAccountGroup = {
  kind: "accountGroup";
  titleKey: "myAccount";
  title: string;
  items: ProtectedProfileMenuAccountGroupItem[];
};

export type ProtectedProfileMenuEntry =
  | ProtectedProfileMenuLinkItem
  | ProtectedProfileMenuAccountGroup;

function resolveProtectedProfileMenuEntries(
  user: LoggedInUser,
  t: (key: string) => string,
): ProtectedProfileMenuEntry[] {
  if (isAgencyUser(user)) {
    return [
      {
        kind: "accountGroup",
        titleKey: "myAccount",
        title: t("myAccount"),
        items: AGENCY_ACCOUNT_MENU_ITEMS.map((item) => ({
          ...item,
          label: t(item.labelKey),
        })),
      },
    ];
  }

  const roleName = user.roles?.[0]?.name;

  const baseItems =
    roleName && AGENT_PROFILE_MENU_ROLE_NAMES.has(roleName)
      ? PROFILE_MENU_ITEMS.filter((item) => item.labelKey === "profile")
      : PROFILE_MENU_ITEMS;

  return filterProfileMenuItemsWithRoleAccess(baseItems, user, "protectedPopover").map(
    (item) => ({
      kind: "link" as const,
      ...item,
      label: t(item.labelKey),
    }),
  );
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

  const menuEntries = useMemo(
    () => resolveProtectedProfileMenuEntries(user, t),
    [t, user],
  );

  const menuAriaLabel = useMemo(
    () => (isAgencyUser(user) ? t("myAccount") : t("profile")),
    [t, user],
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
    menuEntries,
    menuAriaLabel,
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
