import { apiClient } from "@/src/apis/clients/api.client";
import { userEndpoints } from "@/src/apis/endpoints/userEndpoints";
import { getLoggedInUser } from "@/src/features/auth/services/auth.service";
import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import type { AssignUserAgencyResponse } from "../types/user.types";

export async function assignUserAgency(agencyId: string): Promise<AssignUserAgencyResponse> {
  return apiClient.request<AssignUserAgencyResponse>({
    endpoint: userEndpoints.AGENCY,
    method: "PATCH",
    body: { agencyId },
    auth: true,
  });
}

/** Assign agency then refresh `GET /auth/me` for updated `has_agency` / `agency`. */
export async function assignUserAgencyAndRefreshUser(agencyId: string): Promise<LoggedInUser> {
  const response = await assignUserAgency(agencyId);

  if (!response.success) {
    throw new Error(response.message ?? "Failed to assign agency");
  }

  const me = await getLoggedInUser();

  return me.data;
}
