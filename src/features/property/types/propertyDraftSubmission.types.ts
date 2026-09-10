import type { BuiltUpAreaUnit } from "@abdoun/abdoun-library";
import type { AgencyCurrency } from "@/src/features/profile/constants/agencyPreferences";

/** Listing purpose sent to draft-submission API (`basic_information.listing_purpose`). */
export type PropertyDraftSubmissionListingPurpose = "sale" | "rent" | (string & {});

/** Agency currency for draft-submission pricing (`pricing.currency`). */
export type PropertyDraftSubmissionCurrency = AgencyCurrency;

export type PropertyDraftSubmissionBasicInformation = {
  listing_purposes?: string[];
  listing_purpose?: PropertyDraftSubmissionListingPurpose | null;
  category_id?: number | null;
  type_id?: number | null;
  title?: string;
  description?: string;
};

export type PropertyDraftSubmissionLocation = {
  city_id?: number | null;
  /** Selected area for Add Property (single-select). */
  area_id?: number | null;
  /** Legacy multi-area drafts; first item hydrates `area_id`. */
  area_ids?: number[];
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  apartment_number?: string;
  plot_number?: string;
  basin_number?: string;
  parcel_number?: string;
  building_number?: string;
  identification_fields?: Record<string, string>;
  /** Whether all roles may view the Location tab on published property details. */
  show_location?: boolean;
};

export type PropertyDraftSubmissionOwnerDocument = {
  file_name?: string;
  url?: string;
};

export type PropertyDraftSubmissionOwner = {
  owner_id?: string;
  full_name?: string;
  email?: string;
  /** `country_code` + `phone_number` from `PropertyForm` owner row. */
  phone?: string;
  nationality?: string;
  /** From `PropertyForm` `social_security_id`. */
  ssi?: string;
  documents?: PropertyDraftSubmissionOwnerDocument[];
};

export type PropertyDraftSubmissionOwnerInformation = {
  owner_id?: string | null;
  owner_mode?: "search" | "create";
  owners?: PropertyDraftSubmissionOwner[];
};

export type PropertyDraftMasterOptionValue =
  | string
  | number
  | {
      id?: string | number | null;
      value?: string | number | null;
      slug?: string | number | null;
      code?: string | number | null;
      name?: string | null;
    }
  | null;

export type PropertyDraftSubmissionPropertyDetails = {
  bedrooms?: number | null;
  bathrooms?: number | null;
  /** Parsed from `PropertyForm` `property_details.built_up_area` string. */
  built_up_area?: number | null;
  /** Unit used by the split built-up-area control; submitted values are normalized to `SQM`. */
  built_up_area_unit?: BuiltUpAreaUnit;
  parking_spaces?: number | null;
  year_built?: number | null;
  /** Legacy bucket or year; preserved on hydrate, omitted from new payloads. */
  property_age?: string | number | null;
  /** Master-table id or slug from `PropertyForm` `property_details.furnishing_status`. */
  furnishing_status?: PropertyDraftMasterOptionValue;
  /** Alternate GET keys for furnishing; hydrate-only. */
  furnishingStatus?: PropertyDraftMasterOptionValue;
  furniture_status?: PropertyDraftMasterOptionValue;
  furnishing_status_id?: PropertyDraftMasterOptionValue;
  furniture_status_id?: PropertyDraftMasterOptionValue;
  /** Master-table id or slug from `PropertyForm` `property_details.floor_level`. */
  floor_level?: PropertyDraftMasterOptionValue;
  /** Alternate GET keys for floor; hydrate-only. */
  floorLevel?: PropertyDraftMasterOptionValue;
  floor?: PropertyDraftMasterOptionValue;
  floor_id?: PropertyDraftMasterOptionValue;
  floor_level_id?: PropertyDraftMasterOptionValue;
  /** From `PropertyForm` `property_details.total_floor`. */
  total_floors?: number | null;
  completion_status?: string | null;
  occupancy?: string | null;
  ownership_type?: string | null;
  reference_number?: string;
  /** @deprecated Removed from Add Property UI; still accepted when hydrating old drafts. */
  permit_number?: string;
  orientation?: string | null;
  /** From `PropertyForm` `property_details.guard_name`. */
  guard_name?: string;
  /** Merged `guard_country_code` + `guard_phone_number` from `PropertyForm` property details. */
  guard_phone_number?: string;
  /** @deprecated Legacy draft payloads; prefer `guard_phone_number`. */
  guard_phone?: string;
};

export type PropertyDraftSubmissionPricing = {
  /** `0` when the form price field is empty. */
  price?: number;
  furnished_sale_price?: number;
  unfurnished_sale_price?: number;
  furnished_rent_price?: number;
  unfurnished_rent_price?: number;
  semi_furnished_rent_price?: number;
  additional_prices?: Record<string, number>;
  service_charge?: number;
  maintenance_fee?: number;
  currency?: PropertyDraftSubmissionCurrency;
};

