import { apiClient } from "@/src/apis/clients/api.client";
import { ownerEndpoints } from "@/src/apis/endpoints/ownerEndpoints";
import {
  DEFAULT_OWNER_LIST_PAGE,
  DEFAULT_OWNER_LIST_PAGE_SIZE,
} from "../constants/ownerList.constants";
import type {
  AssignOwnerAgencyResponse,
  NormalizedOwnerListResponse,
  OwnerListPagination,
  OwnerListParams,
  OwnerListResponse,
} from "../types/owner.types";

function resolveOwnerListPagination(
  data: OwnerListResponse["data"],
  metaPagination: OwnerListPagination | undefined,
  fallbackPage: number,
  fallbackPageSize: number,
): OwnerListPagination {
  if (metaPagination) {
    return metaPagination;
  }

  if (data) {
    return {
      page: data.page,
      pageSize: data.pageSize,
      total: data.total,
      totalPages: data.totalPages,
      hasNext: data.hasNext,
      hasPrevious: data.hasPrevious,
    };
  }

  return {
    page: fallbackPage,
    pageSize: fallbackPageSize,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  };
}

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
  const pagination = resolveOwnerListPagination(
    data,
    response.meta?.pagination,
    page,
    pageSize,
  );

  return {
    owners: data?.items ?? [],
    pagination,
  };
}

export async function getPlatformOwnerList(
  params: OwnerListParams = {},
): Promise<NormalizedOwnerListResponse> {
  const page = params.page ?? DEFAULT_OWNER_LIST_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_OWNER_LIST_PAGE_SIZE;

  const response = await apiClient.request<OwnerListResponse>({
    endpoint: ownerEndpoints.PLATFORM_LIST({
      page,
      pageSize,
      search: params.search,
      status: params.status,
      agencyId: params.agencyId,
    }),
    method: "GET",
    auth: true,
  });

  const data = response.data;
  const pagination = resolveOwnerListPagination(
    data,
    response.meta?.pagination,
    page,
    pageSize,
  );

  return {
    owners: data?.items ?? [],
    pagination,
  };
}

export async function assignOwnerAgency(
  ownerId: string,
  agencyId: string,
): Promise<AssignOwnerAgencyResponse> {
  return apiClient.request<AssignOwnerAgencyResponse>({
    endpoint: ownerEndpoints.ASSIGN_AGENCY(ownerId),
    method: "POST",
    body: { agency_id: agencyId },
    auth: true,
  });
}
