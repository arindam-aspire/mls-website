import { apiClient } from "@/src/apis/clients/api.client";
import { propertyEndpoints } from "@/src/apis/endpoints/propertyEndpoints";
import type {
  FavoriteAddBody,
  FavoriteAddResponse,
  FavoriteListParams,
  FavoriteListResponse,
  FavoriteRemoveResponse,
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

export async function getFavoriteList(
  params: FavoriteListParams,
): Promise<FavoriteListResponse> {
  return apiClient.request<FavoriteListResponse>({
    endpoint: propertyEndpoints.FAVORITE_LIST(params),
    method: "GET",
    auth: true,
  });
}

export async function getAllFavorites(): Promise<FavoriteListResponse> {
  return apiClient.request<FavoriteListResponse>({
    endpoint: propertyEndpoints.FAVORITES_ALL(),
    method: "GET",
    auth: true,
  });
}

export async function addFavorite(
  body: FavoriteAddBody,
): Promise<FavoriteAddResponse> {
  return apiClient.request<FavoriteAddResponse>({
    endpoint: propertyEndpoints.FAVORITES_ALL(),
    method: "POST",
    auth: true,
    body,
  });
}

export async function removeFavorite(
  propertyHash: string | number,
): Promise<FavoriteRemoveResponse> {
  return apiClient.request<FavoriteRemoveResponse>({
    endpoint: propertyEndpoints.FAVORITE_REMOVE(propertyHash),
    method: "DELETE",
    auth: true,
  });
}
