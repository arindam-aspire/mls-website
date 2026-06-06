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
import type {
  AutocompleteInputOption,
  SelectDropdownOption,
} from "@/src/components/ui";
import { SELECT_DROPDOWN_EMPTY_VALUE } from "@/src/components/ui";
import {
  parseAmenitiesParam,
  serializeAmenitiesParam,
  SEARCH_CRITERIA_STATUS_OPTIONS,
} from "../constants/searchCriteriaFilter.constants";
import { usePropertyStore } from "@/src/features/property/store/property.store";
import type { SearchCriteriaParams } from "../types/savedSearch.types";
import { pruneAdvancedParamsForContext } from "../utils/searchCriteriaFieldVisibility";

export type SearchCriteriaFieldsProps = {
  status: string;
  statusOptions: SelectDropdownOption[];
  onStatusChange: (value: string) => void;
  category: string;
  categoryOptions: SelectDropdownOption[];
  onCategoryChange: (value: string) => void;
  type: string;
  typeOptions: SelectDropdownOption[];
  onTypeChange: (value: string) => void;
  location: string;
  locationValue?: string;
  locationOptions: AutocompleteInputOption[];
  onLocationInputChange: (value: string) => void;
  onLocationOptionSelect: (option: AutocompleteInputOption) => void;
  onLocationCommit: () => void;
  budgetMin: string;
  budgetMax: string;
  onBudgetMinChange: (value: string) => void;
  onBudgetMaxChange: (value: string) => void;
  onBudgetCommit: () => void;
  onBudgetReset: () => void;
  rentMode?: boolean;
  bedrooms: string;
  rooms: string;
  bathrooms: string;
  parking: string;
  propertyAge: string;
  floorLevel: string;
  furnitureStatus: string;
  minArea: string;
  maxArea: string;
  minPlotArea: string;
  maxPlotArea: string;
  governorate: string;
  directorate: string;
  village: string;
  parcelName: string;
  selectedAmenities: string[];
  onBedroomsChange: (value: string) => void;
  onRoomsChange: (value: string) => void;
  onBathroomsChange: (value: string) => void;
  onParkingChange: (value: string) => void;
  onPropertyAgeChange: (value: string) => void;
  onFloorLevelChange: (value: string) => void;
  onFurnitureStatusChange: (value: string) => void;
  onMinAreaChange: (value: string) => void;
  onMaxAreaChange: (value: string) => void;
  onMinPlotAreaChange: (value: string) => void;
  onMaxPlotAreaChange: (value: string) => void;
  onGovernorateChange: (value: string) => void;
  onDirectorateChange: (value: string) => void;
  onVillageChange: (value: string) => void;
  onParcelNameChange: (value: string) => void;
  onMinAreaCommit: () => void;
  onMaxAreaCommit: () => void;
  onMinPlotAreaCommit: () => void;
  onMaxPlotAreaCommit: () => void;
  onGovernorateCommit: () => void;
  onDirectorateCommit: () => void;
  onVillageCommit: () => void;
  onParcelNameCommit: () => void;
  onAmenityChange: (slug: string, checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

export type UseSearchCriteriaFiltersOptions = {
  filterParams: SearchCriteriaParams;
  updateFilterParams: (partial: Partial<SearchCriteriaParams>) => void;
  disabled?: boolean;
};

export function useSearchCriteriaFilters({
  filterParams,
  updateFilterParams,
  disabled: disabledOption,
}: UseSearchCriteriaFiltersOptions): SearchCriteriaFieldsProps {
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
      });
    },
    [updateFilterParams],
  );

  const onCategoryChange = useCallback(
    (category: string) => {
      updateFilterParams({
        category,
        type: "",
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
    updateFilterParams({
      budgetMin: budgetMinDraft
        ? Number(budgetMinDraft)
        : ("" as unknown as number),
      budgetMax: budgetMaxDraft
        ? Number(budgetMaxDraft)
        : ("" as unknown as number),
    });
  }, [budgetMaxDraft, budgetMinDraft, updateFilterParams]);

  const onBudgetReset = useCallback(() => {
    setBudgetMinDraft("");
    setBudgetMaxDraft("");
    updateFilterParams({
      budgetMin: "" as unknown as number,
      budgetMax: "" as unknown as number,
    });
  }, [updateFilterParams]);

  const onBedroomsChange = useCallback(
    (value: string) => {
      updateFilterParams({
        bedrooms:
          value === SELECT_DROPDOWN_EMPTY_VALUE
            ? ("" as unknown as number)
            : Number(value),
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
      });
    },
    [updateFilterParams],
  );

  const onPropertyAgeChange = useCallback(
    (value: string) => {
      updateFilterParams({
        propertyAge: value === SELECT_DROPDOWN_EMPTY_VALUE ? "" : value,
      });
    },
    [updateFilterParams],
  );

  const onFloorLevelChange = useCallback(
    (value: string) => {
      updateFilterParams({
        floorLevel: value === SELECT_DROPDOWN_EMPTY_VALUE ? "" : value,
      });
    },
    [updateFilterParams],
  );

  const onFurnitureStatusChange = useCallback(
    (value: string) => {
      updateFilterParams({
        furnitureStatus: value === SELECT_DROPDOWN_EMPTY_VALUE ? "" : value,
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

    if (nextValue === currentValue || (nextValue == null && currentValue == null)) {
      return;
    }

    updateFilterParams({
      minArea: nextValue ?? ("" as unknown as number),
    });
  }, [filterParams.minArea, minAreaDraft, updateFilterParams]);

  const onMaxAreaCommit = useCallback(() => {
    const nextValue = maxAreaDraft ? Number(maxAreaDraft) : undefined;
    const currentValue = filterParams.maxArea;

    if (nextValue === currentValue || (nextValue == null && currentValue == null)) {
      return;
    }

    updateFilterParams({
      maxArea: nextValue ?? ("" as unknown as number),
    });
  }, [filterParams.maxArea, maxAreaDraft, updateFilterParams]);

  const onMinPlotAreaChange = useCallback((value: string) => {
    setMinPlotAreaDraft(value.replace(/\D/g, ""));
  }, []);

  const onMaxPlotAreaChange = useCallback((value: string) => {
    setMaxPlotAreaDraft(value.replace(/\D/g, ""));
  }, []);

  const onMinPlotAreaCommit = useCallback(() => {
    const nextValue = minPlotAreaDraft ? Number(minPlotAreaDraft) : undefined;
    const currentValue = filterParams.minPlotArea;

    if (nextValue === currentValue || (nextValue == null && currentValue == null)) {
      return;
    }

    updateFilterParams({
      minPlotArea: nextValue ?? ("" as unknown as number),
    });
  }, [filterParams.minPlotArea, minPlotAreaDraft, updateFilterParams]);

  const onMaxPlotAreaCommit = useCallback(() => {
    const nextValue = maxPlotAreaDraft ? Number(maxPlotAreaDraft) : undefined;
    const currentValue = filterParams.maxPlotArea;

    if (nextValue === currentValue || (nextValue == null && currentValue == null)) {
      return;
    }

    updateFilterParams({
      maxPlotArea: nextValue ?? ("" as unknown as number),
    });
  }, [filterParams.maxPlotArea, maxPlotAreaDraft, updateFilterParams]);

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
      });
    },
    [filterParams.amenities, updateFilterParams],
  );

  const filters = useMemo(
    (): SearchCriteriaFieldsProps => ({
      status:
        filterParams.status || SEARCH_CRITERIA_STATUS_OPTIONS[0].value,
      statusOptions: SEARCH_CRITERIA_STATUS_OPTIONS.map((option) => ({
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
      onRoomsChange,
      onStatusChange,
      onTypeChange,
      onVillageChange,
      onVillageCommit,
      parcelNameDraft,
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
