export type OwnerListItem = {
  owner_id: string;
  full_name: string;
  email: string;
  phone: string;
  nationality: string | null;
  ssi: string | null;
  address: string | null;
  documents: unknown[];
  created_at: string;
  updated_at: string;
  /** Present when the API returns owner status. */
  status?: string;
  /** Present when the API returns a property count. */
  property_owned?: number;
  /** Present when the API returns a linked leads count. */
  leads_count?: number;
  linked_leads?: number;
  assigned_agencies?: {
    id: string;
    agency_name: string;
    is_primary: boolean;
    created_at: string | null;
  }[];
};

export type OwnerListPagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type OwnerListParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  agencyId?: string;
};

export type OwnerListResponseData = OwnerListPagination & {
  items: OwnerListItem[];
};

export type OwnerListResponse = {
  success: boolean;
  message: string | null;
  data: OwnerListResponseData | null;
  error: unknown;
  meta?: {
    pagination?: OwnerListPagination;
  };
};

export type NormalizedOwnerListResponse = {
  owners: OwnerListItem[];
  pagination: OwnerListPagination;
};

export type AssignOwnerAgencyRequest = {
  agency_id: string;
};

export type AssignOwnerAgencyResponse = {
  success: boolean;
  message: string | null;
  data: {
    id: string;
    owner_id: string;
    agency_id: string;
    relationship_type: string;
    status: string;
    is_primary: boolean;
  };
  error: unknown;
  meta: Record<string, unknown>;
};

export type OwnerStatusUpdateRequest = {
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE" | string;
  reason?: string;
};

export type OwnerStatusUpdateResponse = {
  success: boolean;
  message: string | null;
  data: OwnerListItem | null;
  error: unknown;
  meta?: Record<string, unknown>;
};

export type OwnerStatusUpdateResult = {
  message: string;
  owner: OwnerListItem;
};

export type UpdateOwnerRequest = {
  full_name?: string;
  email?: string;
  phone?: string;
};

export type UpdateOwnerResponse = {
  success: boolean;
  message: string | null;
  data: OwnerListItem | null;
  error: unknown;
  meta?: Record<string, unknown>;
};

export type UpdateOwnerResult = {
  message: string;
  owner: OwnerListItem;
};

export type OwnerDetailResponse = {
  success: boolean;
  message: string | null;
  data: OwnerListItem | null;
  error: unknown;
  meta?: Record<string, unknown>;
};

export type OwnerLinkedPropertyItem = {
  id: string;
  title?: string | null;
  reference?: string | null;
  status?: string | null;
  city?: string | null;
  listing_type?: string | null;
};

export type OwnerLinkedLeadItem = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  status?: string | null;
  created_at?: string | null;
};

export type OwnerLinkedListParams = {
  page?: number;
  pageSize?: number;
};

export type OwnerLinkedListResponseData<T> = OwnerListPagination & {
  items: T[];
};

export type OwnerLinkedListResponse<T> = {
  success: boolean;
  message: string | null;
  data: OwnerLinkedListResponseData<T> | null;
  error: unknown;
  meta?: {
    pagination?: OwnerListPagination;
  };
};

export type NormalizedOwnerLinkedListResponse<T> = {
  items: T[];
  pagination: OwnerListPagination;
};
