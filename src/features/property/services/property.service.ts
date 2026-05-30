import { apiClient } from "@/src/apis/clients/api.client";
import { propertyEndpoints } from "@/src/apis/endpoints/propertyEndpoints";
import type {
  FeatureCatalogResponse,
  PropertyDetailsResponse,
  PropertyListParams,
  PropertyListResponse,
  PropertySimilarResponse,
} from "../types/property.types";

export async function getPropertyList(
  params: PropertyListParams,
): Promise<PropertyListResponse> {
  return apiClient.request<PropertyListResponse>({
    endpoint: propertyEndpoints.PROPERTY_LIST(params),
    method: "GET",
    auth: false,
  });
}

export async function getPropertyDetails(
  id: string,
): Promise<PropertyDetailsResponse> {
  return apiClient.request<PropertyDetailsResponse>({
    endpoint: propertyEndpoints.PROPERTY_DETAILS(id),
    method: "GET",
    auth: false,
  });
}

export async function getSimilarProperties(
  id: string,
): Promise<PropertySimilarResponse> {
  return apiClient.request<PropertySimilarResponse>({
    endpoint: propertyEndpoints.PROPERTY_SIMILAR(id),
    method: "GET",
    auth: false,
  });
}

export async function getPropertyFeatureCatalog(): Promise<FeatureCatalogResponse> {
  return apiClient.request<FeatureCatalogResponse>({
    endpoint: propertyEndpoints.FEATURE_CATALOG(),
    method: "GET",
    auth: false,
  });
}
