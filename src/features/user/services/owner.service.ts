import { apiClient } from "@/src/apis/clients/api.client";
import { ownerEndpoints } from "@/src/apis/endpoints/ownerEndpoints";
import {
  DEFAULT_OWNER_LIST_PAGE,
  DEFAULT_OWNER_LIST_PAGE_SIZE,
} from "../constants/ownerList.constants";
import type {
  AssignOwnerAgencyResponse,
  NormalizedOwnerLinkedListResponse,
  NormalizedOwnerListResponse,
  OwnerDetailResponse,
  OwnerLinkedLeadItem,
  OwnerLinkedListParams,
  OwnerLinkedListResponse,
  OwnerLinkedPropertyItem,
  OwnerListItem,
  OwnerListPagination,
  OwnerListParams,
  OwnerListResponse,
  OwnerStatusUpdateRequest,
  OwnerStatusUpdateResponse,
  OwnerStatusUpdateResult,
  UpdateOwnerRequest,
  UpdateOwnerResponse,
  UpdateOwnerResult,
} from "../types/owner.types";

const DEFAULT_LINKED_LIST_PAGE = 1;
const DEFAULT_LINKED_LIST_PAGE_SIZE = 10;

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

function resolveLinkedListPagination<T>(
  data: OwnerLinkedListResponse<T>["data"],
  metaPagination: OwnerListPagination | undefined,
  fallbackPage: number,
  fallbackPageSize: number,
): OwnerListPagination {
  return resolveOwnerListPagination(
    data as OwnerListResponse["data"],
    metaPagination,
    fallbackPage,
    fallbackPageSize,
  );
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

export async function getOwnerDetail(ownerId: string): Promise<OwnerListItem> {
  const response = await apiClient.request<OwnerDetailResponse>({
    endpoint: ownerEndpoints.DETAIL(ownerId),
    method: "GET",
    auth: true,
  });

  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Failed to load owner details");
  }

  return response.data;
}

export async function updateOwner(
  ownerId: string,
  body: UpdateOwnerRequest,
): Promise<UpdateOwnerResult> {
  const response = await apiClient.request<UpdateOwnerResponse>({
    endpoint: ownerEndpoints.UPDATE(ownerId),
    method: "PATCH",
    auth: true,
    body,
  });

  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Failed to update owner");
  }

  return {
    message: response.message ?? "",
    owner: response.data,
  };
}

export async function updateOwnerStatus(
  ownerId: string,
  body: OwnerStatusUpdateRequest,
): Promise<OwnerStatusUpdateResult> {
  const response = await apiClient.request<OwnerStatusUpdateResponse>({
    endpoint: ownerEndpoints.UPDATE_STATUS(ownerId),
    method: "PATCH",
    auth: true,
    body,
  });

  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Failed to update owner status");
  }

  return {
    message: response.message ?? "",
    owner: response.data,
  };
}

export async function getOwnerLinkedProperties(
  ownerId: string,
  params: OwnerLinkedListParams = {},
): Promise<NormalizedOwnerLinkedListResponse<OwnerLinkedPropertyItem>> {
  const page = params.page ?? DEFAULT_LINKED_LIST_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_LINKED_LIST_PAGE_SIZE;

  const response = await apiClient.request<OwnerLinkedListResponse<OwnerLinkedPropertyItem>>({
    endpoint: ownerEndpoints.LINKED_PROPERTIES(ownerId, { page, pageSize }),
    method: "GET",
    auth: true,
  });

  const data = response.data;
  const pagination = resolveLinkedListPagination(
    data,
    response.meta?.pagination,
    page,
    pageSize,
  );

  return {
    items: data?.items ?? [],
    pagination,
  };
}

export async function getOwnerLinkedLeads(
  ownerId: string,
  params: OwnerLinkedListParams = {},
): Promise<NormalizedOwnerLinkedListResponse<OwnerLinkedLeadItem>> {
  const page = params.page ?? DEFAULT_LINKED_LIST_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_LINKED_LIST_PAGE_SIZE;

  const response = await apiClient.request<OwnerLinkedListResponse<OwnerLinkedLeadItem>>({
    endpoint: ownerEndpoints.LINKED_LEADS(ownerId, { page, pageSize }),
    method: "GET",
    auth: true,
  });

  const data = response.data;
  const pagination = resolveLinkedListPagination(
    data,
    response.meta?.pagination,
    page,
    pageSize,
  );

  return {
    items: data?.items ?? [],
    pagination,
  };
}
