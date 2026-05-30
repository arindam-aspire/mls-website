import type { SelectDropdownOption } from "@/src/components/ui";

function numericSelectOptions(max: number): SelectDropdownOption[] {
  return Array.from({ length: max }, (_, index) => {
    const value = String(index + 1);

    return { value, label: value };
  });
}

export const BEDROOMS_OPTIONS = numericSelectOptions(10);

export const BATHROOMS_OPTIONS = numericSelectOptions(10);

export const PARKING_OPTIONS = numericSelectOptions(5);

export const PROPERTY_AGE_OPTIONS: SelectDropdownOption[] = [
  { value: "new", label: "New" },
  { value: "1-5", label: "1-5 years" },
  { value: "5-10", label: "5-10 years" },
  { value: "10-20", label: "10-20 years" },
  { value: "20+", label: "20+ years" },
];

export const ADVANCED_AMENITY_OPTIONS = [
  { slug: "alarm-system", label: "Alarm System" },
  { slug: "parking-available", label: "Parking Available" },
] as const;

export const AMENITY_SLUGS = ADVANCED_AMENITY_OPTIONS.map(
  (option) => option.slug,
);

const AMENITY_SLUG_SET = new Set<string>(AMENITY_SLUGS);

export function parseAmenitiesParam(value: string | undefined) {
  if (!value) {
    return new Set<string>();
  }

  return new Set(
    value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => AMENITY_SLUG_SET.has(item)),
  );
}

/** Canonical comma-separated slugs, e.g. `alarm-system,parking-available`. */
export function serializeAmenitiesParam(values: Set<string>) {
  const ordered = AMENITY_SLUGS.filter((slug) => values.has(slug));

  if (ordered.length === 0) {
    return undefined;
  }

  return ordered.join(",");
}

export function normalizeAmenitiesParam(value: string | undefined) {
  return serializeAmenitiesParam(parseAmenitiesParam(value));
}

export function hasAdvancedFilters(params: {
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  propertyAge?: string;
  minArea?: number;
  maxArea?: number;
  amenities?: string;
}) {
  return Boolean(
    params.bedrooms != null ||
      params.bathrooms != null ||
      params.parking != null ||
      params.propertyAge ||
      params.minArea != null ||
      params.maxArea != null ||
      params.amenities,
  );
}
