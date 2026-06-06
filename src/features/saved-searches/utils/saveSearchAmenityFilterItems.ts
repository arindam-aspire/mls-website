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

export function isCombinedAmenityDisplayItem(item: SaveSearchFilterItem) {
  return item.key.startsWith("amenities:combined:");
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

/** Merges consecutive amenity rows in a visible slice for inline display. */
export function groupConsecutiveAmenityItemsForInline(
  items: SaveSearchFilterItem[],
): SaveSearchFilterItem[] {
  const result: SaveSearchFilterItem[] = [];
  let amenityGroup: SaveSearchFilterItem[] = [];

  const flushAmenities = () => {
    if (amenityGroup.length === 0) {
      return;
    }

    result.push({
      key: `amenities:combined:${amenityGroup.map((item) => item.key).join(",")}`,
      label: amenityGroup[0]!.label,
      value: amenityGroup.map((item) => item.value).join(" · "),
    });
    amenityGroup = [];
  };

  for (const item of items) {
    if (isAmenityFilterItem(item)) {
      amenityGroup.push(item);
    } else {
      flushAmenities();
      result.push(item);
    }
  }

  flushAmenities();
  return result;
}
