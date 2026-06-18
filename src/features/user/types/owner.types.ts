export type OwnerListItem = {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyOwned: number;
  joinedAt: string;
  status: string;
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
};

export type OwnerListResponse = {
  success: boolean;
  message: string | null;
  data: {
    owners: OwnerListItem[];
    pagination: OwnerListPagination;
  } | null;
  error: unknown;
  meta?: {
    pagination?: OwnerListPagination;
  };
};

export type NormalizedOwnerListResponse = {
  owners: OwnerListItem[];
  pagination: OwnerListPagination;
};
