"use client";

import type { ComponentProps } from "react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PropertyView } from "@abdoun/abdoun-library";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { mapFeatureCatalogItems } from "../mapper/propertyFeatures.mapper";
import {
  useGetPropertyDetails,
  useGetPropertyFeatureCatalog,
} from "../mutations/property.mutation";
import type {
  PropertyDetails,
  PropertyFeatureDefinition,
} from "../types/property.types";

type PropertyViewProps = ComponentProps<typeof PropertyView>;
type PropertyViewLocale = NonNullable<PropertyViewProps["locale"]>;

const APPLICATION_KEY = "abdoun_web" as const;
const DEFAULT_TAB = "overview";

const PROPERTY_VIEW_TAB_OPTIONS = [
  { label: "Overview", value: "overview" },
  { label: "Features", value: "features" },
  { label: "Location", value: "locations" },
  { label: "Documents", value: "documents" },
] as const;

const VALID_TAB_VALUES = new Set(
  PROPERTY_VIEW_TAB_OPTIONS.map((tab) => tab.value),
);

function toPropertyViewLocale(locale: AppLocale): PropertyViewLocale {
  if (locale === "es") {
    return "esp";
  }

  return locale;
}

function parseActiveTab(searchParams: URLSearchParams) {
  const tab = searchParams.get("tab");

  if (tab && VALID_TAB_VALUES.has(tab as (typeof PROPERTY_VIEW_TAB_OPTIONS)[number]["value"])) {
    return tab;
  }

  return DEFAULT_TAB;
}

export function usePropertyDetails(propertyId: string) {
  // 1. Router & navigation
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const appLocale = useLocale() as AppLocale;
  const locale = useMemo(() => toPropertyViewLocale(appLocale), [appLocale]);

  const activeTab = useMemo(
    () => parseActiveTab(searchParams),
    [searchParams],
  );

  // 4. Local state
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(
    null,
  );
  const [featureCatalog, setFeatureCatalog] = useState<
    PropertyFeatureDefinition[]
  >([]);
  const [isUpcomingFeatureModalOpen, setIsUpcomingFeatureModalOpen] =
    useState(false);

  // 5. Data fetching / queries
  const {
    mutate: fetchPropertyDetails,
    isPending: isLoadingDetails,
    isError,
  } = useGetPropertyDetails();

  const {
    mutate: fetchFeatureCatalog,
    isPending: isLoadingFeatures,
  } = useGetPropertyFeatureCatalog();

  const loadPropertyDetails = useCallback(() => {
    fetchPropertyDetails(propertyId, {
      onSuccess: (response) => {
        setPropertyDetails(response.data ?? null);
      },
    });
  }, [fetchPropertyDetails, propertyId]);

  const loadFeatureCatalog = useCallback(() => {
    fetchFeatureCatalog(undefined, {
      onSuccess: (response) => {
        setFeatureCatalog(
          mapFeatureCatalogItems(response.data?.items ?? []),
        );
      },
    });
  }, [fetchFeatureCatalog]);

  // 6. Derived / memoized values
  const isLoading = isLoadingDetails || isLoadingFeatures;

  const onTabChange = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (tab === DEFAULT_TAB) {
        params.delete("tab");
      } else {
        params.set("tab", tab);
      }

      const query = params.toString();

      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const tabs = useMemo(
    () => ({
      tabOptions: PROPERTY_VIEW_TAB_OPTIONS.map((tab) => ({ ...tab })),
      activeTab,
      onTabChange,
    }),
    [activeTab, onTabChange],
  );

  // 7. Callbacks
  const openUpcomingFeature = useCallback(() => {
    setIsUpcomingFeatureModalOpen(true);
  }, []);

  const closeUpcomingFeature = useCallback(() => {
    setIsUpcomingFeatureModalOpen(false);
  }, []);

  const toggleFavourite = useCallback(
    (_id: number) => {
      openUpcomingFeature();
    },
    [openUpcomingFeature],
  );

  const openAgentEmail = useCallback(
    (_id: number) => {
      openUpcomingFeature();
    },
    [openUpcomingFeature],
  );

  // 9. Effects
  useEffect(() => {
    loadFeatureCatalog();
  }, [loadFeatureCatalog]);

  useEffect(() => {
    setPropertyDetails(null);
    loadPropertyDetails();
  }, [loadPropertyDetails]);

  // 10. Return values
  return {
    isLoading,
    isError,
    propertyDetails: propertyDetails ?? undefined,
    locale,
    applicationKey: APPLICATION_KEY,
    featureCatalog,
    tabs,
    toggleFavourite,
    openAgentEmail,
    upcomingFeatureModal: {
      open: isUpcomingFeatureModalOpen,
      onClose: closeUpcomingFeature,
    },
  };
}
