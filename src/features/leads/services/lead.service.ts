import { apiClient } from "@/src/apis/clients/api.client";
import { leadEndpoints } from "@/src/apis/endpoints/leadEndpoints";
import {
  DEFAULT_LEAD_LIST_PAGE,
  DEFAULT_LEAD_LIST_PAGE_SIZE,
} from "../constants/leadList.constants";
import type {
  AddLeadMessageRequest,
  AddLeadNoteRequest,
  AssignLeadRequest,
  CloseLeadRequest,
  CreateLeadRequest,
  Lead,
  LeadActivityItem,
  LeadActivityListResponse,
  LeadDetailResponse,
  LeadListParams,
  LeadListResponse,
  LeadMessage,
  LeadMessagesListResponse,
  LeadNote,
  LeadNotesListResponse,
  NormalizedLeadListResponse,
  UpdateLeadStatusRequest,
} from "../types/lead.types";

function asItemArray<T>(data: { items: T[] } | T[] | null | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.items ?? [];
}

export async function getLeadList(
  params: LeadListParams = {},
): Promise<NormalizedLeadListResponse> {
  const page = params.page ?? DEFAULT_LEAD_LIST_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_LEAD_LIST_PAGE_SIZE;

  const response = await apiClient.request<LeadListResponse>({
    endpoint: leadEndpoints.LIST({
      page,
      pageSize,
      status: params.status,
      search: params.search,
      assignedAgentId: params.assignedAgentId,
      propertyId: params.propertyId,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }),
    method: "GET",
    auth: true,
  });

  const data = response.data;
  const pagination = response.meta?.pagination ?? {
    total: data?.total ?? data?.items?.length ?? 0,
    page: data?.page ?? page,
    pageSize: data?.pageSize ?? pageSize,
    totalPages: data?.totalPages ?? 1,
    hasNext: data?.hasNext ?? false,
    hasPrevious: data?.hasPrevious ?? false,
  };

  return {
    items: data?.items ?? [],
    pagination,
  };
}

export async function getLeadDetail(leadId: string): Promise<Lead> {
  const response = await apiClient.request<LeadDetailResponse>({
    endpoint: leadEndpoints.DETAIL(leadId),
    method: "GET",
    auth: true,
  });

  if (!response.data) {
    throw new Error(response.message ?? "Lead not found");
  }

  return response.data;
}

export async function createLead(body: CreateLeadRequest): Promise<Lead> {
  const response = await apiClient.request<LeadDetailResponse>({
    endpoint: leadEndpoints.CREATE,
    method: "POST",
    auth: true,
    body,
  });

  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Failed to create lead");
  }

  return response.data;
}

export async function assignLeadAgent(
  leadId: string,
  body: AssignLeadRequest,
): Promise<Lead> {
  const response = await apiClient.request<LeadDetailResponse>({
    endpoint: leadEndpoints.ASSIGN(leadId),
    method: "PATCH",
    auth: true,
    body,
  });

  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Failed to assign agent");
  }

  return response.data;
}

export async function updateLeadStatus(
  leadId: string,
  body: UpdateLeadStatusRequest,
): Promise<Lead> {
  const response = await apiClient.request<LeadDetailResponse>({
    endpoint: leadEndpoints.STATUS(leadId),
    method: "PATCH",
    auth: true,
    body,
  });

  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Failed to update status");
  }

  return response.data;
}

export async function requestCloseLead(leadId: string): Promise<Lead> {
  const response = await apiClient.request<LeadDetailResponse>({
    endpoint: leadEndpoints.REQUEST_CLOSE(leadId),
    method: "POST",
    auth: true,
  });

  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Failed to request close");
  }

  return response.data;
}

export async function closeLead(
  leadId: string,
  body: CloseLeadRequest = {},
): Promise<Lead> {
  const response = await apiClient.request<LeadDetailResponse>({
    endpoint: leadEndpoints.CLOSE(leadId),
    method: "POST",
    auth: true,
    body,
  });

  if (!response.success || !response.data) {
    throw new Error(response.message ?? "Failed to close lead");
  }

  return response.data;
}

export async function addLeadNote(
  leadId: string,
  body: AddLeadNoteRequest,
): Promise<unknown> {
  const response = await apiClient.request<LeadApiSuccessResponse>({
    endpoint: leadEndpoints.NOTES(leadId),
    method: "POST",
    auth: true,
    body,
  });

  if (!response.success) {
    throw new Error(response.message ?? "Failed to add note");
  }

  return response.data;
}

export async function addLeadMessage(
  leadId: string,
  body: AddLeadMessageRequest,
): Promise<unknown> {
  const response = await apiClient.request<LeadApiSuccessResponse>({
    endpoint: leadEndpoints.MESSAGES(leadId),
    method: "POST",
    auth: true,
    body,
  });

  if (!response.success) {
    throw new Error(response.message ?? "Failed to send message");
  }

  return response.data;
}

type LeadApiSuccessResponse = {
  success: boolean;
  message: string | null;
  data: unknown;
  error: unknown;
};

export async function getLeadNotes(leadId: string): Promise<LeadNote[]> {
  try {
    const response = await apiClient.request<LeadNotesListResponse>({
      endpoint: leadEndpoints.NOTES_LIST(leadId),
      method: "GET",
      auth: true,
    });
    return asItemArray(response.data);
  } catch {
    return [];
  }
}

export async function getLeadMessages(leadId: string): Promise<LeadMessage[]> {
  try {
    const response = await apiClient.request<LeadMessagesListResponse>({
      endpoint: leadEndpoints.MESSAGES_LIST(leadId),
      method: "GET",
      auth: true,
    });
    return asItemArray(response.data);
  } catch {
    return [];
  }
}

export async function getLeadActivity(
  leadId: string,
): Promise<LeadActivityItem[]> {
  try {
    const response = await apiClient.request<LeadActivityListResponse>({
      endpoint: leadEndpoints.ACTIVITY(leadId),
      method: "GET",
      auth: true,
    });
    return asItemArray(response.data);
  } catch {
    return [];
  }
}
