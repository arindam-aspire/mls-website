import type { ComponentProps } from "react";
import type { PropertyListingStatus, PropertyView } from "@abdoun/abdoun-library";

type PropertyViewProps = ComponentProps<typeof PropertyView>;

export type PropertyDetails = NonNullable<PropertyViewProps["propertyDetails"]>;

export type PropertyFeatureDefinition = NonNullable<
  PropertyViewProps["features"]
>[number];

// ── Property list (GET /properties) ─────────────────────────────────────────

export type PropertyListParams = {
  page: number;
  pageSize: number;
  category: string;
  status: string;
  sort?: string;
  type?: string;
  location?: string;
  city?: string;
  locations?: string;
  budgetMin?: number;
  budgetMax?: number;
  furnitureStatus?: string;
  bedrooms?: number;
  rooms?: number;
  bathrooms?: number;
  parking?: number;
  propertyAge?: string;
  floorLevel?: string;
  minArea?: number;
  maxArea?: number;
  minPlotArea?: number;
  maxPlotArea?: number;
  governorate?: string;
  directorate?: string;
  village?: string;
  parcelName?: string;
  amenities?: string;
  similar_to?: string;
  savedSearchId?: string;
};

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export type PropertyListResponse = {
  success: boolean;
  message: string | null;
  data?: {
    items?: PropertyListing[];
  } | null;
  error: unknown;
  meta?: {
    pagination?: PaginationMeta;
  };
};

export type PropertyListings = {
  items?: PropertyListing[];
  meta?: PaginationMeta;
};

export interface PropertyListing {
  id: number;
  property_id: string;
  reference_number: string | null;

  title: LocalizedText;
  description: LocalizedNullableText;

  price: string;
  status: PropertyListingStatus;
  category: string;

  searchPropertyType: string;
  city: string;
  areaName: string;
  propertyType: string;

  media: PropertyMedia;

  location: PropertyLocation;
  location_detail: PropertyLocation;

  beds: number;
  baths: number;

  area: string | null;
  acres: string | null;

  highlights: string;
  badges: string[];

  handover: string | null;
  paymentPlan: string | null;

  validatedDate: string;

  brokerName: string;
  brokerLogo: string | null;

  owners: PropertyOwner[];

  is_exclusive: boolean;
  is_favourite: boolean;
  is_favourite_loading?: boolean;
  is_delete_loading?: boolean;
  favourite_id?: string;
  property_hash?: string;
  property_hash_id?: string;
  user_id?: string;
}

// ── Agent properties list (GET /agent-properties) ───────────────────────────

export type AgentPropertiesListParams = {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  [key: string]: string | number | undefined;
};

/** Single row from `GET /agent-properties` (`data.items[]`). */
export type AgentPropertyListItem = {
  property_id: string;
  property_hash: number;
  title: string;
  listing_purpose: string;
  type_name: string;
  type_slug: string;
  category_name: string;
  category_slug: string;
  status_name: string;
  status_slug: string;
  price: string;
  currency: string;
  reference_number: string;
  created_at: string;
  updated_at: string;
  submission_id: string;
  submission_status: string;
  submission_submitted_at: string | null;
  submission_reviewed_at: string | null;
  submission_review_reason: string | null;
  submission_workflow_label: string;
  can_edit_submission: boolean;
  can_delete_submission: boolean;
  agency: unknown | null;
  submitted_by?: string | null;
  agent_user_id?: string | null;
  agent_name?: string | null;
  agent_email?: string | null;
  agent_phone?: string | null;
};

