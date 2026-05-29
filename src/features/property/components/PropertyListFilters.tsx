"use client";

import { Button } from "@/src/components/ui/button";
import {
  SelectDropdown,
  type SelectDropdownOption,
} from "@/src/components/ui/select-dropdown";

export type PropertyLayoutVariant = "grid" | "list";

interface PropertyListFiltersProps {
  status: string;
  category: string;
  sortBy: string;
  layoutVariant: PropertyLayoutVariant;
  statusOptions: SelectDropdownOption[];
  categoryOptions: SelectDropdownOption[];
  sortOptions: SelectDropdownOption[];
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onLayoutVariantChange: (value: PropertyLayoutVariant) => void;
  onApplyFilters?: () => void;
  onResetFilters?: () => void;
}

export function PropertyListFilters({
  status,
  category,
  sortBy,
  layoutVariant,
  statusOptions,
  categoryOptions,
  sortOptions,
  onStatusChange,
  onCategoryChange,
  onSortChange,
  onLayoutVariantChange,
  onApplyFilters,
  onResetFilters,
}: PropertyListFiltersProps) {
  return (
    <section className="rounded-xl border border-secondary/15 bg-surface p-4 sm:p-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <SelectDropdown
          label="Status"
          placeholder="Select status"
          value={status}
          options={statusOptions}
          onChange={onStatusChange}
          fullWidth
        />
        <SelectDropdown
          label="Category"
          placeholder="Select category"
          value={category}
          options={categoryOptions}
          onChange={onCategoryChange}
          fullWidth
        />
        <SelectDropdown
          label="Sort by"
          placeholder="Sort properties"
          value={sortBy}
          options={sortOptions}
          onChange={onSortChange}
          fullWidth
        />

        <div className="flex items-end gap-2">
          <Button
            type="button"
            color={layoutVariant === "grid" ? "primary" : "inherit"}
            variant={layoutVariant === "grid" ? "solid" : "outline"}
            className="h-11 flex-1"
            onClick={() => onLayoutVariantChange("grid")}
          >
            Grid
          </Button>
          <Button
            type="button"
            color={layoutVariant === "list" ? "primary" : "inherit"}
            variant={layoutVariant === "list" ? "solid" : "outline"}
            className="h-11 flex-1"
            onClick={() => onLayoutVariantChange("list")}
          >
            List
          </Button>
        </div>

        <div className="flex items-end gap-2">
          <Button
            type="button"
            color="inherit"
            variant="outline"
            className="h-11 flex-1"
            onClick={onResetFilters}
          >
            Reset
          </Button>
          <Button
            type="button"
            color="primary"
            variant="solid"
            className="h-11 flex-1"
            onClick={onApplyFilters}
          >
            Apply
          </Button>
        </div>
      </div>
    </section>
  );
}
