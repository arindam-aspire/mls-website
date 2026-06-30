"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
import { SELECT_DROPDOWN_EMPTY_VALUE } from "@/src/components/ui";
import type { SaveSearchSubmitPayload } from "@/src/features/saved-searches/types/savedSearch.types";
import type { PropertyListFiltersProps } from "../components/PropertyListFilters";
import {
  hasAdvancedFilters,
  parseAmenitiesParam,
  serializeAmenitiesParam,
} from "../constants/propertyListAdvancedFilters.constants";
import { usePropertyStore } from "../store/property.store";
import type { PropertyListParams } from "../types/property.types";
import { pruneAdvancedParamsForContext } from "../utils/propertyAdvancedFieldVisibility";
import { PROPERTY_SEARCH_STATUS_OPTIONS } from "./propertySearchFilter.constants";

export type UsePropertySearchFiltersOptions = {
  filterParams: PropertyListParams;
  updateFilterParams: (partial: Partial<PropertyListParams>) => void;
  onResetSearch: () => void;
  onSaveSearch?: (payload: SaveSearchSubmitPayload) => void;
  savedSearchId?: string;
  disabled?: boolean;
};

function normalizeRange(minValue: number | undefined, maxValue: number | undefined) {
  if (minValue != null && maxValue != null && minValue > maxValue) {
    return { min: maxValue, max: minValue };
  }

  return { min: minValue, max: maxValue };
}

