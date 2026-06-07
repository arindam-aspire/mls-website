import type {
  FavoriteListItem,
  PropertyListing,
} from "../types/property.types";

type FavoriteLookupEntry = {
  favourite_id: string;
  property_hash: string;
  user_id: string;
};

function addLookupKey(
  lookup: Map<string, FavoriteLookupEntry>,
  key: string | number | undefined | null,
  entry: FavoriteLookupEntry,
) {
  if (key === undefined || key === null || key === "") {
    return;
  }

  lookup.set(String(key), entry);
}

export function findFavoriteLookupEntry(
  lookup: Map<string, FavoriteLookupEntry>,
  ...keys: Array<string | number | undefined | null>
): FavoriteLookupEntry | undefined {
  for (const key of keys) {
    if (key === undefined || key === null || key === "") {
      continue;
    }

    const match = lookup.get(String(key));

    if (match) {
      return match;
    }
  }

  return undefined;
}

export function buildFavoriteLookup(
  items: FavoriteListItem[] | undefined,
): Map<string, FavoriteLookupEntry> {
  const lookup = new Map<string, FavoriteLookupEntry>();

  if (!items?.length) {
    return lookup;
  }

  for (const item of items) {
    const entry: FavoriteLookupEntry = {
      favourite_id: item.id,
      property_hash: String(item.property_hash),
      user_id: item.user_id,
    };

    addLookupKey(lookup, item.property_hash, entry);
    addLookupKey(lookup, item.property.id, entry);
    addLookupKey(lookup, item.property.property_id, entry);
  }

  return lookup;
}

function resolveFavoriteMatch(
  listing: PropertyListing,
  lookup: Map<string, FavoriteLookupEntry>,
): FavoriteLookupEntry | undefined {
  return (
    lookup.get(String(listing.id)) ??
    lookup.get(listing.property_hash ?? "") ??
    lookup.get(listing.property_id ?? "")
  );
}

export function applyFavoriteFlagsToListings(
  listings: PropertyListing[],
  lookup: Map<string, FavoriteLookupEntry>,
): PropertyListing[] {
  if (!lookup.size) {
    return listings;
  }

  return listings.map((listing) => {
    const match = resolveFavoriteMatch(listing, lookup);

    if (!match) {
      return listing;
    }

    return {
      ...listing,
      is_favourite: true,
      favourite_id: match.favourite_id,
      property_hash: match.property_hash,
      user_id: match.user_id,
    };
  });
}
