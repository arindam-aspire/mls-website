/** Listing purpose sent to draft-submission API (`basic_information.listing_purpose`). */
export type PropertyDraftSubmissionListingPurpose = "sale" | "rent";

/** Fixed currency for draft-submission pricing (`pricing.currency`). */
export type PropertyDraftSubmissionCurrency = "JOD";

export type PropertyDraftSubmissionBasicInformation = {
  listing_purpose?: PropertyDraftSubmissionListingPurpose | null;
  category_id?: number | null;
  type_id?: number | null;
  title?: string;
  description?: string;
};

export type PropertyDraftSubmissionLocation = {
  city_id?: number | null;
  /** First item of `PropertyForm` `location_insert.area_ids`. */
  area_id?: number | null;
  address?: string;
};

export type PropertyDraftSubmissionOwnerDocument = {
  file_name?: string;
  url?: string;
};

export type PropertyDraftSubmissionOwner = {
  full_name?: string;
  email?: string;
  /** `country_code` + `phone_number` from `PropertyForm` owner row. */
  phone?: string;
  nationality?: string;
  /** From `PropertyForm` `social_security_id`. */
  ssi?: string;
  /** From `PropertyForm` `owner_address`. */
  address?: string;
  documents?: PropertyDraftSubmissionOwnerDocument[];
};

export type PropertyDraftSubmissionOwnerInformation = {
  owners?: PropertyDraftSubmissionOwner[];
};

export type PropertyDraftSubmissionPropertyDetails = {
  bedrooms?: number | null;
  bathrooms?: number | null;
  /** Parsed from `PropertyForm` `property_details.built_up_area` string. */
  built_up_area?: number | null;
  parking_spaces?: number | null;
  property_age?: string | null;
  /** From `PropertyForm` `property_details.total_floor`. */
  total_floors?: number | null;
  completion_status?: string | null;
  occupancy?: string | null;
  ownership_type?: string | null;
  reference_number?: string;
  /** From `PropertyForm` `property_details.permit_dld_number`. */
  permit_number?: string;
  orientation?: string | null;
};

export type PropertyDraftSubmissionPricing = {
  /** `0` when the form price field is empty. */
  price?: number;
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

/** Reserved for future video uploads; always sent as an empty array today. */
export type PropertyDraftSubmissionMediaVideo = never;

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
};

/** Request body for `POST /property-submissions` (create draft). */
export type PropertyDraftSubmissionRequestBody = {
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
