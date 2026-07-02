import { apiClient } from "@/src/apis/clients/api.client";
import { tokenStore } from "@/src/apis/core/token.store";
import { propertyEndpoints } from "@/src/apis/endpoints/propertyEndpoints";
import { userEndpoints } from "@/src/apis/endpoints/userEndpoints";
import type {
  PropertyDraftSubmissionRequestBody,
  PropertyDraftSubmissionResponse,
  PropertyDraftSubmissionSubmitRequestBody,
  PropertyDraftSubmissionSubmitResponse,
  PropertyDraftSubmissionUpdateRequestBody,
  PropertySubmissionDeleteResponse,
  PropertySubmissionDirectSubmitRequestBody,
} from "../types/propertyDraftSubmission.types";
import type {
  AdminPropertyAssignAgentRequestBody,
  AdminPropertyAssignAgentResponse,
  AdminPropertySubmissionDeactivateResponse,
  AdminPropertySubmissionReviewRequestBody,
  AdminPropertySubmissionReviewResponse,
  AdminPropertySubmissionsListParams,
  AdminPropertySubmissionsListResponse,
  AgentPropertiesListParams,
  AgentPropertiesListResponse,
  AgentPropertyDraftsListParams,
  AgentPropertyDraftsListResponse,
  DealClosureReviewRequestBody,
  DealClosureReviewResponse,
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
    auth: tokenStore.hasAuthCredentials(),
  });
}

export async function getSimilarProperties(
  id: string,
): Promise<PropertySimilarResponse> {
  return apiClient.request<PropertySimilarResponse>({
    endpoint: propertyEndpoints.PROPERTY_SIMILAR(id),
    method: "GET",
    auth: tokenStore.hasAuthCredentials(),
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

export async function getAdminPropertySubmissions(
  params: AdminPropertySubmissionsListParams,
): Promise<AdminPropertySubmissionsListResponse> {
  return apiClient.request<AdminPropertySubmissionsListResponse>({
    endpoint: propertyEndpoints.ADMIN_PROPERTY_SUBMISSIONS(params),
    method: "GET",
    auth: true,
  });
}

export async function reviewAdminPropertySubmission(
  submissionId: string,
  body: AdminPropertySubmissionReviewRequestBody,
): Promise<AdminPropertySubmissionReviewResponse> {
  return apiClient.request<AdminPropertySubmissionReviewResponse>({
    endpoint: propertyEndpoints.ADMIN_PROPERTY_SUBMISSION_REVIEW(submissionId),
    method: "POST",
    auth: true,
    body,
  });
}

export async function deactivateAdminPropertySubmission(
  submissionId: string,
): Promise<AdminPropertySubmissionDeactivateResponse> {
  return apiClient.request<AdminPropertySubmissionDeactivateResponse>({
    endpoint: propertyEndpoints.ADMIN_PROPERTY_SUBMISSION_DEACTIVATE(submissionId),
    method: "POST",
    auth: true,
  });
}

export async function reviewDealClosure(
  closureId: string,
  body: DealClosureReviewRequestBody,
): Promise<DealClosureReviewResponse> {
  return apiClient.request<DealClosureReviewResponse>({
    endpoint: propertyEndpoints.DEAL_CLOSURE_REVIEW(closureId),
    method: "POST",
    auth: true,
    body,
  });
}

export async function assignAdminPropertyAgent(
  propertyId: string,
  body: AdminPropertyAssignAgentRequestBody,
): Promise<AdminPropertyAssignAgentResponse> {
  return apiClient.request<AdminPropertyAssignAgentResponse>({
    endpoint: propertyEndpoints.ADMIN_PROPERTY_ASSIGN_AGENT(propertyId),
    method: "PATCH",
    auth: true,
    body,
  });
}

export async function getAgentPropertyDrafts(
  params: AgentPropertyDraftsListParams,
): Promise<AgentPropertyDraftsListResponse> {
  return apiClient.request<AgentPropertyDraftsListResponse>({
    endpoint: propertyEndpoints.AGENT_PROPERTY_DRAFTS(params),
    method: "GET",
    auth: true,
  });
}

export async function savePropertyDraftSubmission(
  body: PropertyDraftSubmissionRequestBody,
): Promise<PropertyDraftSubmissionResponse> {
  return apiClient.request<PropertyDraftSubmissionResponse>({
    endpoint: propertyEndpoints.PROPERTY_SUBMISSIONS(),
    method: "POST",
    auth: true,
    body,
  });
}

export async function updatePropertyDraftSubmission(
  submissionId: string,
  body: PropertyDraftSubmissionUpdateRequestBody,
): Promise<PropertyDraftSubmissionResponse> {
  return apiClient.request<PropertyDraftSubmissionResponse>({
    endpoint: propertyEndpoints.PROPERTY_SUBMISSION_BY_ID(submissionId),
    method: "PATCH",
    auth: true,
    body,
  });
}

export async function getPropertyDraftSubmission(
  submissionId: string,
): Promise<PropertyDraftSubmissionResponse> {
  return apiClient.request<PropertyDraftSubmissionResponse>({
    endpoint: propertyEndpoints.PROPERTY_SUBMISSION_BY_ID(submissionId),
    method: "GET",
    auth: true,
  });
}

export async function deletePropertySubmission(
  submissionId: string,
): Promise<PropertySubmissionDeleteResponse> {
  return apiClient.request<PropertySubmissionDeleteResponse>({
    endpoint: propertyEndpoints.PROPERTY_SUBMISSION_BY_ID(submissionId),
    method: "DELETE",
    auth: true,
  });
}

export async function submitPropertySubmission(
  body: PropertySubmissionDirectSubmitRequestBody,
): Promise<PropertyDraftSubmissionSubmitResponse> {
  return apiClient.request<PropertyDraftSubmissionSubmitResponse>({
    endpoint: propertyEndpoints.PROPERTY_SUBMISSIONS_SUBMIT(),
    method: "POST",
    auth: true,
    body,
  });
}

export async function submitPropertyDraftSubmission(
  submissionId: string,
  body: PropertyDraftSubmissionSubmitRequestBody,
): Promise<PropertyDraftSubmissionSubmitResponse> {
  return apiClient.request<PropertyDraftSubmissionSubmitResponse>({
    endpoint: propertyEndpoints.PROPERTY_SUBMISSION_SUBMIT(submissionId),
    method: "POST",
    auth: true,
    body,
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
