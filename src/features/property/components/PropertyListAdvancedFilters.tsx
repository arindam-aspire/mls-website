"use client";

import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Input, SelectDropdown } from "@/src/components/ui";
import { useMatchMedia } from "@/src/hooks/useMatchMedia";
import { cn } from "@/src/lib/cn";
import {
  checkboxLabelClasses,
  sheetTitleClasses,
} from "@/src/lib/typography";
import { X } from "lucide-react";
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
} from "../constants/propertyListAdvancedFilters.constants";
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
} from "../utils/propertyAdvancedFieldVisibility";

type AdvancedFiltersFieldsProps = {
  category: string;
  type: string;
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
  variant?: "inline" | "sheet";
};

function AdvancedFiltersFields({
  category,
  type,
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
  disabled = false,
  variant = "inline",
}: AdvancedFiltersFieldsProps) {
  const t = useTranslations("propertyList.advanced");
  const selectedAmenitySet = new Set(selectedAmenities);
  const isSheet = variant === "sheet";

  const propertyAgeOptions = useMemo(
    () =>
      PROPERTY_AGE_OPTIONS.map((option) => ({
        value: option.value,
        label: t(`propertyAgeOptions.${option.label}` as "propertyAgeOptions.new"),
      })),
    [t],
  );

  const floorOptions = useMemo(
    () =>
      FLOOR_OPTIONS.map((option) => {
        if (option.value === "ground" || option.value === "penthouse") {
          return {
            value: option.value,
            label: t(`floorOptions.${option.value}` as "floorOptions.ground"),
          };
        }

        return option;
      }),
    [t],
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
      label: t(`furnitureOptions.${labelKeys[option.value]}`),
    }));
  }, [t]);

  const visibleAmenitySlugs = useMemo(
    () => getVisibleAmenitySlugs(category, type),
    [category, type],
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
    <>
      <div
        className={cn(
          isSheet
            ? "px-4 py-3 sm:px-6"
            : "border-t border-b border-secondary/15 py-3 sm:py-4",
        )}
      >
        <div
          className={cn(
            "grid grid-cols-1 gap-3",
            isSheet
              ? "sm:grid-cols-2"
              : "sm:grid-cols-2 md:grid-cols-4 md:gap-4 lg:grid-cols-6 lg:gap-6",
          )}
        >
          {showBedrooms(category) ? (
            <SelectDropdown
              label={t("bedrooms")}
              placeholder={t("allRooms")}
              value={bedrooms}
              options={BEDROOMS_OPTIONS}
              onChange={onBedroomsChange}
              disabled={disabled}
              variant="outline"
            />
          ) : null}

          {showRooms(category) ? (
            <SelectDropdown
              label={t("rooms")}
              placeholder={t("allRooms")}
              value={rooms}
              options={ROOM_OPTIONS}
              onChange={onRoomsChange}
              disabled={disabled}
              variant="outline"
            />
          ) : null}

          {showBathrooms(category) ? (
            <SelectDropdown
              label={t("bathrooms")}
              placeholder={t("allBaths")}
              value={bathrooms}
              options={BATHROOMS_OPTIONS}
              onChange={onBathroomsChange}
              disabled={disabled}
              variant="outline"
            />
          ) : null}

          {showParking(category) ? (
            <SelectDropdown
              label={t("parking")}
              placeholder={t("allParking")}
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
                label={t("minArea")}
                placeholder={t("minArea")}
                value={minArea}
                onChange={(event) => onMinAreaChange(event.target.value)}
                onBlur={onMinAreaCommit}
                onKeyDown={numericCommitHandlers.onKeyDown(onMinAreaCommit)}
                inputMode="numeric"
                disabled={disabled}
                variant="outline"
              />

              <Input
                label={t("maxArea")}
                placeholder={t("maxArea")}
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
                label={t("minPlotArea")}
                placeholder={t("minPlotArea")}
                value={minPlotArea}
                onChange={(event) => onMinPlotAreaChange(event.target.value)}
                onBlur={onMinPlotAreaCommit}
                onKeyDown={numericCommitHandlers.onKeyDown(onMinPlotAreaCommit)}
                inputMode="numeric"
                disabled={disabled}
                variant="outline"
              />

              <Input
                label={t("maxPlotArea")}
                placeholder={t("maxPlotArea")}
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
              label={t("governorate")}
              placeholder={t("governorate")}
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
              label={t("directorate")}
              placeholder={t("directorate")}
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
              label={t("village")}
              placeholder={t("village")}
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
              label={t("propertyAge")}
              placeholder={t("selectPropertyAge")}
              value={propertyAge}
              options={propertyAgeOptions}
              onChange={onPropertyAgeChange}
              disabled={disabled}
              variant="outline"
            />
          ) : null}

          {showFurnitureStatus(category, type) ? (
            <SelectDropdown
              label={t("furnitureStatus")}
              placeholder={t("selectFurnitureStatus")}
              value={furnitureStatus}
              options={furnitureOptions}
              onChange={onFurnitureStatusChange}
              disabled={disabled}
              variant="outline"
            />
          ) : null}

          {showFloorLevel(category, type) ? (
            <SelectDropdown
              label={t("floorLevel")}
              placeholder={t("selectFloorLevel")}
              value={floorLevel}
              options={floorOptions}
              onChange={onFloorLevelChange}
              disabled={disabled}
              variant="outline"
            />
          ) : null}

          {showParcelName(category, type) ? (
            <Input
              label={t("parcelName")}
              placeholder={t("parcelName")}
              value={parcelName}
              onChange={(event) => onParcelNameChange(event.target.value)}
              onBlur={onParcelNameCommit}
              onKeyDown={numericCommitHandlers.onKeyDown(onParcelNameCommit)}
              disabled={disabled}
              variant="outline"
            />
          ) : null}
        </div>
      </div>

      {visibleAmenitySlugs.length > 0 ? (
        <div
          className={cn(
            "flex flex-wrap items-center gap-4",
            isSheet ? "px-4 pb-6 pt-3 sm:px-6" : "mt-3 md:mt-4",
          )}
        >
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
                {t(`amenities.${slug}` as `amenities.${typeof ALL_AMENITY_SLUGS[number]}`)}
              </label>
            );
          })}
        </div>
      ) : null}
    </>
  );
}

