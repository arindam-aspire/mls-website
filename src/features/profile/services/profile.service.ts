import { authClient } from "@/src/apis/clients/api.client";
import { profileEndpoints } from "@/src/apis/endpoints/profileEndpoints";
import { getLoggedInUser } from "@/src/features/auth/services/auth.service";
import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import { putFileToPresignedUrl } from "@/src/lib/upload";
import {
  resolveProfileImageContentType,
} from "../utils/validateProfileImageFile";
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
} from "../types/profile.api.types";

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
