import type { PropertyListParams } from "@/src/features/property/types/property.types";

export const propertyEndpoints = {
  PROPERTY_LIST: (params: PropertyListParams): string => {
    const search = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
      category: params.category,
      status: params.status,
    });
    return `/properties?${search.toString()}`;
  },
} as const;
