import type { ComponentProps } from "react";
import type { PropertyView } from "@abdoun/abdoun-library";

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
  status: string;
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
  user_id?: string;
}

// ── Favorites list (GET /favorites) ─────────────────────────────────────────

export type FavoriteListParams = {
  page: number;
  pageSize: number;
};

/** Nested property payload inside a favorite list item (API shape). */
export type FavoritePropertyPayload = Omit<
  PropertyListing,
  "is_favourite" | "favourite_id" | "property_hash" | "user_id"
> & {
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

export type RecentViewsListItem = FavoriteListItem;

export type RecentViewsListResponse = FavoriteListResponse;

export type RecentViewAddBody = FavoriteAddBody;

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