export function usePropertySearchFilters({
  filterParams,
  updateFilterParams,
  onResetSearch,
  onSaveSearch,
  savedSearchId,
  disabled: disabledOption,
}: UsePropertySearchFiltersOptions): PropertyListFiltersProps {
  // 3. Global state (Zustand)
  const { propertyTaxonomy, locationTaxonomy } = usePropertyStore();

  // 4. Local state
  const [locationDraft, setLocationDraft] = useState(() =>
    getLocationLabelFromParams(
      filterParams.city,
      filterParams.locations,
      locationTaxonomy ?? undefined,
    ) || filterParams.location || "",
  );
  const [selectedLocationValue, setSelectedLocationValue] = useState(() =>
    filterParams.city
      ? encodeLocationOptionValue(filterParams.city, filterParams.locations)
      : "",
  );
  const [budgetMinDraft, setBudgetMinDraft] = useState(
    () =>
      filterParams.budgetMin != null ? String(filterParams.budgetMin) : "",
  );
  const [budgetMaxDraft, setBudgetMaxDraft] = useState(
    () =>
      filterParams.budgetMax != null ? String(filterParams.budgetMax) : "",
  );
  const [minAreaDraft, setMinAreaDraft] = useState(
    () => (filterParams.minArea != null ? String(filterParams.minArea) : ""),
  );
  const [maxAreaDraft, setMaxAreaDraft] = useState(
    () => (filterParams.maxArea != null ? String(filterParams.maxArea) : ""),
  );
  const [minPlotAreaDraft, setMinPlotAreaDraft] = useState(
    () =>
      filterParams.minPlotArea != null ? String(filterParams.minPlotArea) : "",
  );
  const [maxPlotAreaDraft, setMaxPlotAreaDraft] = useState(
    () =>
      filterParams.maxPlotArea != null ? String(filterParams.maxPlotArea) : "",
  );
  const [governorateDraft, setGovernorateDraft] = useState(
    () => filterParams.governorate ?? "",
  );
  const [directorateDraft, setDirectorateDraft] = useState(
    () => filterParams.directorate ?? "",
  );
  const [villageDraft, setVillageDraft] = useState(
    () => filterParams.village ?? "",
  );
  const [parcelNameDraft, setParcelNameDraft] = useState(
    () => filterParams.parcelName ?? "",
  );

  const budgetMinFromParams =
    filterParams.budgetMin != null ? String(filterParams.budgetMin) : "";
  const budgetMaxFromParams =
    filterParams.budgetMax != null ? String(filterParams.budgetMax) : "";
  const budgetParamsKey = `${budgetMinFromParams}|${budgetMaxFromParams}`;
  const [prevBudgetParamsKey, setPrevBudgetParamsKey] = useState(budgetParamsKey);

  if (budgetParamsKey !== prevBudgetParamsKey) {
    setPrevBudgetParamsKey(budgetParamsKey);
    setBudgetMinDraft(budgetMinFromParams);
    setBudgetMaxDraft(budgetMaxFromParams);
  }

  const minAreaFromParams =
    filterParams.minArea != null ? String(filterParams.minArea) : "";
  const maxAreaFromParams =
    filterParams.maxArea != null ? String(filterParams.maxArea) : "";
  const areaParamsKey = `${minAreaFromParams}|${maxAreaFromParams}`;
  const [prevAreaParamsKey, setPrevAreaParamsKey] = useState(areaParamsKey);

  if (areaParamsKey !== prevAreaParamsKey) {
    setPrevAreaParamsKey(areaParamsKey);
    setMinAreaDraft(minAreaFromParams);
    setMaxAreaDraft(maxAreaFromParams);
  }

  const minPlotAreaFromParams =
    filterParams.minPlotArea != null ? String(filterParams.minPlotArea) : "";
  const maxPlotAreaFromParams =
    filterParams.maxPlotArea != null ? String(filterParams.maxPlotArea) : "";
  const plotAreaParamsKey = `${minPlotAreaFromParams}|${maxPlotAreaFromParams}`;
  const [prevPlotAreaParamsKey, setPrevPlotAreaParamsKey] =
    useState(plotAreaParamsKey);

  if (plotAreaParamsKey !== prevPlotAreaParamsKey) {
    setPrevPlotAreaParamsKey(plotAreaParamsKey);
    setMinPlotAreaDraft(minPlotAreaFromParams);
    setMaxPlotAreaDraft(maxPlotAreaFromParams);
  }

  const governorateFromParams = filterParams.governorate ?? "";
  const directorateFromParams = filterParams.directorate ?? "";
  const villageFromParams = filterParams.village ?? "";
  const parcelNameFromParams = filterParams.parcelName ?? "";
  const governorateParamsKey = `${governorateFromParams}|${directorateFromParams}|${villageFromParams}|${parcelNameFromParams}`;
  const [prevGovernorateParamsKey, setPrevGovernorateParamsKey] = useState(
    governorateParamsKey,
  );

  if (governorateParamsKey !== prevGovernorateParamsKey) {
    setPrevGovernorateParamsKey(governorateParamsKey);
    setGovernorateDraft(governorateFromParams);
    setDirectorateDraft(directorateFromParams);
    setVillageDraft(villageFromParams);
    setParcelNameDraft(parcelNameFromParams);
  }

  const locationLabelFromParams =
    getLocationLabelFromParams(
      filterParams.city,
      filterParams.locations,
      locationTaxonomy ?? undefined,
    ) || filterParams.location || "";
  const locationValueFromParams = filterParams.city
    ? encodeLocationOptionValue(filterParams.city, filterParams.locations)
    : "";
  const locationParamsKey = `${locationLabelFromParams}|${locationValueFromParams}`;
  const [prevLocationParamsKey, setPrevLocationParamsKey] =
    useState(locationParamsKey);

  if (locationParamsKey !== prevLocationParamsKey) {
    setPrevLocationParamsKey(locationParamsKey);
    setLocationDraft(locationLabelFromParams);
    setSelectedLocationValue(locationValueFromParams);
  }

  // 5. Data fetching / queries
  const { mutate: getPropertyTaxonomy, isPending: isLoadingTaxonomy } =
    useGetPropertyTaxonomy();

  const { mutate: getLocationTaxonomy } = useGetLocationTaxonomy();

  // 6. Derived / memoized values
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
    if (categories.some((category) => category.slug === filterParams.category)) {
      return filterParams.category;
    }

    return categories[0]?.slug ?? "";
  }, [categories, filterParams.category]);

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
    if (!filterParams.type) {
      return SELECT_DROPDOWN_EMPTY_VALUE;
    }

    if (typeOptions.some((option) => option.value === filterParams.type)) {
      return filterParams.type;
    }

    return SELECT_DROPDOWN_EMPTY_VALUE;
  }, [filterParams.type, typeOptions]);

  const activeParkingValue = useMemo(() => {
    if (filterParams.parking == null) {
      return SELECT_DROPDOWN_EMPTY_VALUE;
    }

    return String(filterParams.parking);
  }, [filterParams.parking]);

  const activeBedroomsValue = useMemo(() => {
    if (filterParams.bedrooms == null) {
      return SELECT_DROPDOWN_EMPTY_VALUE;
    }

    return String(filterParams.bedrooms);
  }, [filterParams.bedrooms]);

  const activeRoomsValue = useMemo(() => {
    if (filterParams.rooms == null) {
      return SELECT_DROPDOWN_EMPTY_VALUE;
    }

    return String(filterParams.rooms);
  }, [filterParams.rooms]);

  const activeBathroomsValue = useMemo(() => {
    if (filterParams.bathrooms == null) {
      return SELECT_DROPDOWN_EMPTY_VALUE;
    }

    return String(filterParams.bathrooms);
  }, [filterParams.bathrooms]);

  const activePropertyAgeValue = useMemo(() => {
    if (!filterParams.propertyAge) {
      return SELECT_DROPDOWN_EMPTY_VALUE;
    }

    return filterParams.propertyAge;
  }, [filterParams.propertyAge]);

  const activeFloorLevelValue = useMemo(() => {
    if (!filterParams.floorLevel) {
      return SELECT_DROPDOWN_EMPTY_VALUE;
    }

    return filterParams.floorLevel;
  }, [filterParams.floorLevel]);

  const activeFurnitureStatusValue = useMemo(() => {
    if (!filterParams.furnitureStatus) {
      return SELECT_DROPDOWN_EMPTY_VALUE;
    }

    return filterParams.furnitureStatus;
  }, [filterParams.furnitureStatus]);

  const selectedAmenities = useMemo(
    () => [...parseAmenitiesParam(filterParams.amenities)],
    [filterParams.amenities],
  );

  const isDisabled =
    disabledOption ?? (isLoadingTaxonomy && propertyTaxonomy == null);

  // 7. Callbacks
  const onStatusChange = useCallback(
    (status: string) => {
      updateFilterParams({
        status,
        budgetMin: "" as unknown as number,
        budgetMax: "" as unknown as number,
        page: 1,
      });
    },
    [updateFilterParams],
  );

  const onCategoryChange = useCallback(
    (category: string) => {
      updateFilterParams({
        category,
        type: "",
        page: 1,
        ...pruneAdvancedParamsForContext(filterParams, category, undefined),
      });
    },
    [filterParams, updateFilterParams],
  );

  const onTypeChange = useCallback(
    (type: string) => {
      const nextType = type === SELECT_DROPDOWN_EMPTY_VALUE ? "" : type;

      updateFilterParams({
        type: nextType,
        page: 1,
        ...pruneAdvancedParamsForContext(
          filterParams,
          activeCategorySlug,
          nextType,
        ),
      });
    },
    [activeCategorySlug, filterParams, updateFilterParams],
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
      updateFilterParams({
        city,
        locations: locations ?? "",
        location: "",
        page: 1,
      });
    },
    [updateFilterParams],
  );

  const onLocationCommit = useCallback(() => {
    const trimmedLocation = locationDraft.trim();

    if (!trimmedLocation) {
      if (
        !filterParams.city &&
        !filterParams.locations &&
        !filterParams.location
      ) {
        return;
      }

      updateFilterParams({
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
      updateFilterParams({
        city,
        locations: locations ?? "",
        location: "",
        page: 1,
      });
      return;
    }

    if ((filterParams.location ?? "") === trimmedLocation) {
      return;
    }

    updateFilterParams({
      location: trimmedLocation,
      city: "",
      locations: "",
      page: 1,
    });
    setSelectedLocationValue("");
  }, [
    filterParams.locations,
    filterParams.city,
    filterParams.location,
    locationDraft,
    locationSuggestions,
    updateFilterParams,
  ]);

  const onBudgetCommit = useCallback(() => {
    const range = normalizeRange(
      budgetMinDraft ? Number(budgetMinDraft) : undefined,
      budgetMaxDraft ? Number(budgetMaxDraft) : undefined,
    );

    updateFilterParams({
      budgetMin: range.min ?? ("" as unknown as number),
      budgetMax: range.max ?? ("" as unknown as number),
      page: 1,
    });
  }, [budgetMaxDraft, budgetMinDraft, updateFilterParams]);

  const onBudgetReset = useCallback(() => {
    setBudgetMinDraft("");
    setBudgetMaxDraft("");
    updateFilterParams({
      budgetMin: "" as unknown as number,
      budgetMax: "" as unknown as number,
      page: 1,
    });
  }, [updateFilterParams]);

  const onBedroomsChange = useCallback(
    (value: string) => {
      updateFilterParams({
        bedrooms:
          value === SELECT_DROPDOWN_EMPTY_VALUE
            ? ("" as unknown as number)
            : Number(value),
        page: 1,
      });
    },
    [updateFilterParams],
  );

  const onRoomsChange = useCallback(
    (value: string) => {
      updateFilterParams({
        rooms:
          value === SELECT_DROPDOWN_EMPTY_VALUE
            ? ("" as unknown as number)
            : Number(value),
        page: 1,
      });
    },
    [updateFilterParams],
  );

  const onBathroomsChange = useCallback(
    (value: string) => {
      updateFilterParams({
        bathrooms:
          value === SELECT_DROPDOWN_EMPTY_VALUE
            ? ("" as unknown as number)
            : Number(value),
        page: 1,
      });
    },
    [updateFilterParams],
  );

  const onParkingChange = useCallback(
    (value: string) => {
      updateFilterParams({
        parking:
          value === SELECT_DROPDOWN_EMPTY_VALUE
            ? ("" as unknown as number)
            : Number(value),
        page: 1,
      });
    },
    [updateFilterParams],
  );

  const onPropertyAgeChange = useCallback(
    (value: string) => {
      updateFilterParams({
        propertyAge: value === SELECT_DROPDOWN_EMPTY_VALUE ? "" : value,
        page: 1,
      });
    },
    [updateFilterParams],
  );

  const onFloorLevelChange = useCallback(
    (value: string) => {
      updateFilterParams({
        floorLevel: value === SELECT_DROPDOWN_EMPTY_VALUE ? "" : value,
        page: 1,
      });
    },
    [updateFilterParams],
  );

  const onFurnitureStatusChange = useCallback(
    (value: string) => {
      updateFilterParams({
        furnitureStatus: value === SELECT_DROPDOWN_EMPTY_VALUE ? "" : value,
        page: 1,
      });
    },
    [updateFilterParams],
  );

  const onMinAreaChange = useCallback((value: string) => {
    setMinAreaDraft(value.replace(/\D/g, ""));
  }, []);

  const onMaxAreaChange = useCallback((value: string) => {
    setMaxAreaDraft(value.replace(/\D/g, ""));
  }, []);

  const onMinAreaCommit = useCallback(() => {
    const nextValue = minAreaDraft ? Number(minAreaDraft) : undefined;
    const currentValue = filterParams.minArea;
    const range = normalizeRange(nextValue, filterParams.maxArea);

    if (nextValue === currentValue || (nextValue == null && currentValue == null)) {
      return;
    }

    updateFilterParams({
      minArea: range.min ?? ("" as unknown as number),
      maxArea: range.max ?? ("" as unknown as number),
      page: 1,
    });
  }, [filterParams.maxArea, filterParams.minArea, minAreaDraft, updateFilterParams]);

  const onMaxAreaCommit = useCallback(() => {
    const nextValue = maxAreaDraft ? Number(maxAreaDraft) : undefined;
    const currentValue = filterParams.maxArea;
    const range = normalizeRange(filterParams.minArea, nextValue);

    if (nextValue === currentValue || (nextValue == null && currentValue == null)) {
      return;
    }

    updateFilterParams({
      minArea: range.min ?? ("" as unknown as number),
      maxArea: range.max ?? ("" as unknown as number),
      page: 1,
    });
  }, [filterParams.maxArea, filterParams.minArea, maxAreaDraft, updateFilterParams]);

  const onMinPlotAreaChange = useCallback((value: string) => {
    setMinPlotAreaDraft(value.replace(/\D/g, ""));
  }, []);

  const onMaxPlotAreaChange = useCallback((value: string) => {
    setMaxPlotAreaDraft(value.replace(/\D/g, ""));
  }, []);

  const onMinPlotAreaCommit = useCallback(() => {
    const nextValue = minPlotAreaDraft ? Number(minPlotAreaDraft) : undefined;
    const currentValue = filterParams.minPlotArea;
    const range = normalizeRange(nextValue, filterParams.maxPlotArea);

    if (nextValue === currentValue || (nextValue == null && currentValue == null)) {
      return;
    }

    updateFilterParams({
      minPlotArea: range.min ?? ("" as unknown as number),
      maxPlotArea: range.max ?? ("" as unknown as number),
      page: 1,
    });
  }, [filterParams.maxPlotArea, filterParams.minPlotArea, minPlotAreaDraft, updateFilterParams]);

  const onMaxPlotAreaCommit = useCallback(() => {
    const nextValue = maxPlotAreaDraft ? Number(maxPlotAreaDraft) : undefined;
    const currentValue = filterParams.maxPlotArea;
    const range = normalizeRange(filterParams.minPlotArea, nextValue);

    if (nextValue === currentValue || (nextValue == null && currentValue == null)) {
      return;
    }

    updateFilterParams({
      minPlotArea: range.min ?? ("" as unknown as number),
      maxPlotArea: range.max ?? ("" as unknown as number),
      page: 1,
    });
  }, [filterParams.maxPlotArea, filterParams.minPlotArea, maxPlotAreaDraft, updateFilterParams]);

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
    const currentValue = filterParams.governorate ?? "";

    if (nextValue === currentValue) {
      return;
    }

    updateFilterParams({
      governorate: nextValue,
      page: 1,
    });
  }, [governorateDraft, filterParams.governorate, updateFilterParams]);

  const onDirectorateCommit = useCallback(() => {
    const nextValue = directorateDraft.trim();
    const currentValue = filterParams.directorate ?? "";

    if (nextValue === currentValue) {
      return;
    }

    updateFilterParams({
      directorate: nextValue,
      page: 1,
    });
  }, [directorateDraft, filterParams.directorate, updateFilterParams]);

  const onVillageCommit = useCallback(() => {
    const nextValue = villageDraft.trim();
    const currentValue = filterParams.village ?? "";

    if (nextValue === currentValue) {
      return;
    }

    updateFilterParams({
      village: nextValue,
      page: 1,
    });
  }, [filterParams.village, updateFilterParams, villageDraft]);

  const onParcelNameCommit = useCallback(() => {
    const nextValue = parcelNameDraft.trim();
    const currentValue = filterParams.parcelName ?? "";

    if (nextValue === currentValue) {
      return;
    }

    updateFilterParams({
      parcelName: nextValue,
      page: 1,
    });
  }, [filterParams.parcelName, parcelNameDraft, updateFilterParams]);

  const onAmenityChange = useCallback(
    (slug: string, checked: boolean) => {
      const nextAmenities = parseAmenitiesParam(filterParams.amenities);

      if (checked) {
        nextAmenities.add(slug);
      } else {
        nextAmenities.delete(slug);
      }

      updateFilterParams({
        amenities:
          serializeAmenitiesParam(nextAmenities) ??
          ("" as unknown as string),
        page: 1,
      });
    },
    [filterParams.amenities, updateFilterParams],
  );

  const filters = useMemo(
    (): PropertyListFiltersProps => ({
      status:
        filterParams.status || PROPERTY_SEARCH_STATUS_OPTIONS[0].value,
      statusOptions: PROPERTY_SEARCH_STATUS_OPTIONS.map((option) => ({
        ...option,
      })),
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
      rentMode: filterParams.status === "rent",
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
      hasAdvancedFilters: hasAdvancedFilters(filterParams),
      onResetSearch,
      onSaveSearch,
      savedSearchId,
      disabled: isDisabled,
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
      filterParams,
      governorateDraft,
      isDisabled,
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
      onResetSearch,
      onRoomsChange,
      onSaveSearch,
      onStatusChange,
      onTypeChange,
      onVillageChange,
      onVillageCommit,
      parcelNameDraft,
      savedSearchId,
      selectedAmenities,
      selectedLocationValue,
      typeOptions,
      villageDraft,
    ],
  );

  // 9. Effects
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

  // 10. Return values
  return filters;
}
