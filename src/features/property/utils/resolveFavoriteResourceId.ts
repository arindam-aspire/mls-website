import type { PropertyListing } from "../types/property.types";

/** Path segment for `DELETE /favorites/:propertyHash`. */
export function resolveFavoriteResourceId(item: PropertyListing): string {
  return item.property_hash ?? String(item.id);
}

/** Numeric hash for `POST /favorites` body. */
export function resolveFavoritePropertyHash(item: PropertyListing): number {
  return Number(resolveFavoriteResourceId(item));
}
