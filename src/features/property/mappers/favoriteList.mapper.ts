import type {
  FavoriteListItem,
  FavoriteListResponse,
  PaginationMeta,
  PropertyListing,
} from "../types/property.types";
import { normalizePropertyListing } from "../utils/normalizePropertyListingStatus";

export function mapFavoriteListItem(item: FavoriteListItem): PropertyListing {
  const property = item.property;

  return normalizePropertyListing({
    ...property,
    agency: property.agency ?? undefined,
    agent: property.agent ?? undefined,
    owners: property.owners ?? [],
    is_favourite: true,
    favourite_id: item.id,
    property_hash: String(item.property_hash),
    user_id: item.user_id,
  });
}

export function mapFavoriteListItems(
  items: FavoriteListItem[] | undefined,
): PropertyListing[] {
  if (!items?.length) {
    return [];
  }

  return items.map(mapFavoriteListItem);
}

export function mapFavoriteListResponse(response: FavoriteListResponse): {
  items: PropertyListing[];
  meta: PaginationMeta | undefined;
} {
  const pagination = response.meta?.pagination;
  const data = response.data;

  if (pagination) {
    return {
      items: mapFavoriteListItems(data?.items),
      meta: pagination,
    };
  }

  if (!data) {
    return { items: [], meta: undefined };
  }

  return {
    items: mapFavoriteListItems(data.items),
    meta: {
      total: data.total ?? 0,
      page: data.page ?? 1,
      pageSize: data.pageSize ?? 10,
      totalPages: data.totalPages ?? 1,
      hasNext: data.hasNext ?? false,
      hasPrevious: data.hasPrevious ?? false,
    },
  };
}
