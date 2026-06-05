"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { getPathname, usePathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import {
  useGetLocationTaxonomy,
  useGetPropertyTaxonomy,
} from "@/src/features/landing/mutations/landing.mutation";
import { getPropertyCategories } from "@/src/features/landing/types/propertyTaxonomy.types";
import {
  buildLocationSuggestions,
  encodeLocationOptionValue,
  filterLocationSuggestions,
  findLocationSuggestionByLabel,
  getLocationLabelFromParams,
  parseLocationOptionValue,
} from "@/src/features/landing/utils/locationTaxonomy.utils";
import type { AutocompleteInputOption } from "@/src/components/ui";
import {
  getInitialBudgetMax,
  getInitialBudgetMin,
} from "@/src/components/search";
import { SELECT_DROPDOWN_EMPTY_VALUE } from "@/src/components/ui";
import { tokenStore } from "@/src/apis/core/token.store";
import { AUTH_VIEW } from "@/src/features/auth/authViews";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import type {
  SavedSearchCriteria,
  SaveSearchFilterItem,
} from "@/src/features/saved-searches/types/savedSearch.types";
import { useGetPropertyList } from "../mutations/property.mutation";
import { useGetSavedSearch } from "@/src/features/saved-searches/mutations/saved-search.mutation";
import { getSavedSearchById } from "@/src/features/saved-searches/services/saved-search.service";
import { buildSavedSearchPropertyListSearchParams } from "@/src/features/saved-searches/utils/buildSavedSearchPropertyListHref";
import { usePropertyStore } from "../store/property.store";
import type { PropertyListParams, PropertyListing } from "../types/property.types";
import {
  hasAdvancedFilters,
  normalizeAmenitiesParam,
  parseAmenitiesParam,
  serializeAmenitiesParam,
} from "../components/propertyListAdvancedFilters.constants";
import { pruneAdvancedParamsForContext } from "../utils/propertyAdvancedFieldVisibility";

const DEFAULT_SORT = "newest";

const DEFAULT_SEARCH_PARAMS: PropertyListParams = {
  page: 1,
  pageSize: 10,
  category: "residential",
  status: "buy",
  sort: DEFAULT_SORT,
};

const LIST_PARAM_KEYS = [
  "page",
  "pageSize",
  "category",
  "status",
  "sort",
  "type",
  "location",
  "city",
  "locations",
  "budgetMin",
  "budgetMax",
  "furnitureStatus",
  "bedrooms",
  "rooms",
  "bathrooms",
  "parking",
  "propertyAge",
  "floorLevel",
  "minArea",
  "maxArea",
  "minPlotArea",
  "maxPlotArea",
  "governorate",
  "directorate",
  "village",
  "parcelName",
  "amenities",
  "similar_to",
  "savedSearchId",
] as const satisfies readonly (keyof PropertyListParams)[];

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: low to high", value: "price_asc" },
  { label: "Price: high to low", value: "price_desc" },
] as const;

const PAGE_SIZE_OPTIONS = [10, 15, 20] as const;

const STATUS_OPTIONS = [
  { value: "buy", label: "Buy" },
  { value: "rent", label: "Rent" },
] as const;

function getListTitle(status: string) {
  if (status === "rent") {
    return "Properties for rent";
  }

  return "Properties for sale";
}

function getOptionalString(value: string | null) {
  return value || undefined;
}

function parseOptionalNumber(value: string | null) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseUrlListParams(searchParams: URLSearchParams): PropertyListParams {
  return {
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 10,
    category: searchParams.get("category") || "",
    status: searchParams.get("status") || "",
    sort: searchParams.get("sort") || DEFAULT_SORT,
    type: getOptionalString(searchParams.get("type")),
    location: getOptionalString(searchParams.get("location")),
    city: getOptionalString(searchParams.get("city")),
    locations: getOptionalString(searchParams.get("locations")),
    budgetMin: parseOptionalNumber(getInitialBudgetMin(searchParams) || null),
    budgetMax: parseOptionalNumber(getInitialBudgetMax(searchParams) || null),
    furnitureStatus: getOptionalString(searchParams.get("furnitureStatus")),
    bedrooms: parseOptionalNumber(searchParams.get("bedrooms")),
    rooms: parseOptionalNumber(searchParams.get("rooms")),
    bathrooms: parseOptionalNumber(searchParams.get("bathrooms")),
    parking: parseOptionalNumber(searchParams.get("parking")),
    propertyAge: getOptionalString(searchParams.get("propertyAge")),
    floorLevel: getOptionalString(searchParams.get("floorLevel")),
    minArea: parseOptionalNumber(searchParams.get("minArea")),
    maxArea: parseOptionalNumber(searchParams.get("maxArea")),
    minPlotArea: parseOptionalNumber(searchParams.get("minPlotArea")),
    maxPlotArea: parseOptionalNumber(searchParams.get("maxPlotArea")),
    governorate: getOptionalString(searchParams.get("governorate")),
    directorate: getOptionalString(searchParams.get("directorate")),
    village: getOptionalString(searchParams.get("village")),
    parcelName: getOptionalString(searchParams.get("parcelName")),
    amenities: normalizeAmenitiesParam(getOptionalString(searchParams.get("amenities"))),
    similar_to: getOptionalString(searchParams.get("similar_to")),
    savedSearchId: getOptionalString(searchParams.get("savedSearchId")),
  };
}

