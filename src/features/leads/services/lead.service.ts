import { apiClient } from "@/src/apis/clients/api.client";
import { leadEndpoints } from "@/src/apis/endpoints/leadEndpoints";
import { ownerEndpoints } from "@/src/apis/endpoints/ownerEndpoints";
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
import { normalizeLeadFromApi } from "../utils/leadDisplay.utils";

function asItemArray<T>(data: { items: T[] } | T[] | null | undefined): T[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  return data.items ?? [];
}

function readNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function normalizeOwnerLeadFromApi(value: Lead): Lead {
  const outer = value as Lead & Record<string, unknown>;
  const record =
    outer.lead && typeof outer.lead === "object"
      ? (outer.lead as Record<string, unknown>)
      : outer;
  const id = readNullableString(record.id) ?? "";

  return normalizeLeadFromApi({
    ...(record as Lead),
    id,
    lead_number:
      readNullableString(record.lead_number) ??
      readNullableString(record.lead_no) ??
      readNullableString(record.reference) ??
      id,
    property_id: readNullableString(record.property_id),
    property_hash:
      typeof record.property_hash === "number" ? record.property_hash : null,
    property:
      record.property && typeof record.property === "object"
        ? (record.property as Record<string, unknown>)
        : null,
    user_id: readNullableString(record.user_id),
    inquiry_type: readNullableString(record.inquiry_type),
    message: readNullableString(record.message),
    status: readNullableString(record.status) ?? "NEW",
    source: readNullableString(record.source) ?? "",
    assigned_agent_id: readNullableString(record.assigned_agent_id),
    assigned_by_admin_id: readNullableString(record.assigned_by_admin_id),
    last_activity_at: readNullableString(record.last_activity_at),
    request_close_at: readNullableString(record.request_close_at),
    closed_at: readNullableString(record.closed_at),
    closed_by_admin_id: readNullableString(record.closed_by_admin_id),
    contact_name:
      readNullableString(record.contact_name) ??
      readNullableString(record.name),
    contact_phone:
      readNullableString(record.contact_phone) ??
      readNullableString(record.phone),
    contact_email:
      readNullableString(record.contact_email) ??
      readNullableString(record.email),
    external_property_name: readNullableString(record.external_property_name),
    communication_mode: readNullableString(record.communication_mode),
    created_by_agent_id: readNullableString(record.created_by_agent_id),
    created_by_admin_id: readNullableString(record.created_by_admin_id),
    created_at: readNullableString(record.created_at),
    updated_at: readNullableString(record.updated_at),
  });
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
    items: (data?.items ?? []).map(normalizeLeadFromApi),
    pagination,
  };
}

/**
 * Returns enquiries linked to the authenticated owner using the owner-scoped
 * lead-list endpoint. The response is normalized to the shared Lead List shape.
 */
export async function getOwnerLeadList(
  ownerId: string,
  params: LeadListParams = {},
): Promise<NormalizedLeadListResponse> {
  const page = params.page ?? DEFAULT_LEAD_LIST_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_LEAD_LIST_PAGE_SIZE;

  const response = await apiClient.request<LeadListResponse>({
    endpoint: ownerEndpoints.LINKED_LEADS(ownerId, {
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
    items: (data?.items ?? []).map(normalizeOwnerLeadFromApi),
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

  return normalizeLeadFromApi(response.data);
}

/**
 * Temporary stand-in until the email API is available.
 * Logs the inquiry payload that would be emailed to the agent and the user.
 */
export function mockSendInquiryEmails(payload: CreateLeadRequest): void {
  console.log("Email would be sent to the property agent and the user.");
  console.log("Payload:", payload);
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

  // Email service is unavailable — simulate send via console logs for now.
  mockSendInquiryEmails(body);

  return normalizeLeadFromApi(response.data);
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

  return normalizeLeadFromApi(response.data);
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

  return normalizeLeadFromApi(response.data);
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

  return normalizeLeadFromApi(response.data);
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

  return normalizeLeadFromApi(response.data);
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