export type PropertyDraftSubmissionAmenities = {
  /** Feature catalog ids (`featuresAndAmenities[].id`), e.g. `[47, 54, 60]`. */
  feature_ids?: number[];
};

export type PropertyDraftSubmissionMediaImage = {
  file_name?: string;
  url?: string;
  /** First image in the list. */
  is_primary?: boolean;
  display_order?: number;
};

export type PropertyDraftSubmissionMediaVideo = {
  file_name?: string;
  url?: string;
  display_order?: number;
};

export type PropertyDraftSubmissionMediaDocument = {
  file_name?: string;
  url?: string;
  display_order?: number;
};

export type PropertyDraftSubmissionMediaDocuments = {
  images?: PropertyDraftSubmissionMediaImage[];
  videos?: PropertyDraftSubmissionMediaVideo[];
  documents?: PropertyDraftSubmissionMediaDocument[];
  youtube_url?: string;
  /** Empty form value is sent as `null`. */
  virtual_tour_url?: string | null;
};

export type PropertyDraftSubmissionReviewSubmit = {
  /** Draft saves default to `false` unless explicitly set. */
  terms_accepted?: boolean;
  privacy_accepted?: boolean;
  public_display_authorized?: boolean;
  fees_acknowledged?: boolean;
};

/** Mapped submission sections inside `payload`. Every key optional for partial drafts. */
export type PropertyDraftSubmissionPayload = {
  basic_information?: PropertyDraftSubmissionBasicInformation;
  location?: PropertyDraftSubmissionLocation;
  owner_information?: PropertyDraftSubmissionOwnerInformation;
  property_details?: PropertyDraftSubmissionPropertyDetails;
  pricing?: PropertyDraftSubmissionPricing;
  amenities?: PropertyDraftSubmissionAmenities;
  media_documents?: PropertyDraftSubmissionMediaDocuments;
  review_submit?: PropertyDraftSubmissionReviewSubmit;
  /** Some GET draft responses return floor next to the section objects. */
  floor?: PropertyDraftMasterOptionValue;
};

/** Request body for `POST /property-submissions` (create draft). */
export type PropertyDraftSubmissionRequestBody = {
  route_through_agency: boolean;
  agency_id?: string | null;
  payload: PropertyDraftSubmissionPayload;
  /** Active `PropertyForm` step index when saving. */
  current_step: number;
  /** Furthest step the user has completed when saving. */
  last_completed_step: number;
};

export type PropertyDraftSubmissionSaveAction = "save_draft";

/** Request body for `PATCH /property-submissions/{submissionId}` (update draft). */
export type PropertyDraftSubmissionUpdateRequestBody = {
  action: PropertyDraftSubmissionSaveAction;
  route_through_agency: boolean;
  agency_id?: string | null;
  current_step: number;
  /** Furthest step the user has completed when saving. */
  last_completed_step: number;
  payload: PropertyDraftSubmissionPayload;
};

export type PropertyDraftSubmissionStepCompletion = {
  pricing: boolean;
  location: boolean;
  amenities: boolean;
  review_submit: boolean;
  media_documents: boolean;
  property_details: boolean;
  basic_information: boolean;
  owner_information: boolean;
};

export type PropertyDraftSubmissionData = {
  submission_id: string;
  submitted_by?: string | null;
  route_through_agency?: boolean;
  agency_id?: string | null;
  status: string;
  workflow_stage?: string | null;
  current_actor?: string | null;
  submission_origin?: string | null;
  assigned_agent_id?: string | null;
  current_step: number;
  last_completed_step: number;
  step_completion: PropertyDraftSubmissionStepCompletion;
  payload: PropertyDraftSubmissionPayload;
  /** Some GET responses return floor on the data object. */
  floor?: PropertyDraftMasterOptionValue;
  reviewed_by?: string | null;
  reviewed_at?: string | null;
  review_reason?: string | null;
};

export type PropertyDraftSubmissionResponse = {
  success: boolean;
  message: string | null;
  data: PropertyDraftSubmissionData | null;
  error: unknown;
  meta?: Record<string, unknown>;
};

/** Request body for `POST /property-submissions/submit` (no existing draft id). */
export type PropertySubmissionDirectSubmitRequestBody = {
  route_through_agency: boolean;
  agency_id?: string | null;
  payload: PropertyDraftSubmissionPayload;
  confirm_submit: true;
};

/** Request body for `POST /property-submissions/{submissionId}/submit`. */
export type PropertyDraftSubmissionSubmitRequestBody = {
  confirm_submit: true;
};

export type PropertyDraftSubmissionSubmitResponse = {
  success: boolean;
  message: string | null;
  data: PropertyDraftSubmissionData | null;
  error: unknown;
  meta?: Record<string, unknown>;
};

/** Response from `DELETE /property-submissions/{submissionId}`. */
export type PropertySubmissionDeleteResponse = {
  success: boolean;
  message: string | null;
  data: unknown;
  error: unknown;
};
