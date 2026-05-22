/**
 * Public API routes (no authentication required).
 * Paths are relative to `NEXT_PUBLIC_API_BASE_URL`.
 */
export const publicEndpoints = {
  health: "/health",

  properties: {
    list: "/properties",
    search: "/properties/search",
    byId: (id: string | number) => `/properties/${id}`,
  },

  lookups: {
    locations: "/locations",
    propertyTypes: "/property-types",
    listingTypes: "/listing-types",
  },
} as const;

export type PublicEndpoints = typeof publicEndpoints;
