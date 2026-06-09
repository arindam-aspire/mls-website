"use client";

import type { ComponentProps } from "react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PropertyView } from "@abdoun/abdoun-library";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { tokenStore } from "@/src/apis/core/token.store";
import { canTrackRecentPropertyView } from "@/src/features/auth/utils/shouldShowRecentlyViewedMenu";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { hasPropertyDetailsRestrictedTabsAccess } from "@/src/lib/auth/propertyDetailsTabAccess";
import {
  PROPERTY_DETAILS_DEFAULT_TAB,
  PROPERTY_DETAILS_PUBLIC_TAB_VALUES,
  PROPERTY_DETAILS_RESTRICTED_TAB_VALUES,
  PROPERTY_DETAILS_TAB,
  type PropertyDetailsTabValue,
} from "../constants/propertyDetailsTabs.constants";
import { mapFeatureCatalogItems } from "../mappers/propertyFeatures.mapper";
import {
  useAddRecentView,
  useGetPropertyDetails,
  useGetPropertyFeatureCatalog,
  useGetSimilarProperties,
} from "../mutations/property.mutation";
import type {
  PropertyDetails,
  PropertyFeatureDefinition,
  PropertyListing,
} from "../types/property.types";
import { usePropertyFavouriteToggle } from "./usePropertyFavouriteToggle";

type PropertyViewProps = ComponentProps<typeof PropertyView>;
type PropertyViewLocale = NonNullable<PropertyViewProps["locale"]>;

const APPLICATION_KEY = "abdoun_web" as const;

const TAB_I18N_KEYS = {
  [PROPERTY_DETAILS_TAB.overview]: "tabs.overview",
  [PROPERTY_DETAILS_TAB.features]: "tabs.features",
  [PROPERTY_DETAILS_TAB.locations]: "tabs.locations",
  [PROPERTY_DETAILS_TAB.documents]: "tabs.documents",
} as const satisfies Record<PropertyDetailsTabValue, string>;

function toPropertyViewLocale(locale: AppLocale): PropertyViewLocale {
  if (locale === "es") {
    return "esp";
  }

  return locale;
}

function resolveActiveTab(
  searchParams: URLSearchParams,
  allowedTabValues: Set<string>,
) {
  const tab = searchParams.get("tab");

  if (tab && allowedTabValues.has(tab)) {
    return tab;
  }

  return PROPERTY_DETAILS_DEFAULT_TAB;
}

function resolveDetailsId(
  propertyDetails: PropertyDetails | null,
  propertyId: string,
) {
  const detailsId = (propertyDetails as { id?: number } | null)?.id;

  if (typeof detailsId === "number" && Number.isFinite(detailsId)) {
    return detailsId;
  }

  const parsedId = Number(propertyId);

  return Number.isFinite(parsedId) ? parsedId : 0;
}

