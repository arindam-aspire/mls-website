"use client";

import { BudgetField } from "@/src/components/search";
import {
  AutocompleteInput,
  Button,
  SelectDropdown,
  ToggleButton,
  type AutocompleteInputOption,
  type SelectDropdownOption,
  type ToggleButtonItem,
} from "@/src/components/ui";
import { isRtlLocale } from "@/src/i18n/routing";
import { Bookmark, MapPin, Minus, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/src/lib/cn";
import type { SaveSearchSubmitPayload } from "@/src/features/saved-searches/types/savedSearch.types";
import { buildSaveSearchCriteria } from "@/src/features/saved-searches/utils/buildSaveSearchCriteria";
import { buildSaveSearchFilterItems } from "@/src/features/saved-searches/utils/buildSaveSearchFilterItems";
import { PropertyListAdvancedFilters } from "./PropertyListAdvancedFilters";

/** Horizontal filter row below `md`; scrollbar hidden on small viewports. */
const mobileFiltersScrollRowClassName =
  "flex w-full min-w-0 gap-2 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-1 md:gap-4 md:overflow-visible lg:grid-cols-8 lg:gap-6";

const mobileToggleScrollItemClassName =
  "w-[8rem] min-w-[8rem] max-w-[8rem] shrink-0 md:max-w-none md:min-w-0 md:w-full";

const mobileScrollItemClassName =
  "w-[9rem] min-w-[9rem] max-w-[9rem] shrink-0 md:max-w-none md:min-w-0 md:w-full";

export type PropertyListFiltersProps = {
  status: string;
  statusOptions: ToggleButtonItem[];
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
  hasAdvancedFilters?: boolean;
  onResetSearch: () => void;
  onSaveSearch?: (payload: SaveSearchSubmitPayload) => void;
  savedSearchId?: string;
  statusAriaLabel?: string;
  categoryAriaLabel?: string;
  categoryPlaceholder?: string;
  typeAriaLabel?: string;
  typePlaceholder?: string;
  locationAriaLabel?: string;
  locationPlaceholder?: string;
  budgetAriaLabel?: string;
  budgetPlaceholder?: string;
  budgetMinFallbackLabel?: string;
  budgetMaxFallbackLabel?: string;
  disabled?: boolean;
};

export function PropertyListFilters({
  status,
  statusOptions,
  onStatusChange,
  category,
  categoryOptions,
  onCategoryChange,
  type,
  typeOptions,
  onTypeChange,
  location,
  locationValue,
  locationOptions,
  onLocationInputChange,
  onLocationOptionSelect,
  onLocationCommit,
  budgetMin,
  budgetMax,
  onBudgetMinChange,
  onBudgetMaxChange,
  onBudgetCommit,
  onBudgetReset,
  rentMode = false,
  bedrooms,
  rooms,
  bathrooms,
  parking,
  propertyAge,
  floorLevel,
  furnitureStatus,
  minArea,
  maxArea,
  minPlotArea,
  maxPlotArea,
  governorate,
  directorate,
  village,
  parcelName,
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
  hasAdvancedFilters = false,
  onResetSearch,
  onSaveSearch,
  savedSearchId,
  statusAriaLabel = "Listing status",
  categoryAriaLabel = "Property category",
  categoryPlaceholder = "Select category",
  typeAriaLabel = "Property type",
  typePlaceholder = "Select type",
  locationAriaLabel = "Location",
  locationPlaceholder = "Search location",
  budgetAriaLabel = "Budget",
  budgetPlaceholder = "Select budget",
  budgetMinFallbackLabel = "Min",
  budgetMaxFallbackLabel = "Max",
  disabled = false,
}: PropertyListFiltersProps) {
  const locale = useLocale();
  const tPropertyList = useTranslations("propertyList.filters");
  const tPropertyListAmenities = useTranslations("propertyList.advanced.amenities");
  const tSavedSearch = useTranslations("savedSearches");
  const isUpdateMode = Boolean(savedSearchId);
  const saveSearchActionLabel = isUpdateMode
    ? tSavedSearch("updateSearch")
    : tSavedSearch("saveSearch");

  const handleSaveSearchClick = useCallback(() => {
    if (!onSaveSearch) {
      return;
    }

    const filterInput = {
      status,
      statusOptions,
      category,
      categoryOptions,
      type,
      typeOptions,
      location,
      locationValue,
      locationOptions,
      budgetMin,
      budgetMax,
      bedrooms,
      rooms,
      bathrooms,
      parking,
      propertyAge,
      floorLevel,
      furnitureStatus,
      minArea,
      maxArea,
      minPlotArea,
      maxPlotArea,
      governorate,
      directorate,
      village,
      parcelName,
      selectedAmenities,
    };

    onSaveSearch({
      filterItems: buildSaveSearchFilterItems(
        filterInput,
        tSavedSearch,
        (slug) =>
          tPropertyListAmenities(
            slug as Parameters<typeof tPropertyListAmenities>[0],
          ),
      ),
      searchCriteria: buildSaveSearchCriteria(filterInput),
    });
  }, [
    bathrooms,
    budgetMax,
    budgetMin,
    category,
    categoryOptions,
    location,
    locationOptions,
    locationValue,
    maxArea,
    minArea,
    onSaveSearch,
    parking,
    propertyAge,
    selectedAmenities,
    status,
    statusOptions,
    tSavedSearch,
    tPropertyListAmenities,
    type,
    typeOptions,
    bedrooms,
    directorate,
    floorLevel,
    furnitureStatus,
    governorate,
    maxPlotArea,
    minPlotArea,
    parcelName,
    rooms,
    village,
  ]);
  const isRtl = isRtlLocale(locale);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(hasAdvancedFilters);

  useEffect(() => {
    if (hasAdvancedFilters) {
      setIsAdvancedOpen(true);
    }
  }, [hasAdvancedFilters]);

  return (
    <div className="relative isolate z-70 flex w-full min-w-0 flex-col gap-3 md:gap-4">
      <section
        className={mobileFiltersScrollRowClassName}
        aria-label="Property search filters"
      >
        <div className="contents md:col-span-1 md:grid md:min-w-0 md:grid-cols-4 md:items-center md:gap-4 lg:col-span-5 lg:grid-cols-5 lg:gap-6">
          <ToggleButton
            className={cn(mobileToggleScrollItemClassName, "md:col-span-1")}
            color="primary"
            variant="solid"
            size="md"
            value={status}
            onChange={onStatusChange}
            items={statusOptions}
            aria-label={statusAriaLabel}
            disabled={disabled}
          />

          <SelectDropdown
            className={cn(mobileScrollItemClassName, "md:col-span-1")}
            aria-label={categoryAriaLabel}
            placeholder={categoryPlaceholder}
            value={category}
            options={categoryOptions}
            onChange={onCategoryChange}
            disabled={disabled || categoryOptions.length === 0}
            variant="outline"
          />

          <SelectDropdown
            className={cn(mobileScrollItemClassName, "md:col-span-1")}
            aria-label={typeAriaLabel}
            placeholder={typePlaceholder}
            value={type}
            options={typeOptions}
            onChange={onTypeChange}
            disabled={disabled || typeOptions.length === 0}
            variant="outline"
          />

          <AutocompleteInput
            className={cn(mobileScrollItemClassName, "md:col-span-1")}
            aria-label={locationAriaLabel}
            placeholder={locationPlaceholder}
            inputValue={location}
            value={locationValue}
            options={locationOptions}
            onInputChange={onLocationInputChange}
            onOptionSelect={onLocationOptionSelect}
            onBlur={onLocationCommit}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onLocationCommit();
              }
            }}
            iconEnd={<MapPin className="size-4" aria-hidden />}
            variant="outline"
            disabled={disabled}
            minCharsToShow={1}
            emptyMessage="No locations found"
          />

          <BudgetField
            className={cn(mobileScrollItemClassName, "md:col-span-1")}
            aria-label={budgetAriaLabel}
            placeholder={budgetPlaceholder}
            min={budgetMin}
            max={budgetMax}
            onChangeMin={onBudgetMinChange}
            onChangeMax={onBudgetMaxChange}
            isOpen={isBudgetOpen}
            onToggle={() => {
              setIsBudgetOpen((open) => !open);
            }}
            onClose={() => {
              setIsBudgetOpen(false);
            }}
            onCommit={onBudgetCommit}
            onReset={onBudgetReset}
            rentMode={rentMode}
            isRtl={isRtl}
            minFallbackLabel={budgetMinFallbackLabel}
            maxFallbackLabel={budgetMaxFallbackLabel}
            disabled={disabled}
          />
        </div>

        <div className="contents md:col-span-1 md:grid md:min-w-0 md:grid-cols-3 md:gap-4 lg:col-span-3 lg:grid-cols-3 lg:gap-6">
          <Button
            type="button"
            color="primary"
            variant="solid"
            className={cn(mobileScrollItemClassName, "rounded-lg md:shrink")}
            aria-expanded={isAdvancedOpen}
            onClick={() => {
              setIsAdvancedOpen((open) => !open);
            }}
            iconStart={
              isAdvancedOpen ? (
                <Minus className="size-4" aria-hidden />
              ) : (
                <SlidersHorizontal className="size-4" aria-hidden />
              )
            }
          >
            {tPropertyList("advancedSearch")}
          </Button>
          <Button
            type="button"
            color="inherit"
            variant="outline"
            className={cn(mobileScrollItemClassName, "rounded-lg md:shrink")}
            onClick={() => {
              setIsAdvancedOpen(false);
              onResetSearch();
            }}
            iconStart={<RotateCcw className="size-4" aria-hidden />}
          >
            {tPropertyList("resetSearch")}
          </Button>
          <Button
            type="button"
            color="secondary"
            variant="outline"
            className={cn(mobileScrollItemClassName, "rounded-lg md:shrink")}
            onClick={handleSaveSearchClick}
            iconStart={<Bookmark className="size-4" aria-hidden />}
            disabled={disabled}
          >
            {saveSearchActionLabel}
          </Button>
        </div>
      </section>

      <PropertyListAdvancedFilters
        open={isAdvancedOpen}
        onClose={() => {
          setIsAdvancedOpen(false);
        }}
        category={category}
        type={type}
        bedrooms={bedrooms}
        rooms={rooms}
        bathrooms={bathrooms}
        parking={parking}
        propertyAge={propertyAge}
        floorLevel={floorLevel}
        furnitureStatus={furnitureStatus}
        minArea={minArea}
        maxArea={maxArea}
        minPlotArea={minPlotArea}
        maxPlotArea={maxPlotArea}
        governorate={governorate}
        directorate={directorate}
        village={village}
        parcelName={parcelName}
        selectedAmenities={selectedAmenities}
        onBedroomsChange={onBedroomsChange}
        onRoomsChange={onRoomsChange}
        onBathroomsChange={onBathroomsChange}
        onParkingChange={onParkingChange}
        onPropertyAgeChange={onPropertyAgeChange}
        onFloorLevelChange={onFloorLevelChange}
        onFurnitureStatusChange={onFurnitureStatusChange}
        onMinAreaChange={onMinAreaChange}
        onMaxAreaChange={onMaxAreaChange}
        onMinPlotAreaChange={onMinPlotAreaChange}
        onMaxPlotAreaChange={onMaxPlotAreaChange}
        onGovernorateChange={onGovernorateChange}
        onDirectorateChange={onDirectorateChange}
        onVillageChange={onVillageChange}
        onParcelNameChange={onParcelNameChange}
        onMinAreaCommit={onMinAreaCommit}
        onMaxAreaCommit={onMaxAreaCommit}
        onMinPlotAreaCommit={onMinPlotAreaCommit}
        onMaxPlotAreaCommit={onMaxPlotAreaCommit}
        onGovernorateCommit={onGovernorateCommit}
        onDirectorateCommit={onDirectorateCommit}
        onVillageCommit={onVillageCommit}
        onParcelNameCommit={onParcelNameCommit}
        onAmenityChange={onAmenityChange}
        disabled={disabled}
      />
    </div>
  );
}
