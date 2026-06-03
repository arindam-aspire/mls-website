import { authClient } from "@/src/apis/clients/api.client";
import { profileEndpoints } from "@/src/apis/endpoints/profileEndpoints";
import type {
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
