import { apiClient } from "@/src/apis/clients/api.client";
import { propertyEndpoints } from "@/src/apis/endpoints/propertyEndpoints";
import { userEndpoints } from "@/src/apis/endpoints/userEndpoints";
import type {
  AgentPropertiesListParams,
  AgentPropertiesListResponse,
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
  RecentViewAddBody,
  RecentViewAddResponse,
  RecentViewRemoveResponse,
  RecentViewsClearResponse,
  RecentViewsListParams,
  RecentViewsListResponse,
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

export async function getAgentProperties(
  params: AgentPropertiesListParams,
): Promise<AgentPropertiesListResponse> {
  return apiClient.request<AgentPropertiesListResponse>({
    endpoint: propertyEndpoints.AGENT_PROPERTIES(params),
    method: "GET",
    auth: true,
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

export async function getRecentViewsList(
  params: RecentViewsListParams,
): Promise<RecentViewsListResponse> {
  return apiClient.request<RecentViewsListResponse>({
    endpoint: userEndpoints.RECENT_VIEWS_LIST(params),
    method: "GET",
    auth: true,
  });
}

export async function addRecentView(
  body: RecentViewAddBody,
): Promise<RecentViewAddResponse> {
  return apiClient.request<RecentViewAddResponse>({
    endpoint: userEndpoints.RECENT_VIEWS,
    method: "POST",
    auth: true,
    body,
  });
}

export async function clearRecentViews(): Promise<RecentViewsClearResponse> {
  return apiClient.request<RecentViewsClearResponse>({
    endpoint: userEndpoints.RECENT_VIEWS,
    method: "DELETE",
    auth: true,
  });
}

export async function removeRecentView(
  propertyId: string | number,
): Promise<RecentViewRemoveResponse> {
  return apiClient.request<RecentViewRemoveResponse>({
    endpoint: userEndpoints.RECENT_VIEW_REMOVE(propertyId),
    method: "DELETE",
    auth: true,
  });
}
