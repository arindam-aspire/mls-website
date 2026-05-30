import type { PropertyListParams } from "@/src/features/property/types/property.types";

function appendOptionalParam(
  search: URLSearchParams,
  key: string,
  value: string | number | undefined,
) {
  if (value === undefined || value === "") {
    return;
  }

  search.set(key, String(value));
}

export const propertyEndpoints = {
  PROPERTY_LIST: (params: PropertyListParams): string => {
    const search = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
      category: params.category,
      status: params.status,
    });

    appendOptionalParam(search, "sort", params.sort);
    appendOptionalParam(search, "type", params.type);
    appendOptionalParam(search, "location", params.location);
    appendOptionalParam(search, "budgetMin", params.budgetMin);
    appendOptionalParam(search, "budgetMax", params.budgetMax);
    appendOptionalParam(search, "furnitureStatus", params.furnitureStatus);
    appendOptionalParam(search, "bedrooms", params.bedrooms);
    appendOptionalParam(search, "bathrooms", params.bathrooms);
    appendOptionalParam(search, "parking", params.parking);
    appendOptionalParam(search, "propertyAge", params.propertyAge);
    appendOptionalParam(search, "minArea", params.minArea);
    appendOptionalParam(search, "maxArea", params.maxArea);
    appendOptionalParam(search, "amenities", params.amenities);
    appendOptionalParam(search, "similar_to", params.similar_to);

    return `/properties?${search.toString()}`;
  },
  PROPERTY_DETAILS: (id: string): string => `/properties/${encodeURIComponent(id)}`,
  PROPERTY_SIMILAR: (id: string): string =>
    `/properties/${encodeURIComponent(id)}/similar`,
  FEATURE_CATALOG: (): string => {
    const search = new URLSearchParams({ is_active: "true" });

    return `/features?${search.toString()}`;
  },
} as const;