export type PropertyListAdvancedFiltersProps = AdvancedFiltersFieldsProps & {
  open: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
};

export function PropertyListAdvancedFilters({
  open,
  onClose,
  title,
  className,
  ...fieldsProps
}: PropertyListAdvancedFiltersProps) {
  const t = useTranslations("propertyList.advanced");
  const isMobileSheet = useMatchMedia("(max-width: 767px)");

  return (
    <>
      {open && !isMobileSheet ? (
        <div className={cn("w-full min-w-0", className)}>
          <AdvancedFiltersFields {...fieldsProps} variant="inline" />
        </div>
      ) : null}

      {isMobileSheet ? (
        <Dialog
          open={open}
          onClose={onClose}
          transition
          className="relative z-[80]"
        >
          <DialogBackdrop
            transition
            className={cn(
              "fixed inset-0 bg-black/65 transition-opacity",
              "data-closed:opacity-0 data-enter:opacity-100 data-leave:opacity-0",
            )}
          />

          <div className="fixed inset-0 z-[80] flex items-end justify-center">
            <DialogPanel
              transition
              className={cn(
                "flex max-h-[min(90dvh,100%)] w-full flex-col overflow-hidden rounded-t-xl border border-b-0 border-secondary/15 bg-surface text-text shadow-lg",
                "transition duration-300 ease-out",
                "data-closed:translate-y-full data-enter:translate-y-0 data-leave:translate-y-full",
                className,
              )}
            >
              <div className="relative shrink-0 border-b border-secondary/15">
                <div className="flex justify-center pt-2" aria-hidden>
                  <div className="h-1 w-10 rounded-full bg-secondary/25" />
                </div>
                <div className="relative px-4 py-3 sm:px-6">
                  <DialogTitle className={cn("pe-12", sheetTitleClasses)}>
                    {title ?? t("title")}
                  </DialogTitle>
                  <CloseButton
                    type="button"
                    aria-label={t("closeAriaLabel")}
                    className="absolute end-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:bg-page hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 sm:end-5"
                  >
                    <X className="size-5" aria-hidden />
                  </CloseButton>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
                <AdvancedFiltersFields {...fieldsProps} variant="sheet" />
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      ) : null}
    </>
  );
}
