export const LEAD_STATUSES = [
  "NEW",
  "IN_PROGRESS",
  "CONTACTED",
  "QUALIFIED",
  "FOLLOW_UP",
  "MEETING_SCHEDULED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "REQUEST_FOR_CLOSE",
  "CLOSED_WON",
  "CLOSED_LOST",
  "ON_HOLD",
  "CANCELLED",
  /** Legacy terminal value retained for existing API records. */
  "CLOSED",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_SOURCES = [
  "EMAIL_FORM",
  "PHONE",
  "WHATSAPP",
  "MANUAL_ADMIN",
  "AGENT_MANUAL",
  "OFFLINE_MANUAL",
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_MESSAGE_CHANNELS = ["IN_APP", "EMAIL", "SMS"] as const;

export type LeadMessageChannel = (typeof LEAD_MESSAGE_CHANNELS)[number];

export type LeadPropertySnapshot = Record<string, unknown> | null;

export type Lead = {
  id: string;
  lead_number: string;
  property_id: string | null;
  property_hash: number | null;
  property: LeadPropertySnapshot;
  user_id: string | null;
  inquiry_type: string | null;
  message: string | null;
  status: LeadStatus | string;
  source: LeadSource | string;
  assigned_agent_id: string | null;
  assigned_by_admin_id: string | null;
  last_activity_at: string | null;
  request_close_at: string | null;
  closed_at: string | null;
  closed_by_admin_id: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  external_property_name: string | null;
  communication_mode: string | null;
  created_by_agent_id: string | null;
  created_by_admin_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  /** Optional enriched fields if API adds them later. */
  assigned_agent_name?: string | null;
  assigned_agent?: LeadAssignedAgentSnapshot | null;
};

export type LeadAssignedAgentSnapshot = {
  id?: string | null;
  fullName?: string | null;
  full_name?: string | null;
  name?: string | null;
};

export type LeadListPagination = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type LeadListData = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  items: Lead[];
};

export type LeadListParams = {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
  assignedAgentId?: string;
  propertyId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export type LeadApiEnvelope<T> = {
  success: boolean;
  message: string | null;
  data: T | null;
  error: unknown;
  meta?: {
    pagination?: LeadListPagination;
  };
};

export type LeadListResponse = LeadApiEnvelope<LeadListData>;
export type LeadDetailResponse = LeadApiEnvelope<Lead>;

export type NormalizedLeadListResponse = {
  items: Lead[];
  pagination: LeadListPagination;
};

export type CreateLeadRequest = {
  property_hash?: number | null;
  inquiry_type?: string | null;
  message?: string | null;
  source: LeadSource | string;
  communication_mode?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
};

export type AssignLeadRequest = {
  agent_id: string | null;
};

export type UpdateLeadStatusRequest = {
  status: LeadStatus | string;
  reason?: string | null;
};

export type CloseLeadRequest = {
  reason?: string | null;
};

export type AddLeadNoteRequest = {
  note: string;
};

export type AddLeadMessageRequest = {
  message: string;
  channel: LeadMessageChannel | string;
  recipient_user_id?: string | null;
};

export type LeadNote = {
  id: string;
  note: string;
  created_at: string | null;
  created_by_id?: string | null;
  created_by_name?: string | null;
};

export type LeadMessage = {
  id: string;
  message: string;
  channel: string;
  created_at: string | null;
  created_by_id?: string | null;
  created_by_name?: string | null;
  recipient_user_id?: string | null;
  recipient_name?: string | null;
  direction?: "inbound" | "outbound" | string;
};

export type LeadConversationMessageVariant = "agent" | "customer";

export type LeadConversationMessageDisplay = {
  id: string;
  message: string;
  senderName: string;
  recipientName: string | null;
  sentAt: string | null;
  sentAtLabel: string;
  sentTimeLabel: string;
  channelLabel: string;
  variant: LeadConversationMessageVariant;
};

export type LeadNoteDisplay = {
  id: string;
  note: string;
  authorName: string;
  createdAt: string | null;
  createdAtLabel: string;
  createdTimeLabel: string;
};

export type LeadActivityItem = {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  created_at: string | null;
  actor_name?: string | null;
};

export type LeadActivityDisplay = {
  id: string;
  type: string;
  typeLabel: string;
  title: string;
  description: string | null;
  actorName: string | null;
  createdAt: string | null;
  createdAtLabel: string;
  createdTimeLabel: string;
};

export type LeadNotesListResponse = LeadApiEnvelope<{ items: LeadNote[] } | LeadNote[]>;
export type LeadMessagesListResponse = LeadApiEnvelope<
  { items: LeadMessage[] } | LeadMessage[]
>;
export type LeadActivityListResponse = LeadApiEnvelope<
  { items: LeadActivityItem[] } | LeadActivityItem[]
>;

export type LeadDetailTab =
  | "overview"
  | "conversation"
  | "notes"
  | "timeline"
  | "close";
