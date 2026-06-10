import { authClient } from "@/src/apis/clients/api.client";
import { publicEndpoints } from "@/src/apis/endpoints/publicEndpoints";
import type { LocationTaxonomyResponse } from "@/src/features/landing/types/locationTaxonomy.types";
import type { PropertyTaxonomyResponse } from "@/src/features/landing/types/propertyTaxonomy.types";

export async function getPropertyTaxonomy(): Promise<PropertyTaxonomyResponse> {
  return authClient.request<PropertyTaxonomyResponse>({
    endpoint: publicEndpoints.PROPERTY_TAXONOMY,
    method: "GET",
  });
}

export async function getLocationTaxonomy(): Promise<LocationTaxonomyResponse> {
  return authClient.request<LocationTaxonomyResponse>({
    endpoint: publicEndpoints.LOCATION_TAXONOMY,
    method: "GET",
  });
}
