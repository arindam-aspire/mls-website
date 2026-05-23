import { authClient } from "@/src/apis/clients/api.client";
import { publicEndpoints } from "@/src/apis/endpoints/publicEndpoints";
import type { PropertyTaxonomyResponse } from "@/src/features/landing/types/propertyTaxonomy.types";

export async function getPropertyTaxonomy(): Promise<PropertyTaxonomyResponse> {
  return authClient.request<PropertyTaxonomyResponse>({
    endpoint: publicEndpoints.CATEGORY_PROPERTY_LIST,
    method: "GET",
  });
}