function setSearchParamValue(
  params: URLSearchParams,
  key: (typeof LIST_PARAM_KEYS)[number],
  value: PropertyListParams[(typeof LIST_PARAM_KEYS)[number]],
) {
  if (value === undefined || value === "") {
    params.delete(key);
    return;
  }

  params.set(key, String(value));
}

export function usePropertyList() {
  // 1. Router & navigation
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale() as AppLocale;

  const listParams = useMemo(
    () => parseUrlListParams(searchParams),
    [searchParams],
  );

  // 3. Global state (Zustand)
  const {
    propertyListings,
    setPropertyListings,
    setPropertyListParams,
    propertyTaxonomy,
    locationTaxonomy,
  } = usePropertyStore();

  // 4. Local state
  const [layoutVariant, setLayoutVariant] = useState<"grid" | "list">("grid");
  const [locationDraft, setLocationDraft] = useState(() =>
    getLocationLabelFromParams(
      listParams.city,
      listParams.locations,
      locationTaxonomy ?? undefined,
    ) || listParams.location || "",
  );
  const [selectedLocationValue, setSelectedLocationValue] = useState(() =>
    listParams.city
      ? encodeLocationOptionValue(listParams.city, listParams.locations)
      : "",
  );
  const [budgetMinDraft, setBudgetMinDraft] = useState(
    () =>
      listParams.budgetMin != null ? String(listParams.budgetMin) : "",
  );
  const [budgetMaxDraft, setBudgetMaxDraft] = useState(
    () =>
      listParams.budgetMax != null ? String(listParams.budgetMax) : "",
  );
  const [minAreaDraft, setMinAreaDraft] = useState(
    () => (listParams.minArea != null ? String(listParams.minArea) : ""),
  );
  const [maxAreaDraft, setMaxAreaDraft] = useState(
    () => (listParams.maxArea != null ? String(listParams.maxArea) : ""),
  );
  const [minPlotAreaDraft, setMinPlotAreaDraft] = useState(
    () =>
      listParams.minPlotArea != null ? String(listParams.minPlotArea) : "",
  );
  const [maxPlotAreaDraft, setMaxPlotAreaDraft] = useState(
    () =>
      listParams.maxPlotArea != null ? String(listParams.maxPlotArea) : "",
  );
  const [governorateDraft, setGovernorateDraft] = useState(
    () => listParams.governorate ?? "",
  );
  const [directorateDraft, setDirectorateDraft] = useState(
    () => listParams.directorate ?? "",
  );
  const [villageDraft, setVillageDraft] = useState(
    () => listParams.village ?? "",
  );
  const [parcelNameDraft, setParcelNameDraft] = useState(
    () => listParams.parcelName ?? "",
  );

  useEffect(() => {
    setBudgetMinDraft(
      listParams.budgetMin != null ? String(listParams.budgetMin) : "",
    );
    setBudgetMaxDraft(
      listParams.budgetMax != null ? String(listParams.budgetMax) : "",
    );
  }, [listParams.budgetMax, listParams.budgetMin]);

  useEffect(() => {
    setMinAreaDraft(
      listParams.minArea != null ? String(listParams.minArea) : "",
    );
    setMaxAreaDraft(
      listParams.maxArea != null ? String(listParams.maxArea) : "",
    );
  }, [listParams.maxArea, listParams.minArea]);

  useEffect(() => {
    setMinPlotAreaDraft(
      listParams.minPlotArea != null ? String(listParams.minPlotArea) : "",
    );
    setMaxPlotAreaDraft(
      listParams.maxPlotArea != null ? String(listParams.maxPlotArea) : "",
    );
  }, [listParams.maxPlotArea, listParams.minPlotArea]);

  useEffect(() => {
    setGovernorateDraft(listParams.governorate ?? "");
    setDirectorateDraft(listParams.directorate ?? "");
    setVillageDraft(listParams.village ?? "");
    setParcelNameDraft(listParams.parcelName ?? "");
  }, [
    listParams.directorate,
    listParams.governorate,
    listParams.parcelName,
    listParams.village,
  ]);

  // 5. Data fetching / queries
  const {
    mutate: getPropertyList,
    isPending: isLoadingPropertyList,
  } = useGetPropertyList();

  const { mutate: getPropertyTaxonomy, isPending: isLoadingTaxonomy } =
    useGetPropertyTaxonomy();

  const { mutate: getLocationTaxonomy } = useGetLocationTaxonomy();

  const { data: savedSearchDetail } = useGetSavedSearch(listParams.savedSearchId, {
    enabled: Boolean(listParams.savedSearchId),
  });

  const locationSuggestions = useMemo(
    () => buildLocationSuggestions(locationTaxonomy ?? undefined),
    [locationTaxonomy],
  );

  const locationOptions = useMemo((): AutocompleteInputOption[] => {
    return filterLocationSuggestions(locationSuggestions, locationDraft).map(
      (item) => ({
        value: item.value,
        label: item.label,
      }),
    );
  }, [locationDraft, locationSuggestions]);

  const fetchProperties = useCallback(
    (params: PropertyListParams) => {
      setPropertyListParams(params);
      getPropertyList(params, {
        onSuccess: (response) => {
          setPropertyListings({
            items: response.data?.items ?? [],
            meta: response.meta?.pagination,
          });
        },
      });
    },
    [getPropertyList, setPropertyListParams, setPropertyListings],
  );

  const updateSearchParams = useCallback(
    (partial: Partial<PropertyListParams>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const key of LIST_PARAM_KEYS) {
        const value = partial[key];

        if (value === undefined) {
          continue;
        }

        setSearchParamValue(params, key, value);
      }

      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  // 6. Derived / memoized values
  const listings = useMemo(
    () => propertyListings?.items ?? [],
    [propertyListings?.items],
  );

  const paginationMeta = propertyListings?.meta;

  const listTitle = useMemo(
    () => getListTitle(listParams.status),
    [listParams.status],
  );

  const onSortChange = useCallback(
    (sort: string) => {
      updateSearchParams({ sort, page: 1 });
    },
    [updateSearchParams],
  );

  const categories = useMemo(
    () => getPropertyCategories(propertyTaxonomy ?? undefined),
    [propertyTaxonomy],
  );

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.slug,
        label: category.name,
      })),
    [categories],
  );

  const activeCategorySlug = useMemo(() => {
    if (categories.some((category) => category.slug === listParams.category)) {
      return listParams.category;
    }

    return categories[0]?.slug ?? "";
  }, [categories, listParams.category]);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.slug === activeCategorySlug),
    [activeCategorySlug, categories],
  );

  const typeOptions = useMemo(
    () =>
      selectedCategory?.property_types.map((propertyType) => ({
        value: propertyType.slug,
        label: propertyType.name,
      })) ?? [],
    [selectedCategory],
  );

  const activeTypeValue = useMemo(() => {
    if (!listParams.type) {
      return SELECT_DROPDOWN_EMPTY_VALUE;
    }

    if (typeOptions.some((option) => option.value === listParams.type)) {
      return listParams.type;
    }

    return SELECT_DROPDOWN_EMPTY_VALUE;
  }, [listParams.type, typeOptions]);

  const onStatusChange = useCallback(
    (status: string) => {
      updateSearchParams({
        status,
        budgetMin: "" as unknown as number,
        budgetMax: "" as unknown as number,
        page: 1,
      });
    },
    [updateSearchParams],
  );

  const onCategoryChange = useCallback(
    (category: string) => {
      updateSearchParams({
        category,
        type: "",
        page: 1,
        ...pruneAdvancedParamsForContext(listParams, category, undefined),
      });
    },
    [listParams, updateSearchParams],
  );

  const onTypeChange = useCallback(
    (type: string) => {
      const nextType = type === SELECT_DROPDOWN_EMPTY_VALUE ? "" : type;

      updateSearchParams({
        type: nextType,
        page: 1,
        ...pruneAdvancedParamsForContext(
          listParams,
          activeCategorySlug,
          nextType,
        ),
      });
    },
    [activeCategorySlug, listParams, updateSearchParams],
  );

  const onLocationInputChange = useCallback((nextValue: string) => {
    setLocationDraft(nextValue);
    setSelectedLocationValue("");
  }, []);

  const onLocationOptionSelect = useCallback(
    (option: AutocompleteInputOption) => {
      const { city, locations } = parseLocationOptionValue(option.value);
      setLocationDraft(option.label);
      setSelectedLocationValue(option.value);
      updateSearchParams({
        city,
        locations: locations ?? "",
        location: "",
        page: 1,
      });
    },
    [updateSearchParams],
  );

  const onLocationCommit = useCallback(() => {
    const trimmedLocation = locationDraft.trim();

    if (!trimmedLocation) {
      if (!listParams.city && !listParams.locations && !listParams.location) {
        return;
      }

      updateSearchParams({
        city: "",
        locations: "",
        location: "",
        page: 1,
      });
      setSelectedLocationValue("");
      return;
    }

    const matched = findLocationSuggestionByLabel(
      locationSuggestions,
      trimmedLocation,
    );

    if (matched) {
      const { city, locations } = parseLocationOptionValue(matched.value);
      setSelectedLocationValue(matched.value);
      updateSearchParams({
        city,
        locations: locations ?? "",
        location: "",
        page: 1,
      });
      return;
    }

    if ((listParams.location ?? "") === trimmedLocation) {
      return;
    }

    updateSearchParams({
      location: trimmedLocation,
      city: "",
      locations: "",
      page: 1,
    });
    setSelectedLocationValue("");
  }, [
    listParams.locations,
    listParams.city,
    listParams.location,
    locationDraft,
    locationSuggestions,
    updateSearchParams,
  ]);

  const onBudgetCommit = useCallback(() => {
    updateSearchParams({
      budgetMin: budgetMinDraft
        ? Number(budgetMinDraft)
        : ("" as unknown as number),
      budgetMax: budgetMaxDraft
        ? Number(budgetMaxDraft)
        : ("" as unknown as number),
      page: 1,
    });
  }, [budgetMaxDraft, budgetMinDraft, updateSearchParams]);

  const onBudgetReset = useCallback(() => {
    setBudgetMinDraft("");
    setBudgetMaxDraft("");
    updateSearchParams({
      budgetMin: "" as unknown as number,
      budgetMax: "" as unknown as number,
      page: 1,
    });
  }, [updateSearchParams]);

  const onBedroomsChange = useCallback(
    (value: string) => {
      updateSearchParams({
        bedrooms:
          value === SELECT_DROPDOWN_EMPTY_VALUE
            ? ("" as unknown as number)
            : Number(value),
        page: 1,
      });
    },
    [updateSearchParams],
  );

  const onRoomsChange = useCallback(
    (value: string) => {
      updateSearchParams({
        rooms:
          value === SELECT_DROPDOWN_EMPTY_VALUE
            ? ("" as unknown as number)
            : Number(value),
        page: 1,
      });
    },
    [updateSearchParams],
  );

  const onBathroomsChange = useCallback(
    (value: string) => {
      updateSearchParams({
        bathrooms:
          value === SELECT_DROPDOWN_EMPTY_VALUE
            ? ("" as unknown as number)
            : Number(value),
        page: 1,
      });
    },
    [updateSearchParams],
  );

  const onParkingChange = useCallback(
    (value: string) => {
      updateSearchParams({
        parking:
          value === SELECT_DROPDOWN_EMPTY_VALUE
            ? ("" as unknown as number)
            : Number(value),
        page: 1,
      });
    },
    [updateSearchParams],
  );

  const onPropertyAgeChange = useCallback(
    (value: string) => {
      updateSearchParams({
        propertyAge:
          value === SELECT_DROPDOWN_EMPTY_VALUE ? "" : value,
        page: 1,
      });
    },
    [updateSearchParams],
  );

  const onFloorLevelChange = useCallback(
    (value: string) => {
      updateSearchParams({
        floorLevel: value === SELECT_DROPDOWN_EMPTY_VALUE ? "" : value,
        page: 1,
      });
    },
    [updateSearchParams],
  );

  const onFurnitureStatusChange = useCallback(
    (value: string) => {
      updateSearchParams({
        furnitureStatus: value === SELECT_DROPDOWN_EMPTY_VALUE ? "" : value,
        page: 1,
      });
    },
    [updateSearchParams],
  );

  const onMinAreaChange = useCallback((value: string) => {
    setMinAreaDraft(value.replace(/\D/g, ""));
  }, []);

  const onMaxAreaChange = useCallback((value: string) => {
    setMaxAreaDraft(value.replace(/\D/g, ""));
  }, []);

  const onMinAreaCommit = useCallback(() => {
    const nextValue = minAreaDraft ? Number(minAreaDraft) : undefined;
    const currentValue = listParams.minArea;

    if (nextValue === currentValue || (nextValue == null && currentValue == null)) {
      return;
    }

    updateSearchParams({
      minArea: nextValue ?? ("" as unknown as number),
      page: 1,
    });
  }, [listParams.minArea, minAreaDraft, updateSearchParams]);

  const onMaxAreaCommit = useCallback(() => {
    const nextValue = maxAreaDraft ? Number(maxAreaDraft) : undefined;
    const currentValue = listParams.maxArea;

    if (nextValue === currentValue || (nextValue == null && currentValue == null)) {
      return;
    }

    updateSearchParams({
      maxArea: nextValue ?? ("" as unknown as number),
      page: 1,
    });
  }, [listParams.maxArea, maxAreaDraft, updateSearchParams]);

  const onMinPlotAreaChange = useCallback((value: string) => {
    setMinPlotAreaDraft(value.replace(/\D/g, ""));
  }, []);

  const onMaxPlotAreaChange = useCallback((value: string) => {
    setMaxPlotAreaDraft(value.replace(/\D/g, ""));
  }, []);

  const onMinPlotAreaCommit = useCallback(() => {
    const nextValue = minPlotAreaDraft ? Number(minPlotAreaDraft) : undefined;
    const currentValue = listParams.minPlotArea;

    if (nextValue === currentValue || (nextValue == null && currentValue == null)) {
      return;
    }

    updateSearchParams({
      minPlotArea: nextValue ?? ("" as unknown as number),
      page: 1,
    });
  }, [listParams.minPlotArea, minPlotAreaDraft, updateSearchParams]);

  const onMaxPlotAreaCommit = useCallback(() => {
    const nextValue = maxPlotAreaDraft ? Number(maxPlotAreaDraft) : undefined;
    const currentValue = listParams.maxPlotArea;

    if (nextValue === currentValue || (nextValue == null && currentValue == null)) {
      return;
    }

    updateSearchParams({
      maxPlotArea: nextValue ?? ("" as unknown as number),
      page: 1,
    });
  }, [listParams.maxPlotArea, maxPlotAreaDraft, updateSearchParams]);

  const onGovernorateChange = useCallback((value: string) => {
    setGovernorateDraft(value);
  }, []);

  const onDirectorateChange = useCallback((value: string) => {
    setDirectorateDraft(value);
  }, []);

  const onVillageChange = useCallback((value: string) => {
    setVillageDraft(value);
  }, []);

  const onParcelNameChange = useCallback((value: string) => {
    setParcelNameDraft(value);
  }, []);

  const onGovernorateCommit = useCallback(() => {
    const nextValue = governorateDraft.trim();
    const currentValue = listParams.governorate ?? "";

    if (nextValue === currentValue) {
      return;
    }

    updateSearchParams({
      governorate: nextValue,
      page: 1,
    });
  }, [governorateDraft, listParams.governorate, updateSearchParams]);

  const onDirectorateCommit = useCallback(() => {
    const nextValue = directorateDraft.trim();
    const currentValue = listParams.directorate ?? "";

    if (nextValue === currentValue) {
      return;
    }

    updateSearchParams({
      directorate: nextValue,
      page: 1,
    });
  }, [directorateDraft, listParams.directorate, updateSearchParams]);

  const onVillageCommit = useCallback(() => {
    const nextValue = villageDraft.trim();
    const currentValue = listParams.village ?? "";

    if (nextValue === currentValue) {
      return;
    }

    updateSearchParams({
      village: nextValue,
      page: 1,
    });
  }, [listParams.village, updateSearchParams, villageDraft]);

  const onParcelNameCommit = useCallback(() => {
    const nextValue = parcelNameDraft.trim();
    const currentValue = listParams.parcelName ?? "";

    if (nextValue === currentValue) {
      return;
    }

    updateSearchParams({
      parcelName: nextValue,
      page: 1,
    });
  }, [listParams.parcelName, parcelNameDraft, updateSearchParams]);

  const onAmenityChange = useCallback(
    (slug: string, checked: boolean) => {
      const nextAmenities = parseAmenitiesParam(listParams.amenities);

      if (checked) {
        nextAmenities.add(slug);
      } else {
        nextAmenities.delete(slug);
      }

      updateSearchParams({
        amenities:
          serializeAmenitiesParam(nextAmenities) ??
          ("" as unknown as string),
        page: 1,
      });
    },
    [listParams.amenities, updateSearchParams],
  );

  const onResetSearch = useCallback(() => {
    const resetToDefaultSearch = () => {
      const params = new URLSearchParams();

      params.set("status", DEFAULT_SEARCH_PARAMS.status);
      params.set("category", DEFAULT_SEARCH_PARAMS.category);
      params.set("sort", DEFAULT_SEARCH_PARAMS.sort ?? DEFAULT_SORT);
      params.set("page", String(DEFAULT_SEARCH_PARAMS.page));
      params.set("pageSize", String(DEFAULT_SEARCH_PARAMS.pageSize));

      if (listParams.similar_to) {
        params.set("similar_to", listParams.similar_to);
      }

      router.replace(`${pathname}?${params.toString()}`);
    };

    if (!listParams.savedSearchId) {
      resetToDefaultSearch();
      return;
    }

    void (async () => {
      try {
        const response = await getSavedSearchById(listParams.savedSearchId!);
        const record = response.data;

        if (!record) {
          resetToDefaultSearch();
          return;
        }

        const params = new URLSearchParams(
          buildSavedSearchPropertyListSearchParams(record),
        );

        if (listParams.similar_to) {
          params.set("similar_to", listParams.similar_to);
        }

        router.replace(`${pathname}?${params.toString()}`);
      } catch {
        resetToDefaultSearch();
      }
    })();
  }, [listParams.savedSearchId, listParams.similar_to, pathname, router]);

  const [isUpcomingFeatureModalOpen, setIsUpcomingFeatureModalOpen] =
    useState(false);
  const [isSaveSearchModalOpen, setIsSaveSearchModalOpen] = useState(false);
  const [saveSearchFilterItems, setSaveSearchFilterItems] = useState<
    SaveSearchFilterItem[]
  >([]);
  const [saveSearchCriteria, setSaveSearchCriteria] = useState<SavedSearchCriteria>(
    {},
  );
  const [saveSearchModalSavedSearchId, setSaveSearchModalSavedSearchId] = useState<
    string | undefined
  >();

  const openUpcomingFeature = useCallback(() => {
    setIsUpcomingFeatureModalOpen(true);
  }, []);

  const closeUpcomingFeature = useCallback(() => {
    setIsUpcomingFeatureModalOpen(false);
  }, []);

  const openSaveSearchModal = useCallback(() => {
    setIsSaveSearchModalOpen(true);
  }, []);

  const closeSaveSearchModal = useCallback(() => {
    setIsSaveSearchModalOpen(false);
    setSaveSearchModalSavedSearchId(undefined);
  }, []);

  const onSaveSearch = useCallback(
    (payload: {
      filterItems: SaveSearchFilterItem[];
      searchCriteria: SavedSearchCriteria;
    }) => {
      setIsUpcomingFeatureModalOpen(false);

      const { user: currentUser, isLoadingUser } = useAuthStore.getState();
      const hasAccessToken = Boolean(tokenStore.getAccessToken());
      const isAuthenticated =
        Boolean(currentUser) || (hasAccessToken && isLoadingUser);

      if (!isAuthenticated) {
        useAuthStore.getState().openAuth(AUTH_VIEW.chooseAccount);
        return;
      }

      setSaveSearchFilterItems(payload.filterItems);
      setSaveSearchCriteria(payload.searchCriteria);
      setSaveSearchModalSavedSearchId(listParams.savedSearchId);
      openSaveSearchModal();
    },
    [listParams.savedSearchId, openSaveSearchModal],
  );

  const activeParkingValue = useMemo(() => {
    if (listParams.parking == null) {
      return SELECT_DROPDOWN_EMPTY_VALUE;
    }

    return String(listParams.parking);
  }, [listParams.parking]);

  const activeBedroomsValue = useMemo(() => {
    if (listParams.bedrooms == null) {
      return SELECT_DROPDOWN_EMPTY_VALUE;
    }

    return String(listParams.bedrooms);
  }, [listParams.bedrooms]);

  const activeRoomsValue = useMemo(() => {
    if (listParams.rooms == null) {
      return SELECT_DROPDOWN_EMPTY_VALUE;
    }

    return String(listParams.rooms);
  }, [listParams.rooms]);

  const activeBathroomsValue = useMemo(() => {
    if (listParams.bathrooms == null) {
      return SELECT_DROPDOWN_EMPTY_VALUE;
    }

    return String(listParams.bathrooms);
  }, [listParams.bathrooms]);

  const activePropertyAgeValue = useMemo(() => {
    if (!listParams.propertyAge) {
      return SELECT_DROPDOWN_EMPTY_VALUE;
    }

    return listParams.propertyAge;
  }, [listParams.propertyAge]);

  const activeFloorLevelValue = useMemo(() => {
    if (!listParams.floorLevel) {
      return SELECT_DROPDOWN_EMPTY_VALUE;
    }

    return listParams.floorLevel;
  }, [listParams.floorLevel]);

  const activeFurnitureStatusValue = useMemo(() => {
    if (!listParams.furnitureStatus) {
      return SELECT_DROPDOWN_EMPTY_VALUE;
    }

    return listParams.furnitureStatus;
  }, [listParams.furnitureStatus]);

  const selectedAmenities = useMemo(
    () => [...parseAmenitiesParam(listParams.amenities)],
    [listParams.amenities],
  );

  const filters = useMemo(
    () => ({
      status: listParams.status || STATUS_OPTIONS[0].value,
      statusOptions: STATUS_OPTIONS.map((option) => ({ ...option })),
      onStatusChange,
      category: activeCategorySlug,
      categoryOptions,
      onCategoryChange,
      type: activeTypeValue,
      typeOptions,
      onTypeChange,
      location: locationDraft,
      locationValue: selectedLocationValue,
      locationOptions,
      onLocationInputChange,
      onLocationOptionSelect,
      onLocationCommit,
      budgetMin: budgetMinDraft,
      budgetMax: budgetMaxDraft,
      onBudgetMinChange: setBudgetMinDraft,
      onBudgetMaxChange: setBudgetMaxDraft,
      onBudgetCommit,
      onBudgetReset,
      rentMode: listParams.status === "rent",
      bedrooms: activeBedroomsValue,
      rooms: activeRoomsValue,
      bathrooms: activeBathroomsValue,
      parking: activeParkingValue,
      propertyAge: activePropertyAgeValue,
      floorLevel: activeFloorLevelValue,
      furnitureStatus: activeFurnitureStatusValue,
      minArea: minAreaDraft,
      maxArea: maxAreaDraft,
      minPlotArea: minPlotAreaDraft,
      maxPlotArea: maxPlotAreaDraft,
      governorate: governorateDraft,
      directorate: directorateDraft,
      village: villageDraft,
      parcelName: parcelNameDraft,
      selectedAmenities,
      onBedroomsChange,
      onRoomsChange,
      onBathroomsChange,
      onParkingChange,
      onPropertyAgeChange,
      onFloorLevelChange,
      onFurnitureStatusChange,
      onMinAreaChange,
      onMaxAreaChange,
      onMinPlotAreaChange,
      onMaxPlotAreaChange,
      onGovernorateChange,
      onDirectorateChange,
      onVillageChange,
      onParcelNameChange,
      onMinAreaCommit,
      onMaxAreaCommit,
      onMinPlotAreaCommit,
      onMaxPlotAreaCommit,
      onGovernorateCommit,
      onDirectorateCommit,
      onVillageCommit,
      onParcelNameCommit,
      onAmenityChange,
      hasAdvancedFilters: hasAdvancedFilters(listParams),
      onResetSearch,
      onSaveSearch,
      savedSearchId: listParams.savedSearchId,
      disabled: isLoadingTaxonomy && propertyTaxonomy == null,
    }),
    [
      activeBedroomsValue,
      activeBathroomsValue,
      activeCategorySlug,
      activeFloorLevelValue,
      activeFurnitureStatusValue,
      activeParkingValue,
      activePropertyAgeValue,
      activeRoomsValue,
      activeTypeValue,
      budgetMaxDraft,
      budgetMinDraft,
      categoryOptions,
      directorateDraft,
      governorateDraft,
      isLoadingTaxonomy,
      listParams,
      locationDraft,
      locationOptions,
      maxAreaDraft,
      maxPlotAreaDraft,
      minAreaDraft,
      minPlotAreaDraft,
      onAmenityChange,
      onBathroomsChange,
      onBedroomsChange,
      onBudgetCommit,
      onBudgetReset,
      onCategoryChange,
      onDirectorateChange,
      onDirectorateCommit,
      onFloorLevelChange,
      onFurnitureStatusChange,
      onGovernorateChange,
      onGovernorateCommit,
      onLocationCommit,
      onLocationInputChange,
      onLocationOptionSelect,
      onMaxAreaChange,
      onMaxAreaCommit,
      onMaxPlotAreaChange,
      onMaxPlotAreaCommit,
      onMinAreaChange,
      onMinAreaCommit,
      onMinPlotAreaChange,
      onMinPlotAreaCommit,
      onParcelNameChange,
      onParcelNameCommit,
      onParkingChange,
      onPropertyAgeChange,
      onRoomsChange,
      onVillageChange,
      onVillageCommit,
      parcelNameDraft,
      villageDraft,
      onResetSearch,
      onSaveSearch,
      onStatusChange,
      onTypeChange,
      propertyTaxonomy,
      selectedAmenities,
      selectedLocationValue,
      typeOptions,
    ],
  );

  const toolbar = useMemo(
    () => ({
      listingsLabel: "Properties",
      sortOptions: SORT_OPTIONS.map((option) => ({ ...option })),
      sortValue: listParams.sort ?? DEFAULT_SORT,
      onSortChange,
      onViewChange: setLayoutVariant,
    }),
    [onSortChange, listParams.sort],
  );

  const pagination = useMemo(
    () => ({
      total: paginationMeta?.total ?? 0,
      page: listParams.page,
      pageSize: listParams.pageSize,
      pageOptions: [...PAGE_SIZE_OPTIONS],
      totalPages: paginationMeta?.totalPages,
      hasNext: paginationMeta?.hasNext,
      hasPrevious: paginationMeta?.hasPrevious,
      maxPageButtons: 5,
      onPageChange: (page: number) => updateSearchParams({ page }),
      onPageSizeChange: (pageSize: number) =>
        updateSearchParams({ page: 1, pageSize }),
    }),
    [
      paginationMeta?.hasNext,
      paginationMeta?.hasPrevious,
      paginationMeta?.total,
      paginationMeta?.totalPages,
      listParams.page,
      listParams.pageSize,
      updateSearchParams,
    ],
  );

  const noDataFound = useMemo(
    () => ({
      title: "No properties found",
      description: "Try adjusting your filters.",
    }),
    [],
  );

  // 7. Callbacks
  const onClickProperty = useCallback(
    (item: PropertyListing) => {
      const url = getPathname({
        locale,
        href: `/propert-details/${item.id}`,
      });

      window.open(url, "_blank", "noopener,noreferrer");
    },
    [locale],
  );

  const toggleFavourite = useCallback(() => {
    openUpcomingFeature();
  }, [openUpcomingFeature]);

  const onClickEmail = useCallback(() => {
    openUpcomingFeature();
  }, [openUpcomingFeature]);

  const onClickCall = useCallback(() => {
    openUpcomingFeature();
  }, [openUpcomingFeature]);

  const onClickWhatsApp = useCallback(() => {
    openUpcomingFeature();
  }, [openUpcomingFeature]);

  // 9. Effects
  useEffect(() => {
    const label =
      getLocationLabelFromParams(
        listParams.city,
        listParams.locations,
        locationTaxonomy ?? undefined,
      ) || listParams.location || "";

    setLocationDraft(label);
    setSelectedLocationValue(
      listParams.city
        ? encodeLocationOptionValue(listParams.city, listParams.locations)
        : "",
    );
  }, [listParams.locations, listParams.city, listParams.location, locationTaxonomy]);

  useEffect(() => {
    if (propertyTaxonomy == null) {
      getPropertyTaxonomy();
    }
  }, [getPropertyTaxonomy, propertyTaxonomy]);

  useEffect(() => {
    if (locationTaxonomy == null) {
      getLocationTaxonomy();
    }
  }, [getLocationTaxonomy, locationTaxonomy]);

  useEffect(() => {
    fetchProperties(listParams);
  }, [fetchProperties, listParams]);

  // 10. Return values
  return {
    listings,
    layoutVariant,
    listTitle,
    isLoading: propertyListings === null || isLoadingPropertyList,
    filters,
    toolbar,
    pagination,
    noDataFound,
    onClickProperty,
    toggleFavourite,
    onClickEmail,
    onClickCall,
    onClickWhatsApp,
    upcomingFeatureModal: {
      open: isUpcomingFeatureModalOpen,
      onClose: closeUpcomingFeature,
    },
    saveSearchModal: {
      open: isSaveSearchModalOpen,
      onClose: closeSaveSearchModal,
      filterItems: saveSearchFilterItems,
      searchCriteria: saveSearchCriteria,
      savedSearchId: saveSearchModalSavedSearchId,
      initialName:
        saveSearchModalSavedSearchId != null
          ? (savedSearchDetail?.data?.name ?? "")
          : "",
    },
  };
}
