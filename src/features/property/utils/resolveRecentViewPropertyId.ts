import type { PropertyListing } from "../types/property.types";

type RecentViewHashSource = {
  property_hash_id?: number | string | null;
  property_hash?: number | string | null;
};

/** Rejects missing values and the literal strings produced by `String(undefined)`. */
export function normalizeRecentViewHashId(
  value: number | string | undefined | null,
): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  const normalized = String(value).trim();

  if (!normalized || normalized === "undefined" || normalized === "null") {
    return undefined;
  }

  return normalized;
}

/** Reads `property_hash_id` from the API item, with legacy `property_hash` fallback. */
export function resolveRecentViewHashIdFromApiItem(
  item: RecentViewHashSource,
): string | undefined {
  return (
    normalizeRecentViewHashId(item.property_hash_id) ??
    normalizeRecentViewHashId(item.property_hash)
  );
}

/** Path segment for `DELETE /users/recent-views/{propertyHashId}`. */
export function resolveRecentViewPropertyId(item: PropertyListing): string {
  const propertyHashId = normalizeRecentViewHashId(item.property_hash_id);

  if (propertyHashId) {
    return propertyHashId;
  }

  return String(item.id);
}
