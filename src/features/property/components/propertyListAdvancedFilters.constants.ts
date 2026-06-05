import type { SelectDropdownOption } from "@/src/components/ui";
import type { PropertyListParams } from "../types/property.types";

function numericSelectOptions(max: number): SelectDropdownOption[] {
  return Array.from({ length: max }, (_, index) => {
    const value = String(index + 1);

    return { value, label: value };
  });
}

export const ROOM_OPTIONS = numericSelectOptions(10);

export const BEDROOMS_OPTIONS = ROOM_OPTIONS;

export const BATHROOMS_OPTIONS = numericSelectOptions(10);

export const PARKING_OPTIONS: SelectDropdownOption[] = Array.from(
  { length: 6 },
  (_, index) => {
    const value = String(index);

    return { value, label: value };
  },
);

export const FLOOR_OPTIONS: SelectDropdownOption[] = [
  { value: "ground", label: "ground" },
  ...numericSelectOptions(10),
  { value: "penthouse", label: "penthouse" },
];

export const PROPERTY_AGE_OPTIONS: SelectDropdownOption[] = [
  { value: "new", label: "new" },
  { value: "1-5", label: "1-5" },
  { value: "5-10", label: "5-10" },
  { value: "10-20", label: "10-20" },
  { value: "20+", label: "20+" },
];

export const FURNITURE_STATUS_OPTIONS: SelectDropdownOption[] = [
  { value: "furnished", label: "furnished" },
  { value: "semi-furnished", label: "semi-furnished" },
  { value: "unfurnished", label: "unfurnished" },
];

export const ALL_AMENITY_SLUGS = [
  "alarmSystem",
  "parkingAvailable",
  "balcony",
  "builtInCloset",
  "garden",
  "homeAutomation",
  "gymAccess",
  "loadingAccess",
  "displayFrontage",
  "airConditioning",
  "storageArea",
  "roadAccess",
  "utilitiesAvailable",
  "zonedUse",
  "waterSource",
  "electricityNearby",
] as const;

export type AdvancedAmenitySlug = (typeof ALL_AMENITY_SLUGS)[number];

const AMENITY_SLUG_ALIASES: Record<string, AdvancedAmenitySlug> = {
  "alarm-system": "alarmSystem",
  "parking-available": "parkingAvailable",
};

const AMENITY_SLUG_SET = new Set<string>(ALL_AMENITY_SLUGS);

/** @deprecated Use ALL_AMENITY_SLUGS and isAmenityVisible instead. */
export const ADVANCED_AMENITY_OPTIONS = ALL_AMENITY_SLUGS.map((slug) => ({
  slug,
  label: slug,
}));

export const AMENITY_SLUGS = [...ALL_AMENITY_SLUGS];

export function normalizeAmenitySlug(slug: string): string {
  return AMENITY_SLUG_ALIASES[slug] ?? slug;
}

export function parseAmenitiesParam(value: string | undefined) {
  if (!value) {
    return new Set<string>();
  }

  return new Set(
    value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map(normalizeAmenitySlug)
      .filter((item) => AMENITY_SLUG_SET.has(item)),
  );
}

/** Canonical comma-separated camelCase slugs, e.g. `alarmSystem,parkingAvailable`. */
export function serializeAmenitiesParam(values: Set<string>) {
  const ordered = ALL_AMENITY_SLUGS.filter((slug) =>
    values.has(normalizeAmenitySlug(slug)),
  );

  if (ordered.length === 0) {
    return undefined;
  }

  return ordered.join(",");
}

export function normalizeAmenitiesParam(value: string | undefined) {
  return serializeAmenitiesParam(parseAmenitiesParam(value));
}

export function hasAdvancedFilters(params: PropertyListParams) {
  return Boolean(
    params.bedrooms != null ||
      params.rooms != null ||
      params.bathrooms != null ||
      params.parking != null ||
      params.propertyAge ||
      params.minArea != null ||
      params.maxArea != null ||
      params.minPlotArea != null ||
      params.maxPlotArea != null ||
      params.governorate ||
      params.directorate ||
      params.village ||
      params.parcelName ||
      params.furnitureStatus ||
      params.floorLevel ||
      params.amenities,
  );
}
