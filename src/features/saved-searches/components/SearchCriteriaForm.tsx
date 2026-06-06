"use client";

import { BudgetAutocompleteField } from "@/src/components/search";
import {
  AutocompleteInput,
  Button,
  Input,
  SelectDropdown,
} from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import { checkboxLabelClasses } from "@/src/lib/typography";
import { Bookmark, MapPin, RotateCcw, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import {
  ALL_AMENITY_SLUGS,
  BATHROOMS_OPTIONS,
  BEDROOMS_OPTIONS,
  FLOOR_OPTIONS,
  FURNITURE_STATUS_OPTIONS,
  PARKING_OPTIONS,
  PROPERTY_AGE_OPTIONS,
  ROOM_OPTIONS,
} from "../constants/searchCriteriaFilter.constants";
import { useSearchCriteriaForm } from "../hooks/useSearchCriteriaForm";
import type { SavedSearchRecord } from "../types/savedSearch.types";
import {
  getVisibleAmenitySlugs,
  showBathrooms,
  showBedrooms,
  showDirectorate,
  showFloorLevel,
  showFurnitureStatus,
  showGovernorate,
  showMinMaxArea,
  showMinMaxPlotArea,
  showParcelName,
  showParking,
  showPropertyAge,
  showRooms,
  showVillage,
} from "../utils/searchCriteriaFieldVisibility";

type SearchCriteriaFormProps = {
  onCancel?: () => void;
  record?: SavedSearchRecord;
  className?: string;
};

const criteriaFormStackGapClassName = "gap-2 md:gap-4";
const criteriaFormGridGapClassName = "gap-2 md:gap-4";

export function SearchCriteriaForm({
  onCancel,
  record,
  className,
}: SearchCriteriaFormProps) {
  const {
    criteriaFields,
    values,
    errors,
    handleChange,
    handleBlur,
    handleFormSubmit,
    nameLabel,
    namePlaceholder,
    cancelLabel,
    resetCriteriaLabel,
    saveLabel,
    savingLabel,
    isSaving,
    onResetCriteria,
  } = useSearchCriteriaForm({ onCancel, record });

  const {
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
    rentMode,
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
    disabled,
  } = criteriaFields;

  const tCriteria = useTranslations("savedSearches.criteria");
  const tLabels = useTranslations("savedSearches.filterLabels");
  const tAdvanced = useTranslations("propertyList.advanced");
  const selectedAmenitySet = new Set(selectedAmenities);

  const propertyAgeOptions = useMemo(
    () =>
      PROPERTY_AGE_OPTIONS.map((option) => ({
        value: option.value,
        label: tAdvanced(
          `propertyAgeOptions.${option.label}` as "propertyAgeOptions.new",
        ),
      })),
    [tAdvanced],
  );

  const floorOptions = useMemo(
    () =>
      FLOOR_OPTIONS.map((option) => {
        if (option.value === "ground" || option.value === "penthouse") {
          return {
            value: option.value,
            label: tAdvanced(
              `floorOptions.${option.value}` as "floorOptions.ground",
            ),
          };
        }

        return option;
      }),
    [tAdvanced],
  );

  const furnitureOptions = useMemo(() => {
    const labelKeys: Record<string, "furnished" | "semiFurnished" | "unfurnished"> =
      {
        furnished: "furnished",
        "semi-furnished": "semiFurnished",
        unfurnished: "unfurnished",
      };

    return FURNITURE_STATUS_OPTIONS.map((option) => ({
      value: option.value,
      label: tAdvanced(`furnitureOptions.${labelKeys[option.value]}`),
    }));
  }, [tAdvanced]);

  const visibleAmenitySlugs = useMemo(
    () => getVisibleAmenitySlugs(category, type),
    [category, type],
  );

  const statusSelectOptions = useMemo(
    () =>
      statusOptions.map((option) => ({
        value: option.value,
        label:
          option.value === "rent"
            ? tCriteria("statusRent")
            : tCriteria("statusBuy"),
      })),
    [statusOptions, tCriteria],
  );

  const numericCommitHandlers = {
    onKeyDown:
      (commit: () => void) =>
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
          commit();
        }
      },
  };

  return (
    <form
      className={cn(
        "flex w-full min-w-0 flex-col",
        criteriaFormStackGapClassName,
        className,
      )}
      onSubmit={handleFormSubmit}
      noValidate
    >
      <Input
        name="name"
        type="text"
        autoComplete="off"
        size="md"
        label={nameLabel}
        placeholder={namePlaceholder}
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        iconStart={<Bookmark className="size-4" aria-hidden />}
        isRequired
      />

      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3",
          criteriaFormGridGapClassName,
        )}
      >
        <SelectDropdown
          label={tLabels("lookingFor")}
          aria-label={tLabels("lookingFor")}
          placeholder={tCriteria("statusPlaceholder")}
          value={status}
          options={statusSelectOptions}
          onChange={onStatusChange}
          disabled={disabled}
          variant="outline"
        />

        <SelectDropdown
          label={tLabels("category")}
          aria-label={tLabels("category")}
          placeholder={tCriteria("categoryPlaceholder")}
          value={category}
          options={categoryOptions}
          onChange={onCategoryChange}
          disabled={disabled || categoryOptions.length === 0}
          variant="outline"
        />

        <SelectDropdown
          label={tLabels("type")}
          aria-label={tLabels("type")}
          placeholder={tCriteria("typePlaceholder")}
          value={type}
          options={typeOptions}
          onChange={onTypeChange}
          disabled={disabled || typeOptions.length === 0}
          variant="outline"
        />
      </div>

      <div
        className={cn(
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3",
          criteriaFormGridGapClassName,
        )}
      >
        <AutocompleteInput
          label={tLabels("location")}
          aria-label={tLabels("location")}
          placeholder={tCriteria("locationPlaceholder")}
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
          emptyMessage={tCriteria("locationEmptyMessage")}
        />

        <BudgetAutocompleteField
          label={tLabels("minBudget")}
          aria-label={tLabels("minBudget")}
          mode="min"
          value={budgetMin}
          peerValue={budgetMax}
          rentMode={rentMode}
          placeholder={tCriteria("budgetMinFallback")}
          onChange={onBudgetMinChange}
          onCommit={onBudgetCommit}
          disabled={disabled}
        />

        <BudgetAutocompleteField
          label={tLabels("maxBudget")}
          aria-label={tLabels("maxBudget")}
          mode="max"
          value={budgetMax}
          peerValue={budgetMin}
          rentMode={rentMode}
          placeholder={tCriteria("budgetMaxFallback")}
          onChange={onBudgetMaxChange}
          onCommit={onBudgetCommit}
          disabled={disabled}
        />
      </div>

      <section
        className={cn("flex w-full min-w-0 flex-col", criteriaFormStackGapClassName)}
        aria-label={tCriteria("sectionTitle")}
      >
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4",
            criteriaFormGridGapClassName,
          )}
        >
          {showBedrooms(category) ? (
            <SelectDropdown
              label={tAdvanced("bedrooms")}
              placeholder={tAdvanced("allRooms")}
              value={bedrooms}
              options={BEDROOMS_OPTIONS}
              onChange={onBedroomsChange}
              disabled={disabled}
              variant="outline"
            />
          ) : null}

          {showRooms(category) ? (
            <SelectDropdown
              label={tAdvanced("rooms")}
              placeholder={tAdvanced("allRooms")}
              value={rooms}
              options={ROOM_OPTIONS}
              onChange={onRoomsChange}
              disabled={disabled}
              variant="outline"
            />
          ) : null}

          {showBathrooms(category) ? (
            <SelectDropdown
              label={tAdvanced("bathrooms")}
              placeholder={tAdvanced("allBaths")}
              value={bathrooms}
              options={BATHROOMS_OPTIONS}
              onChange={onBathroomsChange}
              disabled={disabled}
              variant="outline"
            />
          ) : null}

          {showParking(category) ? (
            <SelectDropdown
              label={tAdvanced("parking")}
              placeholder={tAdvanced("allParking")}
              value={parking}
              options={PARKING_OPTIONS}
              onChange={onParkingChange}
              disabled={disabled}
              variant="outline"
            />
          ) : null}

          {showMinMaxArea(category) ? (
            <>
              <Input
                label={tAdvanced("minArea")}
                placeholder={tAdvanced("minArea")}
                value={minArea}
                onChange={(event) => onMinAreaChange(event.target.value)}
                onBlur={onMinAreaCommit}
                onKeyDown={numericCommitHandlers.onKeyDown(onMinAreaCommit)}
                inputMode="numeric"
                disabled={disabled}
                variant="outline"
              />
              <Input
                label={tAdvanced("maxArea")}
                placeholder={tAdvanced("maxArea")}
                value={maxArea}
                onChange={(event) => onMaxAreaChange(event.target.value)}
                onBlur={onMaxAreaCommit}
                onKeyDown={numericCommitHandlers.onKeyDown(onMaxAreaCommit)}
                inputMode="numeric"
                disabled={disabled}
                variant="outline"
              />
            </>
          ) : null}

          {showMinMaxPlotArea(category) ? (
            <>
              <Input
                label={tAdvanced("minPlotArea")}
                placeholder={tAdvanced("minPlotArea")}
                value={minPlotArea}
                onChange={(event) => onMinPlotAreaChange(event.target.value)}
                onBlur={onMinPlotAreaCommit}
                onKeyDown={numericCommitHandlers.onKeyDown(onMinPlotAreaCommit)}
                inputMode="numeric"
                disabled={disabled}
                variant="outline"
              />
              <Input
                label={tAdvanced("maxPlotArea")}
                placeholder={tAdvanced("maxPlotArea")}
                value={maxPlotArea}
                onChange={(event) => onMaxPlotAreaChange(event.target.value)}
                onBlur={onMaxPlotAreaCommit}
                onKeyDown={numericCommitHandlers.onKeyDown(onMaxPlotAreaCommit)}
                inputMode="numeric"
                disabled={disabled}
                variant="outline"
              />
            </>
          ) : null}

          {showGovernorate(category) ? (
            <Input
              label={tAdvanced("governorate")}
              placeholder={tAdvanced("governorate")}
              value={governorate}
              onChange={(event) => onGovernorateChange(event.target.value)}
              onBlur={onGovernorateCommit}
              onKeyDown={numericCommitHandlers.onKeyDown(onGovernorateCommit)}
              disabled={disabled}
              variant="outline"
            />
          ) : null}

          {showDirectorate(category) ? (
            <Input
              label={tAdvanced("directorate")}
              placeholder={tAdvanced("directorate")}
              value={directorate}
              onChange={(event) => onDirectorateChange(event.target.value)}
              onBlur={onDirectorateCommit}
              onKeyDown={numericCommitHandlers.onKeyDown(onDirectorateCommit)}
              disabled={disabled}
              variant="outline"
            />
          ) : null}

          {showVillage(category) ? (
            <Input
              label={tAdvanced("village")}
              placeholder={tAdvanced("village")}
              value={village}
              onChange={(event) => onVillageChange(event.target.value)}
              onBlur={onVillageCommit}
              onKeyDown={numericCommitHandlers.onKeyDown(onVillageCommit)}
              disabled={disabled}
              variant="outline"
            />
          ) : null}

          {showPropertyAge(category) ? (
            <SelectDropdown
              label={tAdvanced("propertyAge")}
              placeholder={tAdvanced("selectPropertyAge")}
              value={propertyAge}
              options={propertyAgeOptions}
              onChange={onPropertyAgeChange}
              disabled={disabled}
              variant="outline"
            />
          ) : null}

          {showFurnitureStatus(category, type) ? (
            <SelectDropdown
              label={tAdvanced("furnitureStatus")}
              placeholder={tAdvanced("selectFurnitureStatus")}
              value={furnitureStatus}
              options={furnitureOptions}
              onChange={onFurnitureStatusChange}
              disabled={disabled}
              variant="outline"
            />
          ) : null}

          {showFloorLevel(category, type) ? (
            <SelectDropdown
              label={tAdvanced("floorLevel")}
              placeholder={tAdvanced("selectFloorLevel")}
              value={floorLevel}
              options={floorOptions}
              onChange={onFloorLevelChange}
              disabled={disabled}
              variant="outline"
            />
          ) : null}

          {showParcelName(category, type) ? (
            <Input
              label={tAdvanced("parcelName")}
              placeholder={tAdvanced("parcelName")}
              value={parcelName}
              onChange={(event) => onParcelNameChange(event.target.value)}
              onBlur={onParcelNameCommit}
              onKeyDown={numericCommitHandlers.onKeyDown(onParcelNameCommit)}
              disabled={disabled}
              variant="outline"
            />
          ) : null}
        </div>

        {visibleAmenitySlugs.length > 0 ? (
          <div className={cn("flex flex-wrap pt-0", criteriaFormGridGapClassName)}>
            {visibleAmenitySlugs.map((slug) => {
              const checked = selectedAmenitySet.has(slug);

              return (
                <label
                  key={slug}
                  className={cn(
                    "inline-flex min-h-11 cursor-pointer items-center gap-2 text-text",
                    checkboxLabelClasses,
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={(event) => {
                      onAmenityChange(slug, event.target.checked);
                    }}
                    className="size-4 shrink-0 rounded border-secondary/30 bg-surface text-secondary-dark accent-secondary-dark"
                  />
                  {tAdvanced(
                    `amenities.${slug}` as `amenities.${typeof ALL_AMENITY_SLUGS[number]}`,
                  )}
                </label>
              );
            })}
          </div>
        ) : null}
      </section>

      <div
        className={cn(
          "flex flex-row flex-wrap items-center justify-end",
          criteriaFormGridGapClassName,
        )}
      >
        <Button
          type="button"
          color="secondary"
          variant="ghost"
          size="md"
          className="rounded-lg"
          onClick={onCancel}
          disabled={isSaving}
        >
          {cancelLabel}
        </Button>
        <Button
          type="button"
          color="inherit"
          variant="outline"
          size="md"
          className="rounded-lg"
          iconStart={<RotateCcw className="size-4" aria-hidden />}
          onClick={onResetCriteria}
          disabled={isSaving}
        >
          {resetCriteriaLabel}
        </Button>
        <Button
          type="submit"
          color="primary"
          variant="solid"
          size="md"
          className="rounded-lg"
          iconStart={<Save className="size-4" aria-hidden />}
          isLoading={isSaving}
          loadingLabel={savingLabel}
        >
          {saveLabel}
        </Button>
      </div>
    </form>
  );
}
