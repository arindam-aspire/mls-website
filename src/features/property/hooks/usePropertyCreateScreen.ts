"use client";

import type { BreadcrumbItem } from "@/src/components/ui/breadcrumb";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { resolveListingsMenuPath } from "@/src/features/auth/utils/profileMenuRoleAccess";
import { Home, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function usePropertyCreateScreen() {
  const t = useTranslations("propertyList.propertyCreate");
  const tCommon = useTranslations("common");
  const user = useAuthStore((state) => state.user);

  const breadcrumbItems = useMemo((): BreadcrumbItem[] => {
    const listingsPath = resolveListingsMenuPath(user) ?? "/my-listings";
    const listingsLabelKey =
      listingsPath === "/manage-listings" ? "manageListings" : "myListings";

    return [
      {
        id: "home",
        href: "/dashboard",
        icon: Home,
        ariaLabel: tCommon("protectedTabHome"),
      },
      {
        id: "listings",
        href: listingsPath,
        icon: List,
        label: tCommon(listingsLabelKey),
      },
      {
        id: "create",
        label: t("breadcrumbCreate"),
        isCurrent: true,
      },
    ];
  }, [t, tCommon, user]);

  return {
    pageTitle: t("pageTitle"),
    pageSubtitle: t("pageSubtitle"),
    comingSoonEyebrow: t("comingSoonEyebrow"),
    comingSoonDescription: t("comingSoonDescription"),
    breadcrumbItems,
    breadcrumbAriaLabel: tCommon("breadcrumbAriaLabel"),
  };
}
