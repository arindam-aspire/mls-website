export type SaveSearchFilterItem = {
  key: string;
  label: string;
  value: string;
};

/** Criteria sent to POST /saved-searches (string values per API contract). */
export type SavedSearchCriteria = {
  status?: string;
  category?: string;
  type?: string;
  location?: string;
  city?: string;
  locations?: string;
  budgetMin?: string;
  budgetMax?: string;
  furnitureStatus?: string;
  bedrooms?: string;
  bathrooms?: string;
  parking?: string;
  propertyAge?: string;
  minArea?: string;
  maxArea?: string;
  minPlotArea?: string;
  maxPlotArea?: string;
  governorate?: string;
  directorate?: string;
  village?: string;
  parcelName?: string;
  amenities?: string;
  rooms?: string;
  floorLevel?: string;
};

export type CreateSavedSearchRequest = {
  name: string;
  search_criteria: SavedSearchCriteria;
  notification_enabled: boolean;
};

export type SavedSearchRecord = {
  id: string;
  name: string;
  search_criteria: SavedSearchCriteria;
  query_string: string;
  notification_enabled: boolean;
  last_run_at: string | null;
};

export type CreateSavedSearchResponse = {
  success: boolean;
  message: string | null;
  data: SavedSearchRecord | null;
  error: unknown;
  meta: Record<string, unknown>;
};

export type UpdateSavedSearchRequest = {
  name: string;
  search_criteria: SavedSearchCriteria;
};

export type UpdateSavedSearchResponse = CreateSavedSearchResponse;

export type SavedSearchListParams = {
  page: number;
  pageSize: number;
};

export type SavedSearchListData = {
  items: SavedSearchRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type SavedSearchListResponse = {
  success: boolean;
  message: string | null;
  data: SavedSearchListData | null;
  error: unknown;
  meta: Record<string, unknown>;
};

export type SaveSearchFormValues = {
  name: string;
};

export type SaveSearchSubmitPayload = {
  filterItems: SaveSearchFilterItem[];
  searchCriteria: SavedSearchCriteria;
};
