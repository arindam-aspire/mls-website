import { PROPERTY_AGE_OPTIONS } from "@/src/features/property/constants/propertyListAdvancedFilters.constants";
import type {
  SavedSearchCriteria,
  SaveSearchFilterItem,
} from "../types/savedSearch.types";
import {
  appendAmenityFilterItems,
  humanizeAmenitySlug,
  parseAmenitySlugs,
} from "./saveSearchAmenityFilterItems";

type CriteriaLabelKey =
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

const STATUS_LABELS: Record<string, string> = {
  buy: "Buy",
  rent: "Rent",
};

const AMENITY_LABELS: Record<string, string> = {
  "alarm-system": "Alarm System",
  alarmSystem: "Alarm System",
  "parking-available": "Parking Available",
  parkingAvailable: "Parking Available",
  balcony: "Balcony",
  builtInCloset: "Built-in closet",
  garden: "Garden",
  homeAutomation: "Home automation",
  gymAccess: "Gym access",
  loadingAccess: "Loading access",
  displayFrontage: "Display frontage",
  airConditioning: "Air conditioning",
  storageArea: "Storage area",
  roadAccess: "Road access",
  utilitiesAvailable: "Utilities available",
  zonedUse: "Zoned use",
  waterSource: "Water source",
  electricityNearby: "Electricity nearby",
};

const COMBINED_KEYS = new Set([
  "budgetMin",
  "budgetMax",
  "minArea",
  "maxArea",
  "minPlotArea",
  "maxPlotArea",
  "city",
  "locations",
]);

function humanizeToken(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatRange(min?: string, max?: string) {
  const minTrimmed = min?.trim();
  const maxTrimmed = max?.trim();

  if (minTrimmed && maxTrimmed) {
    return `${minTrimmed} – ${maxTrimmed}`;
  }

  return minTrimmed || maxTrimmed || null;
}

function formatLocation(criteria: SavedSearchCriteria) {
  const city = criteria.city?.trim();
  const locations = criteria.locations?.trim();
  const location = criteria.location?.trim();

  if (city && locations) {
    return `${city}, ${locations}`;
  }

  return city || locations || location || null;
}

function resolveAmenityLabelFromMap(slug: string) {
  return AMENITY_LABELS[slug] ?? humanizeAmenitySlug(slug);
}

function resolvePropertyAgeLabel(value: string) {
  return (
    PROPERTY_AGE_OPTIONS.find((option) => option.value === value)?.label ??
    humanizeToken(value)
  );
}

function pushItem(
  items: SaveSearchFilterItem[],
  key: string,
  label: string,
  value: string | null | undefined,
) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return;
  }

  items.push({ key, label, value: trimmed });
}

export function buildSavedSearchCriteriaFilterItems(
  criteria: SavedSearchCriteria,
  t: (key: CriteriaLabelKey) => string,
  resolveAmenityLabel: (slug: string) => string = resolveAmenityLabelFromMap,
): SaveSearchFilterItem[] {
  const items: SaveSearchFilterItem[] = [];

  pushItem(
    items,
    "status",
    t("filterLabels.status"),
    criteria.status
      ? (STATUS_LABELS[criteria.status] ?? humanizeToken(criteria.status))
      : null,
  );

  pushItem(
    items,
    "category",
    t("filterLabels.category"),
    criteria.category ? humanizeToken(criteria.category) : null,
  );

  pushItem(
    items,
    "type",
    t("filterLabels.type"),
    criteria.type ? humanizeToken(criteria.type) : null,
  );

  pushItem(items, "location", t("filterLabels.location"), formatLocation(criteria));

  pushItem(
    items,
    "budget",
    t("filterLabels.budget"),
    formatRange(criteria.budgetMin, criteria.budgetMax),
  );

  pushItem(items, "bedrooms", t("filterLabels.bedrooms"), criteria.bedrooms);
  pushItem(items, "bathrooms", t("filterLabels.bathrooms"), criteria.bathrooms);
  pushItem(items, "parking", t("filterLabels.parking"), criteria.parking);

  pushItem(
    items,
    "propertyAge",
    t("filterLabels.propertyAge"),
    criteria.propertyAge
      ? resolvePropertyAgeLabel(criteria.propertyAge)
      : null,
  );

  pushItem(
    items,
    "area",
    t("filterLabels.area"),
    formatRange(criteria.minArea, criteria.maxArea),
  );

  pushItem(
    items,
    "plotArea",
    t("filterLabels.plotArea"),
    formatRange(criteria.minPlotArea, criteria.maxPlotArea),
  );

  pushItem(items, "governorate", t("filterLabels.governorate"), criteria.governorate);
  pushItem(items, "directorate", t("filterLabels.directorate"), criteria.directorate);
  pushItem(items, "village", t("filterLabels.village"), criteria.village);
  pushItem(items, "parcelName", t("filterLabels.parcelName"), criteria.parcelName);

  pushItem(
    items,
    "rooms",
    t("filterLabels.rooms"),
    criteria.rooms,
  );

  pushItem(
    items,
    "floorLevel",
    t("filterLabels.floorLevel"),
    criteria.floorLevel,
  );

  pushItem(
    items,
    "furnitureStatus",
    t("filterLabels.furnitureStatus"),
    criteria.furnitureStatus
      ? humanizeToken(criteria.furnitureStatus)
      : null,
  );

  if (criteria.amenities?.trim()) {
    appendAmenityFilterItems(
      items,
      parseAmenitySlugs(criteria.amenities),
      t("filterLabels.amenities"),
      resolveAmenityLabel,
    );
  }

  const handledKeys = new Set([
    "status",
    "category",
    "type",
    "location",
    "city",
    "locations",
    "budgetMin",
    "budgetMax",
    "bedrooms",
    "bathrooms",
    "parking",
    "propertyAge",
    "minArea",
    "maxArea",
    "minPlotArea",
    "maxPlotArea",
    "governorate",
    "directorate",
    "village",
    "parcelName",
    "rooms",
    "floorLevel",
    "furnitureStatus",
    "amenities",
  ]);

  for (const [key, rawValue] of Object.entries(criteria)) {
    if (handledKeys.has(key) || COMBINED_KEYS.has(key)) {
      continue;
    }

    if (typeof rawValue !== "string") {
      continue;
    }

    pushItem(items, key, humanizeToken(key), humanizeToken(rawValue));
  }

  return items;
}