export function usePropertyDetails(propertyId: string) {
  // 1. Router & navigation
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const appLocale = useLocale() as AppLocale;
  const locale = useMemo(() => toPropertyViewLocale(appLocale), [appLocale]);

  // 2. UI utilities
  const tDetails = useTranslations("propertyList.details");

  // 3. Global state (Zustand)
  const user = useAuthStore((state) => state.user);
  const loggedInUserRole = useAuthStore((state) => state.loggedInUserRole);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);

  const canViewRestrictedTabs = useMemo(
    () => hasPropertyDetailsRestrictedTabsAccess(user),
    [user],
  );

  const tabOptions = useMemo(() => {
    const values = canViewRestrictedTabs
      ? [
          ...PROPERTY_DETAILS_PUBLIC_TAB_VALUES,
          ...PROPERTY_DETAILS_RESTRICTED_TAB_VALUES,
        ]
      : [...PROPERTY_DETAILS_PUBLIC_TAB_VALUES];

    return values.map((value) => ({
      label: tDetails(TAB_I18N_KEYS[value as PropertyDetailsTabValue]),
      value,
    }));
  }, [canViewRestrictedTabs, tDetails]);

  const allowedTabValues = useMemo(
    () => new Set<string>(tabOptions.map((tab) => tab.value)),
    [tabOptions],
  );

  const activeTab = useMemo(
    () => resolveActiveTab(searchParams, allowedTabValues),
    [allowedTabValues, searchParams],
  );

  const {
    withFavouriteFlags,
    withFavouriteLoading,
    toggleFavourite: toggleListingFavourite,
    toggleFavouriteById,
    applyDetailsFavouriteState,
    isDetailsFavouriteLoading,
  } = usePropertyFavouriteToggle();

  // 4. Local state
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails | null>(
    null,
  );
  const [featureCatalog, setFeatureCatalog] = useState<
    PropertyFeatureDefinition[]
  >([]);
  const [isUpcomingFeatureModalOpen, setIsUpcomingFeatureModalOpen] =
    useState(false);
  const [isDetailsSettled, setIsDetailsSettled] = useState(false);
  const [isFeaturesSettled, setIsFeaturesSettled] = useState(false);
  const [similarListings, setSimilarListings] = useState<PropertyListing[]>([]);
  const [isSimilarSettled, setIsSimilarSettled] = useState(false);

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

  const {
    mutate: fetchSimilarProperties,
    isPending: isLoadingSimilar,
  } = useGetSimilarProperties();

  const { mutate: addRecentView } = useAddRecentView();

  const loadPropertyDetails = useCallback(() => {
    fetchPropertyDetails(propertyId, {
      onSuccess: (response) => {
        setPropertyDetails(response.data ?? null);
      },
      onSettled: () => {
        setIsDetailsSettled(true);
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
      onSettled: () => {
        setIsFeaturesSettled(true);
      },
    });
  }, [fetchFeatureCatalog]);

  const loadSimilarProperties = useCallback(() => {
    fetchSimilarProperties(propertyId, {
      onSuccess: (response) => {
        setSimilarListings(response.data?.items ?? []);
      },
      onSettled: () => {
        setIsSimilarSettled(true);
      },
    });
  }, [fetchSimilarProperties, propertyId]);

  // 6. Derived / memoized values
  const isLoading =
    !isDetailsSettled || !isFeaturesSettled || isLoadingDetails || isLoadingFeatures;

  const isSimilarLoading = !isSimilarSettled || isLoadingSimilar;

  const similarListingsWithFavourites = useMemo(
    () => withFavouriteLoading(withFavouriteFlags(similarListings)),
    [similarListings, withFavouriteFlags, withFavouriteLoading],
  );

  const propertyDetailsWithFavourites = useMemo(() => {
    if (!propertyDetails) {
      return undefined;
    }

    const detailsWithId = {
      ...propertyDetails,
      id: resolveDetailsId(propertyDetails, propertyId),
    };

    return applyDetailsFavouriteState(detailsWithId, propertyId);
  }, [applyDetailsFavouriteState, propertyDetails, propertyId]);

  const isFavouriteLoading = useMemo(() => {
    if (!propertyDetailsWithFavourites) {
      return false;
    }

    return isDetailsFavouriteLoading(
      {
        id: propertyDetailsWithFavourites.id,
        property_hash: (
          propertyDetailsWithFavourites as { property_hash?: string }
        ).property_hash,
      },
      propertyId,
    );
  }, [isDetailsFavouriteLoading, propertyDetailsWithFavourites, propertyId]);

  const onTabChange = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (tab === PROPERTY_DETAILS_DEFAULT_TAB) {
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
      tabOptions,
      activeTab,
      onTabChange,
    }),
    [activeTab, onTabChange, tabOptions],
  );

  // 7. Callbacks
  const openUpcomingFeature = useCallback(() => {
    setIsUpcomingFeatureModalOpen(true);
  }, []);

  const closeUpcomingFeature = useCallback(() => {
    setIsUpcomingFeatureModalOpen(false);
  }, []);

  const toggleFavourite = useCallback(
    (target: PropertyListing | number) => {
      if (typeof target === "number") {
        const detailsId = propertyDetailsWithFavourites?.id;

        if (detailsId === target && propertyDetailsWithFavourites) {
          toggleListingFavourite({
            id: target,
            is_favourite: Boolean(
              (propertyDetailsWithFavourites as { is_favourite?: boolean })
                .is_favourite,
            ),
            property_hash: (
              propertyDetailsWithFavourites as { property_hash?: string }
            ).property_hash,
          } as PropertyListing);
          return;
        }

        toggleFavouriteById(target, { listings: similarListingsWithFavourites });
        return;
      }

      toggleListingFavourite(target);
    },
    [
      propertyDetailsWithFavourites,
      similarListingsWithFavourites,
      toggleFavouriteById,
      toggleListingFavourite,
    ],
  );

  const openAgentEmail = useCallback(
    (_id: number) => {
      openUpcomingFeature();
    },
    [openUpcomingFeature],
  );

  // 8. Refs
  const lastRecordedRecentViewIdRef = useRef<string | null>(null);

  // 9. Effects
  useEffect(() => {
    lastRecordedRecentViewIdRef.current = null;
  }, [propertyId]);

  useEffect(() => {
    if (!isDetailsSettled || !propertyDetails) {
      return;
    }

    if (!tokenStore.getAccessToken()) {
      return;
    }

    if (isLoadingUser && !loggedInUserRole && !user?.roles?.[0]?.name) {
      return;
    }

    if (!canTrackRecentPropertyView(user, loggedInUserRole)) {
      return;
    }

    if (lastRecordedRecentViewIdRef.current === propertyId) {
      return;
    }

    const propertyHash = Number(propertyId);

    if (!Number.isFinite(propertyHash) || propertyHash <= 0) {
      return;
    }

    lastRecordedRecentViewIdRef.current = propertyId;
    addRecentView({ property_hash: propertyHash });
  }, [
    addRecentView,
    isDetailsSettled,
    isLoadingUser,
    loggedInUserRole,
    propertyDetails,
    propertyId,
    user,
  ]);

  useEffect(() => {
    setIsFeaturesSettled(false);
    loadFeatureCatalog();
  }, [loadFeatureCatalog]);

  useEffect(() => {
    setPropertyDetails(null);
    setIsDetailsSettled(false);
    loadPropertyDetails();
  }, [loadPropertyDetails]);

  useEffect(() => {
    setSimilarListings([]);
    setIsSimilarSettled(false);
    loadSimilarProperties();
  }, [loadSimilarProperties]);

  useEffect(() => {
    const tab = searchParams.get("tab");

    if (!tab || allowedTabValues.has(tab)) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("tab");

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [allowedTabValues, pathname, router, searchParams]);

  // 10. Return values
  return {
    isLoading,
    isError,
    propertyDetails: propertyDetailsWithFavourites,
    isFavouriteLoading,
    locale,
    applicationKey: APPLICATION_KEY,
    featureCatalog,
    tabs,
    toggleFavourite,
    openAgentEmail,
    similarListings: similarListingsWithFavourites,
    isSimilarLoading,
    upcomingFeatureModal: {
      open: isUpcomingFeatureModalOpen,
      onClose: closeUpcomingFeature,
    },
  };
}
