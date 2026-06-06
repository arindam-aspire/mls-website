import { SELECT_DROPDOWN_EMPTY_VALUE } from "@/src/components/ui";
import type { ToggleButtonItem } from "@/src/components/ui";
import type { SelectDropdownOption } from "@/src/components/ui";
import type { ReactNode } from "react";
import {
  BATHROOMS_OPTIONS,
  BEDROOMS_OPTIONS,
  FLOOR_OPTIONS,
  FURNITURE_STATUS_OPTIONS,
  PARKING_OPTIONS,
  PROPERTY_AGE_OPTIONS,
  ROOM_OPTIONS,
} from "@/src/features/property/components/propertyListAdvancedFilters.constants";
import type { SaveSearchFilterItem } from "../types/savedSearch.types";
import {
  appendAmenityFilterItems,
  humanizeAmenitySlug,
} from "./saveSearchAmenityFilterItems";

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
  | "filterLabels.plotArea"
  | "filterLabels.governorate"
  | "filterLabels.directorate"
  | "filterLabels.village"
  | "filterLabels.parcelName"
  | "filterLabels.amenities"
  | "filterLabels.rooms"
  | "filterLabels.floorLevel"
  | "filterLabels.furnitureStatus";

function resolveOptionLabel(
  value: string,
  options: { value: string; label: string | ReactNode }[],
) {
  if (!value || value === SELECT_DROPDOWN_EMPTY_VALUE) {
    return null;
  }

  const matched = options.find((option) => option.value === value);

  if (!matched) {
    return value;
  }

  return typeof matched.label === "string" ? matched.label : value;
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
  resolveAmenityLabel: (slug: string) => string = humanizeAmenitySlug,
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

  const roomsLabel = resolveOptionLabel(input.rooms, ROOM_OPTIONS);
  if (roomsLabel) {
    items.push({
      key: "rooms",
      label: t("filterLabels.rooms"),
      value: roomsLabel,
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

  const plotAreaLabel = formatAreaRange(input.minPlotArea, input.maxPlotArea);
  if (plotAreaLabel) {
    items.push({
      key: "plotArea",
      label: t("filterLabels.plotArea"),
      value: plotAreaLabel,
    });
  }

  if (input.governorate.trim()) {
    items.push({
      key: "governorate",
      label: t("filterLabels.governorate"),
      value: input.governorate.trim(),
    });
  }

  if (input.directorate.trim()) {
    items.push({
      key: "directorate",
      label: t("filterLabels.directorate"),
      value: input.directorate.trim(),
    });
  }

  if (input.village.trim()) {
    items.push({
      key: "village",
      label: t("filterLabels.village"),
      value: input.village.trim(),
    });
  }

  if (input.parcelName.trim()) {
    items.push({
      key: "parcelName",
      label: t("filterLabels.parcelName"),
      value: input.parcelName.trim(),
    });
  }

  const floorLevelLabel = resolveOptionLabel(input.floorLevel, FLOOR_OPTIONS);
  if (floorLevelLabel) {
    items.push({
      key: "floorLevel",
      label: t("filterLabels.floorLevel"),
      value: floorLevelLabel,
    });
  }

  const furnitureLabel = resolveOptionLabel(
    input.furnitureStatus,
    FURNITURE_STATUS_OPTIONS,
  );
  if (furnitureLabel) {
    items.push({
      key: "furnitureStatus",
      label: t("filterLabels.furnitureStatus"),
      value: furnitureLabel,
    });
  }

  if (input.selectedAmenities.length > 0) {
    appendAmenityFilterItems(
      items,
      input.selectedAmenities,
      t("filterLabels.amenities"),
      resolveAmenityLabel,
    );
  }

  return items;
}
