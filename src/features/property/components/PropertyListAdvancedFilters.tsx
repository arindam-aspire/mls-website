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
import {
  ADVANCED_AMENITY_OPTIONS,
  BATHROOMS_OPTIONS,
  BEDROOMS_OPTIONS,
  PARKING_OPTIONS,
  PROPERTY_AGE_OPTIONS,
} from "./propertyListAdvancedFilters.constants";

type AdvancedFiltersFieldsProps = {
  bedrooms: string;
  bathrooms: string;
  parking: string;
  propertyAge: string;
  minArea: string;
  maxArea: string;
  selectedAmenities: string[];
  onBedroomsChange: (value: string) => void;
  onBathroomsChange: (value: string) => void;
  onParkingChange: (value: string) => void;
  onPropertyAgeChange: (value: string) => void;
  onMinAreaChange: (value: string) => void;
  onMaxAreaChange: (value: string) => void;
  onMinAreaCommit: () => void;
  onMaxAreaCommit: () => void;
  onAmenityChange: (slug: string, checked: boolean) => void;
  disabled?: boolean;
  variant?: "inline" | "sheet";
};

function AdvancedFiltersFields({
  bedrooms,
  bathrooms,
  parking,
  propertyAge,
  minArea,
  maxArea,
  selectedAmenities,
  onBedroomsChange,
  onBathroomsChange,
  onParkingChange,
  onPropertyAgeChange,
  onMinAreaChange,
  onMaxAreaChange,
  onMinAreaCommit,
  onMaxAreaCommit,
  onAmenityChange,
  disabled = false,
  variant = "inline",
}: AdvancedFiltersFieldsProps) {
  const selectedAmenitySet = new Set(selectedAmenities);
  const isSheet = variant === "sheet";

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
          <SelectDropdown
            label="Bedrooms"
            placeholder="All Rooms"
            value={bedrooms}
            options={BEDROOMS_OPTIONS}
            onChange={onBedroomsChange}
            disabled={disabled}
            variant="outline"
          />

          <SelectDropdown
            label="Bathrooms"
            placeholder="All Baths"
            value={bathrooms}
            options={BATHROOMS_OPTIONS}
            onChange={onBathroomsChange}
            disabled={disabled}
            variant="outline"
          />

          <SelectDropdown
            label="Parking"
            placeholder="All Parking"
            value={parking}
            options={PARKING_OPTIONS}
            onChange={onParkingChange}
            disabled={disabled}
            variant="outline"
          />

          <Input
            label="Min Area"
            placeholder="Min Area"
            value={minArea}
            onChange={(event) => onMinAreaChange(event.target.value)}
            onBlur={onMinAreaCommit}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onMinAreaCommit();
              }
            }}
            inputMode="numeric"
            disabled={disabled}
            variant="outline"
          />

          <Input
            label="Max Area"
            placeholder="Max Area"
            value={maxArea}
            onChange={(event) => onMaxAreaChange(event.target.value)}
            onBlur={onMaxAreaCommit}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onMaxAreaCommit();
              }
            }}
            inputMode="numeric"
            disabled={disabled}
            variant="outline"
          />

          <SelectDropdown
            label="Property Age"
            placeholder="Select Property Age"
            value={propertyAge}
            options={PROPERTY_AGE_OPTIONS}
            onChange={onPropertyAgeChange}
            disabled={disabled}
            variant="outline"
          />
        </div>
      </div>

      <div
        className={cn(
          "flex flex-wrap items-center gap-4",
          isSheet ? "px-4 pb-6 pt-3 sm:px-6" : "mt-3 md:mt-4",
        )}
      >
        {ADVANCED_AMENITY_OPTIONS.map((amenity) => {
          const checked = selectedAmenitySet.has(amenity.slug);

          return (
            <label
              key={amenity.slug}
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
                  onAmenityChange(amenity.slug, event.target.checked);
                }}
                className="size-4 shrink-0 rounded border-secondary/30 bg-surface text-secondary-dark accent-secondary-dark"
              />
              {amenity.label}
            </label>
          );
        })}
      </div>
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
  title = "Advanced Search",
  className,
  ...fieldsProps
}: PropertyListAdvancedFiltersProps) {
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
                    {title}
                  </DialogTitle>
                  <CloseButton
                    type="button"
                    aria-label="Close advanced search"
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
