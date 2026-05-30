"use client";

import {
  Button,
  Input,
  SelectDropdown,
  ToggleButton,
  type SelectDropdownOption,
  type ToggleButtonItem,
} from "@/src/components/ui";
import { Bookmark, MapPin, RotateCcw, SlidersHorizontal } from "lucide-react";

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
  onLocationChange: (value: string) => void;
  onLocationCommit: () => void;
  onResetSearch: () => void;
  onAdvanceSearch?: () => void;
  onSaveSearch?: () => void;
  statusAriaLabel?: string;
  categoryAriaLabel?: string;
  categoryPlaceholder?: string;
  typeAriaLabel?: string;
  typePlaceholder?: string;
  locationAriaLabel?: string;
  locationPlaceholder?: string;
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
  onLocationChange,
  onLocationCommit,
  onResetSearch,
  onAdvanceSearch,
  onSaveSearch,
  statusAriaLabel = "Listing status",
  categoryAriaLabel = "Property category",
  categoryPlaceholder = "Select category",
  typeAriaLabel = "Property type",
  typePlaceholder = "Select type",
  locationAriaLabel = "Location",
  locationPlaceholder = "Search location",
  disabled = false,
}: PropertyListFiltersProps) {
  return (
    <section className="grid w-full min-w-0 grid-cols-1 gap-2 md:gap-4 lg:grid-cols-8 lg:gap-6">
      <div className="col-span-1 grid min-w-0 grid-cols-1 items-center gap-2 md:grid-cols-4 md:gap-4 lg:col-span-5 lg:grid-cols-5 lg:gap-6">
        <ToggleButton
          className="col-span-1 w-full min-w-0"
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
          className="col-span-1 min-w-0"
          aria-label={categoryAriaLabel}
          placeholder={categoryPlaceholder}
          value={category}
          options={categoryOptions}
          onChange={onCategoryChange}
          disabled={disabled || categoryOptions.length === 0}
          variant="outline"
        />

        <SelectDropdown
          className="col-span-1 min-w-0"
          aria-label={typeAriaLabel}
          placeholder={typePlaceholder}
          value={type}
          options={typeOptions}
          onChange={onTypeChange}
          disabled={disabled || typeOptions.length === 0}
          variant="outline"
        />

        <Input
          className="col-span-1 min-w-0"
          aria-label={locationAriaLabel}
          placeholder={locationPlaceholder}
          value={location}
          onChange={(event) => onLocationChange(event.target.value)}
          onBlur={onLocationCommit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onLocationCommit();
            }
          }}
          iconEnd={<MapPin className="size-4" aria-hidden />}
          variant="outline"
          disabled={disabled}
        />
      </div>

      <div className="col-span-1 grid min-w-0 grid-cols-1 gap-2 md:grid-cols-3 md:gap-4 lg:col-span-3 lg:grid-cols-3 lg:gap-6">
        <Button
          type="button"
          color="primary"
          variant="solid"
          className="h-11 w-full rounded-lg"
          disabled={disabled}
          onClick={onAdvanceSearch}
          iconStart={<SlidersHorizontal className="size-4" aria-hidden />}
        >
          Advance Search
        </Button>
        <Button
          type="button"
          color="inherit"
          variant="outline"
          className="h-11 w-full rounded-lg"
          disabled={disabled}
          onClick={onResetSearch}
          iconStart={<RotateCcw className="size-4" aria-hidden />}
        >
          Reset Search
        </Button>
        <Button
          type="button"
          color="secondary"
          variant="outline"
          className="h-11 w-full rounded-lg"
          disabled={disabled}
          onClick={onSaveSearch}
          iconStart={<Bookmark className="size-4" aria-hidden />}
        >
          Save Search
        </Button>
      </div>
    </section>
  );
}
