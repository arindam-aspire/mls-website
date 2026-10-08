import { apiClient, authClient } from "@/src/apis/clients/api.client";
import { agencyEndpoints } from "@/src/apis/endpoints/agencyEndpoints";
import { profileEndpoints } from "@/src/apis/endpoints/profileEndpoints";
import { uploadEndpoints } from "@/src/apis/endpoints/uploadEndpoints";
import { buildAgencyInvitationCreateBody } from "@/src/features/agencies/utils/buildAgencyInvitationCreateBody";
import { getLoggedInUser } from "@/src/features/auth/services/auth.service";
import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import type { UploadPresignedUrlResponse } from "@/src/features/property/types/upload.types";
import {
  assignUserAgency,
  assignUserAgencyAndRefreshUser,
} from "@/src/features/user/services/user.service";
import { resolveUploadedFileUrl } from "@/src/lib/resolveUploadedFileUrl";
import {
  cacheProfilePictureFile,
  clearCachedProfilePicture,
} from "@/src/lib/profilePictureCache";
import { isUsableNextImageSrc, resolveDisplayableImageSrc } from "@/src/lib/shouldUnoptimizeImageSrc";
import { putFileToPresignedUrl } from "@/src/lib/upload";
import { resolveLicenseDocumentContentType } from "@/src/lib/validateLicenseDocumentFile";
import {
  resolveProfileImageContentType,
} from "../utils/validateProfileImageFile";
import type {
  Agency,
  AgencyActivationRequest,
  AgencyInvitationAcceptRequest,
  AgencyInvitationAcceptResponse,
  AgencyInvitationCreateRequest,
  AgencyInvitationPreview,
  AgencyInvitationPreviewResponse,
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
  isUsableAgencyId,
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
  ProfilePictureUploadData,
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
  if (!isUsableAgencyId(agencyId)) {
    throw new Error("Agency id is required");
  }

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

function isPersistableS3FileUrl(value: string): boolean {
  return /^https?:\/\//i.test(value) && !value.startsWith("dev://");
}

/**
 * Uploads an agency licence before invitation, accept, or offline registration.
 * 1. `POST /uploads/presigned-url` with `context: "agency_legal_document"`.
 * 2. PUT the file bytes to `data.upload_url`.
 * 3. Return `data.file_url` for `legal_document_s3_link`.
 * `dev://` placeholders are rejected and never submitted.
 */
export async function uploadAgencyLegalDocumentFile(
  file: File,
  options?: { auth?: boolean },
): Promise<string> {
  const contentType = resolveLicenseDocumentContentType(file);
  const useAuth = options?.auth !== false;
  const response = await apiClient.request<UploadPresignedUrlResponse>({
    endpoint: uploadEndpoints.PRESIGNED_URL,
    method: "POST",
    auth: useAuth,
    body: {
      file_name: file.name,
      content_type: contentType,
      file_size: file.size,
      context: "agency_legal_document",
    },
  });

  const uploadUrl = response.data?.upload_url?.trim() ?? "";
  const fileUrl = response.data?.file_url?.trim() ?? "";

  if (!response.success || !isPersistableS3FileUrl(uploadUrl)) {
    throw new Error(response.message?.trim() || "Legal document upload failed");
  }

  await putFileToPresignedUrl(
    uploadUrl,
    file,
    contentType,
    undefined,
    response.data?.upload_http_method === "POST" ? "POST" : "PUT",
  );

  if (!isPersistableS3FileUrl(fileUrl)) {
    throw new Error(response.message?.trim() || "Legal document upload failed");
  }

  return fileUrl;
}

export async function uploadOfflineAgencyLegalDocument(file: File): Promise<string> {
  return uploadAgencyLegalDocumentFile(file, { auth: true });
}

export async function createAgencyInvitation(
  body: AgencyInvitationCreateRequest,
): Promise<AgencyInvitationResponse> {
  return apiClient.request<AgencyInvitationResponse>({
    endpoint: agencyEndpoints.INVITATIONS,
    method: "POST",
    body: buildAgencyInvitationCreateBody(body),
    auth: true,
  });
}

function pickRecordString(
  record: Record<string, unknown>,
  ...keys: string[]
): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return null;
}

function normalizeAgencyInvitationPreview(data: unknown): AgencyInvitationPreview {
  const record =
    data && typeof data === "object" ? (data as Record<string, unknown>) : {};

  return {
    email: pickRecordString(record, "email") ?? "",
    agency_name: pickRecordString(record, "agency_name", "agencyName"),
    agency_trade_name: pickRecordString(
      record,
      "agency_trade_name",
      "agencyTradeName",
    ),
    phone: pickRecordString(record, "phone", "phone_number", "phoneNumber"),
    legal_document_s3_link: pickRecordString(
      record,
      "legal_document_s3_link",
      "document_url",
      "licence_url",
    ),
    status: pickRecordString(record, "status") ?? "",
    expires_at: pickRecordString(record, "expires_at", "expiresAt"),
    password_setup_link: pickRecordString(
      record,
      "password_setup_link",
      "passwordSetupLink",
    ),
  };
}

