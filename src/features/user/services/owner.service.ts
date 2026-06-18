import { apiClient } from "@/src/apis/clients/api.client";
import { ownerEndpoints } from "@/src/apis/endpoints/ownerEndpoints";
import {
  DEFAULT_OWNER_LIST_PAGE,
  DEFAULT_OWNER_LIST_PAGE_SIZE,
} from "../constants/ownerList.constants";
import type {
  NormalizedOwnerListResponse,
  OwnerListParams,
  OwnerListResponse,
} from "../types/owner.types";

export async function getOwnerList(
  agencyId: string,
  params: OwnerListParams = {},
): Promise<NormalizedOwnerListResponse> {
  const page = params.page ?? DEFAULT_OWNER_LIST_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_OWNER_LIST_PAGE_SIZE;

  const response = await apiClient.request<OwnerListResponse>({
    endpoint: ownerEndpoints.LIST(agencyId, {
      page,
      pageSize,
      search: params.search,
      status: params.status,
    }),
    method: "GET",
    auth: true,
  });

  const data = response.data;
  const pagination =
    response.meta?.pagination ?? data?.pagination ?? {
      page,
      pageSize,
      total: data?.owners.length ?? 0,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    };

  return {
    owners: data?.owners ?? [],
    pagination,
  };
}
