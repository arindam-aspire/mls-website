import {
  createListingStatus,
  PROPERTY_LISTING_STATUS_KEYS,
  type PropertyListingStatus,
  type PropertyListingStatusKey,
} from "@abdoun/abdoun-library";

function resolveStatusKey(statusSlug: string): PropertyListingStatusKey {
  if (
    PROPERTY_LISTING_STATUS_KEYS.includes(statusSlug as PropertyListingStatusKey)
  ) {
    return statusSlug as PropertyListingStatusKey;
  }

  return "draft";
}

export function normalizePropertyListingStatus(
  status: string | PropertyListingStatus,
  label?: string,
): PropertyListingStatus {
  if (typeof status === "object" && status !== null && "key" in status) {
    return status;
  }

  const slug = typeof status === "string" && status.length > 0 ? status : "draft";

  return createListingStatus(resolveStatusKey(slug), label ?? slug);
}

export function normalizePropertyListing<
  T extends { status: string | PropertyListingStatus },
>(listing: T): Omit<T, "status"> & { status: PropertyListingStatus } {
  return {
    ...listing,
    status: normalizePropertyListingStatus(listing.status),
  };
}
