import { apiClient } from "@/src/apis/clients/api.client";
import { propertyEndpoints } from "@/src/apis/endpoints/propertyEndpoints";
import type {
  PropertyListParams,
  PropertyListResponse,
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
