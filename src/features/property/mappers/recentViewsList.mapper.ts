import type {
  PaginationMeta,
  PropertyListing,
  RecentViewsListItem,
  RecentViewsListResponse,
} from "../types/property.types";
import { normalizePropertyListing } from "../utils/normalizePropertyListingStatus";
import { resolveRecentViewHashIdFromApiItem } from "../utils/resolveRecentViewPropertyId";

export function mapRecentViewsListItem(item: RecentViewsListItem): PropertyListing {
  const { agency: _agency, ...property } = item.property;
  const propertyHashId = resolveRecentViewHashIdFromApiItem(item);

  return normalizePropertyListing({
    ...property,
    is_favourite: false,
    ...(propertyHashId ? { property_hash_id: propertyHashId } : {}),
    user_id: item.user_id,
  });
}

export function mapRecentViewsListItems(
  items: RecentViewsListItem[] | undefined,
): PropertyListing[] {
  if (!items?.length) {
    return [];
  }

  return items.map(mapRecentViewsListItem);
}

export function mapRecentViewsListResponse(response: RecentViewsListResponse): {
  items: PropertyListing[];
  meta: PaginationMeta | undefined;
} {
  const pagination = response.meta?.pagination;
  const data = response.data;

  if (pagination) {
    return {
      items: mapRecentViewsListItems(data?.items),
      meta: pagination,
    };
  }

  if (!data) {
    return { items: [], meta: undefined };
  }

  return {
    items: mapRecentViewsListItems(data.items),
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
