import { apiClient, authClient } from "@/src/apis/clients/api.client";
import { agencyEndpoints } from "@/src/apis/endpoints/agencyEndpoints";
import { profileEndpoints } from "@/src/apis/endpoints/profileEndpoints";
import { getLoggedInUser } from "@/src/features/auth/services/auth.service";
import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import {
  assignUserAgency,
  assignUserAgencyAndRefreshUser,
} from "@/src/features/user/services/user.service";
import { putFileToPresignedUrl } from "@/src/lib/upload";
import { resolveLicenseDocumentContentType } from "@/src/lib/validateLicenseDocumentFile";
import {
  resolveProfileImageContentType,
} from "../utils/validateProfileImageFile";
import type {
  Agency,
  AgencyLegalDocumentUploadRequest,
  AgencyLegalDocumentUploadResponse,
  AgencyListParams,
  AgencyListResponse,
  AgencyLogoUploadRequest,
  AgencyLogoUploadResponse,
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
    endpoint: agencyEndpoints.LIST({ skip, limit }),
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

  await putFileToPresignedUrl(response.data.upload_url, file, contentType);

  const refreshed = await getAgencyById(agencyId);
  return refreshed.data;
}
