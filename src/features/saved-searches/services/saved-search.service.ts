import { apiClient } from "@/src/apis/clients/api.client";
import { savedSearchEndpoints } from "@/src/apis/endpoints/savedSearchEndpoints";
import type {
  CreateSavedSearchRequest,
  CreateSavedSearchResponse,
  SavedSearchListParams,
  SavedSearchListResponse,
  UpdateSavedSearchRequest,
  UpdateSavedSearchResponse,
} from "../types/savedSearch.types";

export async function createSavedSearch(
  body: CreateSavedSearchRequest,
): Promise<CreateSavedSearchResponse> {
  return apiClient.request<CreateSavedSearchResponse>({
    endpoint: savedSearchEndpoints.CREATE,
    method: "POST",
    body,
    auth: true,
  });
}

export async function getSavedSearches(
  params: SavedSearchListParams,
): Promise<SavedSearchListResponse> {
  return apiClient.request<SavedSearchListResponse>({
    endpoint: savedSearchEndpoints.LIST(params),
    method: "GET",
    auth: true,
  });
}

export async function getSavedSearchById(
  id: string,
): Promise<CreateSavedSearchResponse> {
  return apiClient.request<CreateSavedSearchResponse>({
    endpoint: savedSearchEndpoints.DETAIL(id),
    method: "GET",
    auth: true,
  });
}

export async function updateSavedSearch(
  id: string,
  body: UpdateSavedSearchRequest,
): Promise<UpdateSavedSearchResponse> {
  return apiClient.request<UpdateSavedSearchResponse>({
    endpoint: savedSearchEndpoints.UPDATE(id),
    method: "PATCH",
    body,
    auth: true,
  });
}

export async function deleteSavedSearch(
  id: string,
): Promise<UpdateSavedSearchResponse> {
  return apiClient.request<UpdateSavedSearchResponse>({
    endpoint: savedSearchEndpoints.DELETE(id),
    method: "DELETE",
    auth: true,
  });
}
