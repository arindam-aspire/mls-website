import type {
  AgentPropertiesListParams,
  AgentPropertyDraftsListParams,
  PropertyListParams,
} from "@/src/features/property/types/property.types";

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
    appendOptionalParam(search, "city", params.city);
    appendOptionalParam(search, "locations", params.locations);
    appendOptionalParam(search, "budgetMin", params.budgetMin);
    appendOptionalParam(search, "budgetMax", params.budgetMax);
    appendOptionalParam(search, "furnitureStatus", params.furnitureStatus);
    appendOptionalParam(search, "bedrooms", params.bedrooms);
    appendOptionalParam(search, "rooms", params.rooms);
    appendOptionalParam(search, "bathrooms", params.bathrooms);
    appendOptionalParam(search, "parking", params.parking);
    appendOptionalParam(search, "propertyAge", params.propertyAge);
    appendOptionalParam(search, "floorLevel", params.floorLevel);
    appendOptionalParam(search, "minArea", params.minArea);
    appendOptionalParam(search, "maxArea", params.maxArea);
    appendOptionalParam(search, "minPlotArea", params.minPlotArea);
    appendOptionalParam(search, "maxPlotArea", params.maxPlotArea);
    appendOptionalParam(search, "governorate", params.governorate);
    appendOptionalParam(search, "directorate", params.directorate);
    appendOptionalParam(search, "village", params.village);
    appendOptionalParam(search, "parcelName", params.parcelName);
    appendOptionalParam(search, "amenities", params.amenities);
    appendOptionalParam(search, "similar_to", params.similar_to);
    appendOptionalParam(search, "savedSearchId", params.savedSearchId);

    return `/properties?${search.toString()}`;
  },
  PROPERTY_DETAILS: (id: string): string => `/properties/${encodeURIComponent(id)}`,
  PROPERTY_SIMILAR: (id: string): string =>
    `/properties/${encodeURIComponent(id)}/similar`,
  FEATURE_CATALOG: (): string => {
    const search = new URLSearchParams({ is_active: "true" });

    return `/features?${search.toString()}`;
  },
  FAVORITE_LIST: (params: { page: number; pageSize: number }): string => {
    const search = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
    });

    return `/favorites?${search.toString()}`;
  },
  FAVORITES_ALL: (): string => "/favorites",
  FAVORITE_REMOVE: (propertyHash: string | number): string =>
    `/favorites/${encodeURIComponent(String(propertyHash))}`,
  AGENT_PROPERTIES: (params: AgentPropertiesListParams): string => {
    const search = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
    });

    appendOptionalParam(search, "search", params.search);
    appendOptionalParam(search, "status", params.status);

    for (const [key, value] of Object.entries(params)) {
      if (
        key === "page" ||
        key === "pageSize" ||
        key === "search" ||
        key === "status"
      ) {
        continue;
      }

      appendOptionalParam(search, key, value);
    }

    return `/agent-properties?${search.toString()}`;
  },
  AGENT_PROPERTY_DRAFTS: (params: AgentPropertyDraftsListParams): string => {
    const search = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
    });

    return `/agent-properties/drafts?${search.toString()}`;
  },
  PROPERTY_SUBMISSIONS: (): string => "/property-submissions",
  PROPERTY_SUBMISSION_BY_ID: (submissionId: string): string =>
    `/property-submissions/${encodeURIComponent(submissionId)}`,
  PROPERTY_SUBMISSION_SUBMIT: (submissionId: string): string =>
    `/property-submissions/${encodeURIComponent(submissionId)}/submit`,
} as const;