export async function validateAgencyInvitation(
  token: string,
): Promise<AgencyInvitationPreview> {
  const response = await authClient.request<AgencyInvitationPreviewResponse>({
    endpoint: agencyEndpoints.VALIDATE_INVITATION(token),
    method: "GET",
    auth: false,
  });

  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Invitation link is invalid");
  }

  return normalizeAgencyInvitationPreview(response.data);
}

export async function acceptAgencyInvitation(
  body: AgencyInvitationAcceptRequest,
): Promise<AgencyInvitationAcceptResponse> {
  return authClient.request<AgencyInvitationAcceptResponse>({
    endpoint: agencyEndpoints.ACCEPT_INVITATION,
    method: "POST",
    body,
    auth: false,
  });
}

export async function uploadAgencyInvitationLegalDocument(file: File): Promise<string> {
  return uploadAgencyLegalDocumentFile(file, { auth: false });
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
  return refreshAuthenticatedProfile();
}

/** Re-read `GET /auth/me` so verification flags come from the backend. */
export async function refreshAuthenticatedProfile(): Promise<LoggedInUser> {
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

async function putFileUnlessDevPlaceholder(
  uploadUrl: string | undefined,
  file: File,
  contentType: string,
  httpMethod?: "PUT" | "POST",
): Promise<void> {
  if (!uploadUrl) {
    throw new Error("Upload URL missing");
  }
  // Local MLS returns `dev://profile-pictures/...` when S3 is not configured.
  // The browser cannot PUT to that scheme; other upload helpers skip it.
  if (uploadUrl.startsWith("dev://")) {
    return;
  }
  await putFileToPresignedUrl(
    uploadUrl,
    file,
    contentType,
    undefined,
    httpMethod === "POST" ? "POST" : "PUT",
  );
}

function resolveDisplayUrlAfterUpload(
  storedUrl: string | null | undefined,
  uploadData: ProfilePictureUploadData | undefined,
): string | null {
  if (isUsableNextImageSrc(storedUrl)) {
    return storedUrl?.trim() ?? null;
  }
  if (!uploadData?.upload_url) {
    return storedUrl?.trim() ?? null;
  }
  const fromUpload = resolveUploadedFileUrl(uploadData.upload_url, {
    signedReadUrl: uploadData.signed_read_url,
    fileUrl: uploadData.file_url,
  });
  if (isUsableNextImageSrc(fromUpload)) {
    return fromUpload;
  }
  return storedUrl?.trim() ?? null;
}

export async function uploadProfilePicture(file: File): Promise<LoggedInUser> {
  const contentType = resolveProfileImageContentType(file);
  const response = await requestProfilePictureUpload({
    file_name: file.name,
    content_type: contentType,
    file_size: file.size,
  });

  await putFileUnlessDevPlaceholder(
    response.data?.upload_url,
    file,
    contentType,
    response.data?.upload_http_method,
  );

  const me = await getLoggedInUser();
  const cachedSrc = await cacheProfilePictureFile(me.data.id, file);
  const fromUpload = resolveDisplayUrlAfterUpload(
    me.data.profile_picture_url?.startsWith("blob:")
      ? null
      : me.data.profile_picture_url,
    response.data,
  );

  return {
    ...me.data,
    profile_picture_url:
      resolveDisplayableImageSrc(fromUpload, cachedSrc) ??
      cachedSrc ??
      me.data.profile_picture_url,
  };
}

export async function deleteProfilePicture(): Promise<LoggedInUser> {
  await authClient.request<DeleteProfilePictureResponse>({
    endpoint: profileEndpoints.DELETE_PROFILE_PICTURE,
    method: "DELETE",
    auth: true,
  });

  const me = await getLoggedInUser();
  await clearCachedProfilePicture(me.data.id);

  return {
    ...me.data,
    profile_picture_url: isUsableNextImageSrc(me.data.profile_picture_url) &&
      !me.data.profile_picture_url?.startsWith("blob:")
      ? me.data.profile_picture_url
      : null,
  };
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

  await putFileUnlessDevPlaceholder(
    response.data?.upload_url,
    file,
    contentType,
    response.data?.upload_http_method,
  );

  const refreshed = await getAgencyById(agencyId);
  return {
    ...refreshed.data,
    logo_url: resolveDisplayUrlAfterUpload(refreshed.data.logo_url, response.data),
  };
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

  await putFileUnlessDevPlaceholder(response.data?.upload_url, file, contentType);

  const refreshed = await getAgencyById(agencyId);
  return refreshed.data;
}
