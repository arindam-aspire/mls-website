import { SELECT_DROPDOWN_EMPTY_VALUE } from "@/src/components/ui";
import type { ToggleButtonItem } from "@/src/components/ui";
import type { SelectDropdownOption } from "@/src/components/ui";
import {
  ADVANCED_AMENITY_OPTIONS,
  BATHROOMS_OPTIONS,
  BEDROOMS_OPTIONS,
  PARKING_OPTIONS,
  PROPERTY_AGE_OPTIONS,
} from "@/src/features/property/components/propertyListAdvancedFilters.constants";
import type { SaveSearchFilterItem } from "../types/savedSearch.types";

export type BuildSaveSearchFilterItemsInput = {
  status: string;
  statusOptions: ToggleButtonItem[];
  category: string;
  categoryOptions: SelectDropdownOption[];
  type: string;
  typeOptions: SelectDropdownOption[];
  location: string;
  locationValue?: string;
  locationOptions: { value: string; label: string }[];
  budgetMin: string;
  budgetMax: string;
  bedrooms: string;
  bathrooms: string;
  parking: string;
  propertyAge: string;
  minArea: string;
  maxArea: string;
  selectedAmenities: string[];
};

type FilterLabelKey =
  | "filterLabels.status"
  | "filterLabels.category"
  | "filterLabels.type"
  | "filterLabels.location"
  | "filterLabels.budget"
  | "filterLabels.bedrooms"
  | "filterLabels.bathrooms"
  | "filterLabels.parking"
  | "filterLabels.propertyAge"
  | "filterLabels.area"
  | "filterLabels.amenities";

function resolveOptionLabel(
  value: string,
  options: { value: string; label: string }[],
) {
  if (!value || value === SELECT_DROPDOWN_EMPTY_VALUE) {
    return null;
  }

  return options.find((option) => option.value === value)?.label ?? value;
}

function formatBudgetRange(min: string, max: string) {
  const minTrimmed = min.trim();
  const maxTrimmed = max.trim();

  if (minTrimmed && maxTrimmed) {
    return `${minTrimmed} – ${maxTrimmed}`;
  }

  if (minTrimmed) {
    return minTrimmed;
  }

  if (maxTrimmed) {
    return maxTrimmed;
  }

  return null;
}

function formatAreaRange(min: string, max: string) {
  const minTrimmed = min.trim();
  const maxTrimmed = max.trim();

  if (minTrimmed && maxTrimmed) {
    return `${minTrimmed} – ${maxTrimmed}`;
  }

  if (minTrimmed) {
    return minTrimmed;
  }

  if (maxTrimmed) {
    return maxTrimmed;
  }

  return null;
}

export function buildSaveSearchFilterItems(
  input: BuildSaveSearchFilterItemsInput,
  t: (key: FilterLabelKey) => string,
): SaveSearchFilterItem[] {
  const items: SaveSearchFilterItem[] = [];

  const statusLabel = resolveOptionLabel(input.status, input.statusOptions);
  if (statusLabel) {
    items.push({
      key: "status",
      label: t("filterLabels.status"),
      value: statusLabel,
    });
  }

  const categoryLabel = resolveOptionLabel(
    input.category,
    input.categoryOptions,
  );
  if (categoryLabel) {
    items.push({
      key: "category",
      label: t("filterLabels.category"),
      value: categoryLabel,
    });
  }

  const typeLabel = resolveOptionLabel(input.type, input.typeOptions);
  if (typeLabel) {
    items.push({
      key: "type",
      label: t("filterLabels.type"),
      value: typeLabel,
    });
  }

  const locationLabel =
    input.locationOptions.find(
      (option) => option.value === input.locationValue,
    )?.label ?? input.location.trim();

  if (locationLabel) {
    items.push({
      key: "location",
      label: t("filterLabels.location"),
      value: locationLabel,
    });
  }

  const budgetLabel = formatBudgetRange(input.budgetMin, input.budgetMax);
  if (budgetLabel) {
    items.push({
      key: "budget",
      label: t("filterLabels.budget"),
      value: budgetLabel,
    });
  }

  const bedroomsLabel = resolveOptionLabel(
    input.bedrooms,
    BEDROOMS_OPTIONS,
  );
  if (bedroomsLabel) {
    items.push({
      key: "bedrooms",
      label: t("filterLabels.bedrooms"),
      value: bedroomsLabel,
    });
  }

  const bathroomsLabel = resolveOptionLabel(
    input.bathrooms,
    BATHROOMS_OPTIONS,
  );
  if (bathroomsLabel) {
    items.push({
      key: "bathrooms",
      label: t("filterLabels.bathrooms"),
      value: bathroomsLabel,
    });
  }

  const parkingLabel = resolveOptionLabel(input.parking, PARKING_OPTIONS);
  if (parkingLabel) {
    items.push({
      key: "parking",
      label: t("filterLabels.parking"),
      value: parkingLabel,
    });
  }

  const propertyAgeLabel = resolveOptionLabel(
    input.propertyAge,
    PROPERTY_AGE_OPTIONS,
  );
  if (propertyAgeLabel) {
    items.push({
      key: "propertyAge",
      label: t("filterLabels.propertyAge"),
      value: propertyAgeLabel,
    });
  }

  const areaLabel = formatAreaRange(input.minArea, input.maxArea);
  if (areaLabel) {
    items.push({
      key: "area",
      label: t("filterLabels.area"),
      value: areaLabel,
    });
  }

  if (input.selectedAmenities.length > 0) {
    const amenityLabels = input.selectedAmenities
      .map(
        (slug) =>
          ADVANCED_AMENITY_OPTIONS.find((option) => option.slug === slug)
            ?.label ?? slug,
      )
      .join(", ");

    items.push({
      key: "amenities",
      label: t("filterLabels.amenities"),
      value: amenityLabels,
    });
  }

  return items;
}
