// ── Property list (GET /properties) ─────────────────────────────────────────

export type PropertyListParams = {
  page: number;
  pageSize: number;
  category: string;
  status: string;
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
}

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
  favourite_id?: string;
  property_hash?: string;
  user_id?: string;
}

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
