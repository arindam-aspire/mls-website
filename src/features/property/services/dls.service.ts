import { authClient } from "@/src/apis/clients/api.client";
import { publicEndpoints } from "@/src/apis/endpoints/publicEndpoints";
import type {
  DlsLocationsQuery,
  DlsLocationsResponse,
} from "@/src/features/property/types/dls.types";

export async function getDlsLocations(
  params: DlsLocationsQuery,
): Promise<DlsLocationsResponse> {
  return authClient.request<DlsLocationsResponse>({
    endpoint: publicEndpoints.DLS_LOCATIONS(params),
    method: "GET",
  });
}
