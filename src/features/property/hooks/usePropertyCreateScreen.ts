"use client";

import type { BreadcrumbItem } from "@/src/components/ui/breadcrumb";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { resolveListingsMenuPath } from "@/src/features/auth/utils/profileMenuRoleAccess";
import {
  useGetLocationTaxonomy,
  useGetPropertyTaxonomy,
} from "@/src/features/landing/mutations/landing.mutation";
import {
  getLocationCities,
  type LocationTaxonomyResponse,
} from "@/src/features/landing/types/locationTaxonomy.types";
import {
  getPropertyCategories,
  type PropertyTaxonomyResponse,
} from "@/src/features/landing/types/propertyTaxonomy.types";
import { mapFeatureCatalogItems } from "@/src/features/property/mappers/propertyFeatures.mapper";
import { useGetPropertyFeatureCatalog } from "@/src/features/property/mutations/property.mutation";
import type { PropertyFeatureDefinition } from "@/src/features/property/types/property.types";
import { Home, List } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

export function usePropertyCreateScreen() {
  // 2. UI utilities
  const t = useTranslations("propertyList.propertyCreate");
  const tCommon = useTranslations("common");

  // 3. Global state
  const user = useAuthStore((state) => state.user);

  // 4. Local state
  const [propertyTaxonomy, setPropertyTaxonomy] =
    useState<PropertyTaxonomyResponse | null>(null);
  const [locationTaxonomy, setLocationTaxonomy] =
    useState<LocationTaxonomyResponse | null>(null);
  const [featureCatalog, setFeatureCatalog] = useState<PropertyFeatureDefinition[]>(
    [],
  );
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);

  // 5. Data fetching / queries
  const { mutateAsync: fetchPropertyTaxonomy } = useGetPropertyTaxonomy();
  const { mutateAsync: fetchLocationTaxonomy } = useGetLocationTaxonomy();
  const { mutateAsync: fetchFeatureCatalog } = useGetPropertyFeatureCatalog();

  // 6. Derived / memoized values
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

  const propertyCategories = useMemo(
    () => getPropertyCategories(propertyTaxonomy ?? undefined),
    [propertyTaxonomy],
  );

  const locationCities = useMemo(
    () => getLocationCities(locationTaxonomy ?? undefined),
    [locationTaxonomy],
  );

  // 7. Callbacks
  const loadCreateCatalog = useCallback(async () => {
    setIsCatalogLoading(true);

    try {
      const [propertyTaxonomyResponse, locationTaxonomyResponse, featureCatalogResponse] =
        await Promise.all([
          fetchPropertyTaxonomy(),
          fetchLocationTaxonomy(),
          fetchFeatureCatalog(),
        ]);

      setPropertyTaxonomy(propertyTaxonomyResponse);
      setLocationTaxonomy(locationTaxonomyResponse);
      setFeatureCatalog(
        mapFeatureCatalogItems(featureCatalogResponse.data?.items ?? []),
      );
    } finally {
      setIsCatalogLoading(false);
    }
  }, [fetchFeatureCatalog, fetchLocationTaxonomy, fetchPropertyTaxonomy]);

  // 9. Effects
  useEffect(() => {
    void loadCreateCatalog();
  }, [loadCreateCatalog]);

  // 10. Return values
  return {
    pageTitle: t("pageTitle"),
    pageSubtitle: t("pageSubtitle"),
    comingSoonEyebrow: t("comingSoonEyebrow"),
    comingSoonDescription: t("comingSoonDescription"),
    breadcrumbItems,
    breadcrumbAriaLabel: tCommon("breadcrumbAriaLabel"),
    propertyTaxonomy,
    locationTaxonomy,
    propertyCategories,
    locationCities,
    featureCatalog,
    isCatalogLoading,
    reloadCreateCatalog: loadCreateCatalog,
  };
}
