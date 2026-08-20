import { apiClient, authClient } from "@/src/apis/clients/api.client";
import { agencyEndpoints } from "@/src/apis/endpoints/agencyEndpoints";
import { profileEndpoints } from "@/src/apis/endpoints/profileEndpoints";
import { getLoggedInUser } from "@/src/features/auth/services/auth.service";
import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import { requestUploadPresignedUrl } from "@/src/features/property/services/upload.service";
import {
  assignUserAgency,
  assignUserAgencyAndRefreshUser,
} from "@/src/features/user/services/user.service";
import { resolvePersistedUploadReference } from "@/src/lib/resolveUploadedFileUrl";
import { putFileToPresignedUrl } from "@/src/lib/upload";
import { resolveLicenseDocumentContentType } from "@/src/lib/validateLicenseDocumentFile";
import {
  resolveProfileImageContentType,
} from "../utils/validateProfileImageFile";
import type {
  Agency,
  AgencyActivationRequest,
  AgencyInvitationCreateRequest,
  AgencyInvitationResponse,
  AgencyLegalDocumentUploadRequest,
  AgencyLegalDocumentUploadResponse,
  AgencyListParams,
  AgencyListResponse,
  AgencyLogoUploadRequest,
  AgencyLogoUploadResponse,
  AgencyOfflineRegistrationRequest,
  AgencyPasswordSetupRequest,
  AgencyReviewRequest,
  AgencyWorkflowResponse,
  DeleteAgencyLogoResponse,
  GetAgencyResponse,
  NormalizedAgencyListResponse,
  NormalizedGetAgencyResponse,
  UpdateAgencyRequest,
  UpdateAgencyResponse,
} from "../types/profile.types";
import {
  normalizeAgencyListResponse,
  normalizeGetAgencyResponse,
  unwrapAgencyFromResponseData,
} from "../utils/agencyApi.utils";
import {
  DEFAULT_AGENCY_LIST_LIMIT,
  DEFAULT_AGENCY_LIST_SKIP,
} from "../constants/selectAgency.constants";
import type {
  DeleteProfilePictureResponse,
  ProfilePictureUploadRequest,
  ProfilePictureUploadResponse,
  ProfileUpdateRequestBody,
  ProfileUpdateRequestResponse,
  ProfileUpdateVerifyBody,
  ProfileUpdateVerifyResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from "../types/profile.types";

export async function getAgencyById(agencyId: string): Promise<NormalizedGetAgencyResponse> {
  const response = await apiClient.request<GetAgencyResponse>({
    endpoint: agencyEndpoints.byId(agencyId),
    method: "GET",
    auth: true,
  });

  return normalizeGetAgencyResponse(response);
}

export async function getAgencyList(
  params: AgencyListParams = {},
): Promise<NormalizedAgencyListResponse> {
  const skip = params.skip ?? DEFAULT_AGENCY_LIST_SKIP;
  const limit = params.limit ?? DEFAULT_AGENCY_LIST_LIMIT;

  const response = await apiClient.request<AgencyListResponse>({
    endpoint: agencyEndpoints.LIST({
      skip,
      limit,
      search: params.search,
      agencyStatus: params.agencyStatus,
      verificationStatus: params.verificationStatus,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }),
    method: "GET",
    auth: true,
  });

  return normalizeAgencyListResponse(response, { skip, limit });
}

export { assignUserAgency, assignUserAgencyAndRefreshUser };

export async function updateAgency(
  agencyId: string,
  body: UpdateAgencyRequest,
): Promise<Agency> {
  const response = await apiClient.request<UpdateAgencyResponse>({
    endpoint: agencyEndpoints.byId(agencyId),
    method: "PUT",
    body,
    auth: true,
  });

  return unwrapAgencyFromResponseData(response.data);
}

export async function createOfflineAgency(
  body: AgencyOfflineRegistrationRequest,
): Promise<AgencyWorkflowResponse> {
  return apiClient.request<AgencyWorkflowResponse>({
    endpoint: agencyEndpoints.OFFLINE_REGISTRATION,
    method: "POST",
    body,
    auth: true,
  });
}

export async function uploadOfflineAgencyLegalDocument(file: File): Promise<string> {
  const contentType = resolveLicenseDocumentContentType(file);
  const response = await requestUploadPresignedUrl({
    context: "agency_legal_document",
    file_name: file.name,
    content_type: contentType,
    file_size: file.size,
  });

  const uploadUrl = response.data?.upload_url;

  if (!response.success || !uploadUrl) {
    throw new Error(response.message ?? "Legal document upload failed");
  }

  if (!uploadUrl.startsWith("dev://")) {
    await putFileToPresignedUrl(
      uploadUrl,
      file,
      contentType,
      undefined,
      response.data?.upload_http_method === "POST" ? "POST" : "PUT",
    );
  }

  const persistedUrl = resolvePersistedUploadReference({
    file_url: response.data?.file_url,
    object_key: response.data?.object_key,
    upload_url: uploadUrl,
  });

  if (!persistedUrl) {
    throw new Error(response.message ?? "Legal document upload failed");
  }

  return persistedUrl;
}

export async function createAgencyInvitation(
  body: AgencyInvitationCreateRequest,
): Promise<AgencyInvitationResponse> {
  return apiClient.request<AgencyInvitationResponse>({
    endpoint: agencyEndpoints.INVITATIONS,
    method: "POST",
    body,
    auth: true,
  });
}

export async function reviewAgency(
  agencyId: string,
  body: AgencyReviewRequest,
): Promise<AgencyWorkflowResponse> {
  return apiClient.request<AgencyWorkflowResponse>({
    endpoint: agencyEndpoints.review(agencyId),
    method: "POST",
    body,
    auth: true,
  });
}

export async function updateAgencyActivation(
  agencyId: string,
  body: AgencyActivationRequest,
): Promise<AgencyWorkflowResponse> {
  return apiClient.request<AgencyWorkflowResponse>({
    endpoint: agencyEndpoints.activation(agencyId),
    method: "POST",
    body,
    auth: true,
  });
}

export async function setupAgencyPassword(
  body: AgencyPasswordSetupRequest,
): Promise<AgencyWorkflowResponse> {
  return authClient.request<AgencyWorkflowResponse>({
    endpoint: agencyEndpoints.PASSWORD_SETUP,
    method: "POST",
    body,
    auth: false,
  });
}

export async function sendAgencyPasswordLink(
  agencyId: string,
): Promise<AgencyWorkflowResponse> {
  return apiClient.request<AgencyWorkflowResponse>({
    endpoint: agencyEndpoints.passwordLink(agencyId),
    method: "POST",
    auth: true,
  });
}

export async function updateProfile(
  data: UpdateProfileRequest,
): Promise<UpdateProfileResponse> {
  return authClient.request<UpdateProfileResponse>({
    endpoint: profileEndpoints.UPDATE_PROFILE,
    method: "PATCH",
    body: data,
    auth: true,
  });
}

export async function requestProfileUpdate(
  body: ProfileUpdateRequestBody,
): Promise<ProfileUpdateRequestResponse> {
  return authClient.request<ProfileUpdateRequestResponse>({
    endpoint: profileEndpoints.REQUEST_PROFILE_UPDATE,
    method: "PATCH",
    body,
    auth: true,
  });
}

export async function verifyProfileUpdate(
  body: ProfileUpdateVerifyBody,
): Promise<ProfileUpdateVerifyResponse> {
  return authClient.request<ProfileUpdateVerifyResponse>({
    endpoint: profileEndpoints.VERIFY_PROFILE_UPDATE,
    method: "POST",
    body,
    auth: true,
  });
}

export async function verifyProfileUpdateAndRefreshUser(
  body: ProfileUpdateVerifyBody,
): Promise<LoggedInUser> {
  await verifyProfileUpdate(body);
  const me = await getLoggedInUser();
  return me.data;
}

export async function requestProfilePictureUpload(
  body: ProfilePictureUploadRequest,
): Promise<ProfilePictureUploadResponse> {
  return authClient.request<ProfilePictureUploadResponse>({
    endpoint: profileEndpoints.UPLOAD_PROFILE_PICTURE,
    method: "POST",
    body,
    auth: true,
  });
}

export async function uploadProfilePicture(file: File): Promise<LoggedInUser> {
  const contentType = resolveProfileImageContentType(file);
  const response = await requestProfilePictureUpload({
    file_name: file.name,
    content_type: contentType,
    file_size: file.size,
  });

  await putFileToPresignedUrl(response.data.upload_url, file, contentType);

  const me = await getLoggedInUser();
  return me.data;
}

export async function deleteProfilePicture(): Promise<LoggedInUser> {
  await authClient.request<DeleteProfilePictureResponse>({
    endpoint: profileEndpoints.DELETE_PROFILE_PICTURE,
    method: "DELETE",
    auth: true,
  });

  const me = await getLoggedInUser();
  return me.data;
}

export async function requestAgencyLogoUpload(
  agencyId: string,
  body: AgencyLogoUploadRequest,
): Promise<AgencyLogoUploadResponse> {
  return apiClient.request<AgencyLogoUploadResponse>({
    endpoint: agencyEndpoints.logo(agencyId),
    method: "POST",
    body,
    auth: true,
  });
}

export async function uploadAgencyLogo(agencyId: string, file: File): Promise<Agency> {
  const contentType = resolveProfileImageContentType(file);
  const response = await requestAgencyLogoUpload(agencyId, {
    file_name: file.name,
    content_type: contentType,
    file_size: file.size,
  });

  await putFileToPresignedUrl(response.data.upload_url, file, contentType);

  const refreshed = await getAgencyById(agencyId);
  return refreshed.data;
}

export async function deleteAgencyLogo(agencyId: string): Promise<Agency> {
  await apiClient.request<DeleteAgencyLogoResponse>({
    endpoint: agencyEndpoints.logo(agencyId),
    method: "DELETE",
    auth: true,
  });

  const refreshed = await getAgencyById(agencyId);
  return refreshed.data;
}

export async function requestAgencyLegalDocumentUpload(
  agencyId: string,
  body: AgencyLegalDocumentUploadRequest,
): Promise<AgencyLegalDocumentUploadResponse> {
  return apiClient.request<AgencyLegalDocumentUploadResponse>({
    endpoint: agencyEndpoints.legalDocument(agencyId),
    method: "POST",
    body,
    auth: true,
  });
}

export async function uploadAgencyLegalDocument(
  agencyId: string,
  file: File,
): Promise<Agency> {
  const contentType = resolveLicenseDocumentContentType(file);
  const response = await requestAgencyLegalDocumentUpload(agencyId, {
    file_name: file.name,
    content_type: contentType,
    file_size: file.size,
  });

  if (!response.data.upload_url.startsWith("dev://")) {
    await putFileToPresignedUrl(response.data.upload_url, file, contentType);
  }

  const refreshed = await getAgencyById(agencyId);
  return refreshed.data;
}
