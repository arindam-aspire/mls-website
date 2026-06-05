import { normalizeAmenitySlug } from "@/src/features/property/components/propertyListAdvancedFilters.constants";
import type { SaveSearchFilterItem } from "../types/savedSearch.types";

export function humanizeAmenitySlug(slug: string) {
  return slug
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function parseAmenitySlugs(value: string | undefined) {
  if (!value?.trim()) {
    return [];
  }

  return value
    .split(",")
    .map((item) => normalizeAmenitySlug(item.trim()))
    .filter(Boolean);
}

export function appendAmenityFilterItems(
  items: SaveSearchFilterItem[],
  slugs: string[],
  amenitiesLabel: string,
  resolveLabel: (slug: string) => string,
) {
  for (const rawSlug of slugs) {
    const slug = normalizeAmenitySlug(rawSlug);

    items.push({
      key: `amenity:${slug}`,
      label: amenitiesLabel,
      value: resolveLabel(slug),
    });
  }
}

export function isAmenityFilterItem(item: SaveSearchFilterItem) {
  return item.key.startsWith("amenity:");
}

export function partitionSaveSearchFilterItems(items: SaveSearchFilterItem[]) {
  const standardItems: SaveSearchFilterItem[] = [];
  const amenityItems: SaveSearchFilterItem[] = [];

  for (const item of items) {
    if (isAmenityFilterItem(item)) {
      amenityItems.push(item);
    } else {
      standardItems.push(item);
    }
  }

  return { standardItems, amenityItems };
}
