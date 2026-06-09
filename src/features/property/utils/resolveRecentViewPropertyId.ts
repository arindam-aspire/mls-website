import type { PropertyListing } from "../types/property.types";

/** Path segment for `DELETE /users/recent-views/{propertyId}`. */
export function resolveRecentViewPropertyId(item: PropertyListing): string {
  return item.property_hash ?? String(item.id);
}