export type AgentPropertiesListData = {
  items: AgentPropertyListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type AgentPropertiesListResponse = {
  success: boolean;
  message: string | null;
  data: AgentPropertiesListData | null;
  error: unknown;
  meta?: {
    pagination?: PaginationMeta;
  };
};

export type AgentPropertiesListings = {
  items: AgentPropertyListItem[];
  meta?: PaginationMeta;
};

// ── Admin property submissions (GET /admin/property-submissions) ─────────────

export type AdminPropertySubmissionsListParams = {
  page: number;
  pageSize: number;
  status?: string;
};

/** Single row from `GET /admin/property-submissions` (`data.items[]`). */
export type AdminPropertySubmissionListItem = {
  submission_id: string;
  submitted_by: string;
  submitted_by_name: string;
  status: string;
  property_id: string;
  agent_user_id: string | null;
  agent_name: string | null;
  agent_email: string | null;
  agent_phone: string | null;
  has_assigned_agent: boolean;
  property_hash: number;
  property_title: string;
  property_reference_number: string | null;
  current_step: number;
  submitted_at: string;
  reviewed_at: string | null;
};

export type AdminPropertySubmissionsListData = {
  items: AdminPropertySubmissionListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type AdminPropertySubmissionsListResponse = {
  success: boolean;
  message: string | null;
  data: AdminPropertySubmissionsListData | null;
  error: unknown;
  meta?: {
    pagination?: PaginationMeta;
  };
};

export type AdminPropertySubmissionReviewApproveBody = {
  action: "approve";
};

export type AdminPropertySubmissionReviewRejectBody = {
  action: "reject";
  reason: string;
};

export type AdminPropertySubmissionReviewRequestBody =
  | AdminPropertySubmissionReviewApproveBody
  | AdminPropertySubmissionReviewRejectBody;

export type AdminPropertySubmissionReviewResponse = {
  success: boolean;
  message: string | null;
  data: unknown;
  error: unknown;
};

export type AdminPropertyAssignAgentRequestBody = {
  agent_id: string | null;
};

export type AdminPropertyAssignAgentResponse = {
  success: boolean;
  message: string | null;
  data: unknown;
  error: unknown;
};

// ── Agent property drafts (GET /agent-properties/drafts) ────────────────────

export type AgentPropertyDraftsListParams = {
  page: number;
  pageSize: number;
};

/** Single row from `GET /agent-properties/drafts` (`data.items[]`). */
export type AgentPropertyDraftListItem = {
  submission_id: string;
  status: string;
  current_step: number;
  last_completed_step: number;
  title: string | null;
  updated_at: string;
  can_edit: boolean;
  can_delete: boolean;
};

export type AgentPropertyDraftsListData = {
  items: AgentPropertyDraftListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type AgentPropertyDraftsListResponse = {
  success: boolean;
  message: string | null;
  data: AgentPropertyDraftsListData | null;
  error: unknown;
  meta?: {
    pagination?: PaginationMeta;
  };
};

// ── Favorites list (GET /favorites) ─────────────────────────────────────────

export type FavoriteListParams = {
  page: number;
  pageSize: number;
};

/** Nested property payload inside a favorite list item (API shape). */
export type FavoritePropertyPayload = Omit<
  PropertyListing,
  "is_favourite" | "favourite_id" | "property_hash" | "user_id" | "status"
> & {
  status: string | PropertyListingStatus;
  agency?: unknown | null;
};

export type FavoriteListItem = {
  id: string;
  user_id: string;
  property_hash: number;
  property: FavoritePropertyPayload;
};

export type FavoriteListResponse = {
  success: boolean;
  message: string | null;
  data?: {
    items?: FavoriteListItem[];
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
  } | null;
  error: unknown;
  meta?: {
    pagination?: PaginationMeta;
  };
};

export type FavoriteRemoveResponse = {
  success: boolean;
  message: string | null;
  data?: boolean | null;
  error: unknown;
  meta?: Record<string, unknown>;
};

export type FavoriteAddBody = {
  property_hash: number;
};

export type FavoriteAddResponse = {
  success: boolean;
  message: string | null;
  data?: FavoriteListItem | null;
  error: unknown;
  meta?: Record<string, unknown>;
};

// ── Recent views list (GET /users/recent-views) ───────────────────────────────

export type RecentViewsListParams = FavoriteListParams;

/** Nested property payload inside a recent-view list item (API shape). */
export type RecentViewsPropertyPayload = Omit<
  PropertyListing,
  | "is_favourite"
  | "favourite_id"
  | "property_hash"
  | "property_hash_id"
  | "user_id"
  | "status"
> & {
  status: string | PropertyListingStatus;
  agency?: unknown | null;
};

export type RecentViewsListItem = {
  id: string;
  user_id: string;
  property_hash_id?: number;
  /** Legacy list payload; mapped to `property_hash_id` when the new key is absent. */
  property_hash?: number;
  property: RecentViewsPropertyPayload;
};

export type RecentViewsListResponse = {
  success: boolean;
  message: string | null;
  data?: {
    items?: RecentViewsListItem[];
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
    hasNext?: boolean;
    hasPrevious?: boolean;
  } | null;
  error: unknown;
  meta?: {
    pagination?: PaginationMeta;
  };
};

export type RecentViewAddBody = {
  property_hash_id: number;
};

export type RecentViewAddResponse = {
  success: boolean;
  message: string | null;
  data?: RecentViewsListItem | null;
  error: unknown;
  meta?: Record<string, unknown>;
};

export type RecentViewsClearResponse = {
  success: boolean;
  message: string | null;
  data?: boolean | null;
  error: unknown;
  meta?: Record<string, unknown>;
};

export type RecentViewRemoveResponse = {
  success: boolean;
  message: string | null;
  data?: boolean | null;
  error: unknown;
  meta?: Record<string, unknown>;
};

export interface LocalizedText {
  en: string;
  ar: string;
  esp: string;
  fr: string;
}

export interface LocalizedNullableText {
  en: string | null;
  ar: string | null;
  esp: string | null;
  fr: string | null;
}

export interface PropertyMedia {
  thumbnail: string | null;

  images: PropertyImage[];
  videos: PropertyVideo[];

  virtual_tour_url: string | null;

  floor_plan_images: PropertyImage[];
  documents: PropertyDocument[];
}

export interface PropertyImage {
  id: number;

  url: string;
  thumb_url: string;

  is_primary: boolean;
  order: number;

  caption: string | null;
}

export interface PropertyVideo {
  id?: number;

  url?: string;
  thumb_url?: string;

  is_primary?: boolean;
  order?: number;

  caption?: string | null;
}

export interface PropertyDocument {
  id?: number;

  url: string;
  thumb_url?: string;

  is_primary?: boolean;
  order?: number;

  caption?: string | null;
}

export interface PropertyLocation {
  country_id: number;
  country: string;

  city_id: number;
  city: string;

  region_id: number;
  region: string;

  address: LocalizedText;

  latitude: number | null;
  longitude: number | null;

  map_embed_url: string | null;
}

export interface PropertyOwner {
  owner_id: string;

  full_name: string;

  email: string | null;
  phone: string | null;

  nationality: string | null;

  ssi: string | null;
  address: string | null;

  documents: OwnerDocument[];

  is_active: boolean;
}

export interface OwnerDocument {
  url: string;
  file_name?: string;
}

// ── Property details (GET /properties/:id) ──────────────────────────────────

export type PropertyDetailsResponse = {
  success: boolean;
  message: string | null;
  data?: PropertyDetails | null;
  error: unknown;
  meta?: Record<string, unknown>;
};

// ── Similar properties (GET /properties/:id/similar) ────────────────────────

export type PropertySimilarResponse = {
  success: boolean;
  message: string | null;
  data?: {
    items?: PropertyListing[];
  } | null;
  error: unknown;
  meta?: Record<string, unknown>;
};

// ── Feature catalog (GET /features) ─────────────────────────────────────────

export type FeatureGroup = "FEATURE" | "AMENITY";

export type FeatureCatalogCategory = {
  id: number;
  name: string;
  slug: string;
};

export type FeatureCatalogPropertyType = {
  id: number;
  category_id: number;
  name: string;
  slug: string;
};

export type FeatureCatalogItem = {
  id: number;
  name: string;
  slug: string;
  category_id: number | null;
  property_type_id: number | null;
  feature_group: FeatureGroup;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category: FeatureCatalogCategory | null;
  property_type: FeatureCatalogPropertyType | null;
};

export type FeatureCatalogResponse = {
  success: boolean;
  message: string | null;
  data?: {
    items?: FeatureCatalogItem[];
    total?: number;
  } | null;
  error: unknown;
  meta?: Record<string, unknown>;
};
