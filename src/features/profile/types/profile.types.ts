import type { ChangeEvent, RefObject } from "react";
import type { LoggedInUserResponse } from "@/src/features/auth/types/user.types";
import type {
  AgencyCurrency,
  AgencyMeasurementUnit,
} from "../constants/agencyPreferences";

export type EditEmailFormValues = {
  email: string;
};

export type EditPhoneFormValues = {
  phone_number: string;
};

export type ProfileInfoFieldKind = "name" | "role" | "email" | "phone";

export type ProfileInfoField = {
  label: string;
  value: string;
  kind?: ProfileInfoFieldKind;
  /** Omit when verification badge should not render (e.g. phone not provided). */
  verified?: boolean;
  editLabel?: string;
  onEdit?: () => void;
};

export type MyProfileCardUser = {
  full_name: string;
  profile_picture_url: string | null;
  email: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
};

export type ProfileAvatarUploadBindings = {
  fileInputRef: RefObject<HTMLInputElement | null>;
  onUploadClick: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveClick: () => void;
  isUploading: boolean;
  isRemoving: boolean;
  uploadingLabel: string;
  removingLabel: string;
};

export type MyProfileCardProps = {
  user: MyProfileCardUser;
  sectionTitle: string;
  fields: ProfileInfoField[];
  uploadPhotoLabel: string;
  photoHint: string;
  avatarUpload: ProfileAvatarUploadBindings;
  removeImageLabel: string;
  verifiedLabel: string;
  notVerifiedLabel: string;
};

export type Agency = {
  id: string;
  agency_name: string;
  agency_trade_name: string;
  legal_document_s3_link: string | null;
  email: string;
  phone: string;
  logo_url: string | null;
  profile_picture_url: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip_code: string | null;
  is_active: boolean;
  is_verified: boolean;
  status?: string;
  agency_status?: string;
  verification_status?: string;
  currency: AgencyCurrency;
  measurement_unit: AgencyMeasurementUnit;
  created_at: string;
  updated_at: string;
};

export type AgencyDisplayPreferenceItem = {
  title: string;
  description: string;
};

export type DisplayPreferenceOption<T extends string = string> = {
  value: T;
  code: string;
  name: string;
  symbol: string;
};

export type AgencySelectablePreference<T extends string> = AgencyDisplayPreferenceItem & {
  value: T;
  options: DisplayPreferenceOption<T>[];
  onSelect: (value: T) => void;
  /** When false, options are shown but selection does not call the API (upcoming). */
  interactive: boolean;
  isUpdating: boolean;
  disabled: boolean;
};

export type AgencyCurrencyPreference = AgencySelectablePreference<AgencyCurrency>;

export type AgencyMeasurementUnitPreference =
  AgencySelectablePreference<AgencyMeasurementUnit>;

/** PUT `/agency/{id}` response `data` shape. */
export type AgencyApiPayload = {
  agency: Agency;
  legal_document_upload?: unknown | null;
};

export type EditAgencyLicenseUploadProps = {
  label: string;
  uploadPrompt: string;
  uploadHint: string;
  selectedFileName: string | null;
  onFileSelect: (file: File) => void;
  error?: string;
  isUploading?: boolean;
  uploadingLabel?: string;
  disabled?: boolean;
};

export type AgencyProfileCardUser = {
  full_name: string;
  emailDisplay: string;
  phoneDisplay: string;
  hasPhone: boolean;
  is_email_verified: boolean;
  is_phone_verified: boolean;
};

export type AgencyProfileCardDisplayPreferences = {
  title: string;
  subtitle: string;
  currency: AgencyCurrencyPreference;
  measurementUnit: AgencyMeasurementUnitPreference;
};

export type AgencyProfileCardLabels = {
  agencyName: string;
  tradeName: string;
  license: string;
  downloadLicense: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  notProvided: string;
};

export type AgencyProfileCardProps = {
  agency: Agency;
  user: AgencyProfileCardUser;
  sectionTitle: string;
  labels: AgencyProfileCardLabels;
  uploadLogoLabel: string;
  avatarUpload: ProfileAvatarUploadBindings;
  removeLogoLabel: string;
  verifiedLabel: string;
  notVerifiedLabel: string;
  editEmailLabel: string;
  editPhoneLabel: string;
  editAgencyLabel: string;
  onEditEmail: () => void;
  onEditPhone: () => void;
  onEditAgency: () => void;
};

export type UpdateProfileRequest = {
  email: string;
  phone_number: string;
};

export type UpdateProfileResponse = LoggedInUserResponse;

export type ProfileUpdateRequestBody = {
  email?: string;
  phone_number?: string;
};

export type ProfileUpdateRequestData = {
  message: string;
  requires_verification: boolean;
  verification_fields: string[];
  dev_phone_otp: string | null;
  dev_email_otp: string | null;
  otp: string | null;
};

export type ProfileUpdateRequestResponse = {
  success: boolean;
  message: string | null;
  data: ProfileUpdateRequestData;
  error: unknown;
  meta: Record<string, unknown>;
};

export type ProfilePhoneVerifyBody = {
  phone_number: string;
  phone_otp: string;
};

export type ProfileEmailVerifyBody = {
  email: string;
  email_otp: string;
};

export type ProfileUpdateVerifyBody = ProfilePhoneVerifyBody | ProfileEmailVerifyBody;

export type ProfileUpdateVerifyData = {
  message: string;
};

export type ProfileUpdateVerifyResponse = {
  success: boolean;
  message: string | null;
  data: ProfileUpdateVerifyData;
  error: unknown;
  meta: Record<string, unknown>;
};

export type ProfilePictureUploadRequest = {
  file_name: string;
  content_type: string;
  file_size: number;
};

export type ProfilePictureUploadData = {
  upload_url: string;
  upload_http_method?: "PUT" | "POST";
  object_key?: string;
  signed_read_url?: string;
  file_url?: string;
};

export type ProfilePictureUploadResponse = {
  success: boolean;
  message: string | null;
  data: ProfilePictureUploadData;
  error: unknown;
  meta: Record<string, unknown>;
};

export type DeleteProfilePictureResponse = LoggedInUserResponse;

export type AgencyLogoUploadRequest = ProfilePictureUploadRequest;

export type AgencyLogoUploadResponse = ProfilePictureUploadResponse;

export type AgencyLegalDocumentUploadRequest = ProfilePictureUploadRequest;

export type AgencyLegalDocumentUploadResponse = ProfilePictureUploadResponse;

export type GetAgencyResponse = {
  success: boolean;
  message: string | null;
  /** GET may return the agency directly; PUT returns `{ agency, legal_document_upload }`. */
  data: Agency | AgencyApiPayload;
  error: unknown;
  meta: Record<string, unknown>;
};

/** After `normalizeGetAgencyResponse` — `data` is always the agency entity. */
export type NormalizedGetAgencyResponse = Omit<GetAgencyResponse, "data"> & {
  data: Agency;
};

/** PUT `/agency/{id}` body — include only keys whose values changed. */
export type UpdateAgencyRequest = Partial<{
  agency_name: string;
  agency_trade_name: string;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip_code: string | null;
  currency: AgencyCurrency;
  measurement_unit: AgencyMeasurementUnit;
}>;

export type UpdateAgencyResponse = {
  success: boolean;
  message: string | null;
  data: AgencyApiPayload;
  error: unknown;
  meta: Record<string, unknown>;
};

export type AgencyOfflineRegistrationRequest = {
  agency_name: string;
  agency_trade_name: string;
  email: string;
  phone: string;
  legal_document_s3_link?: string | null;
  website?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip_code?: string | null;
  currency?: AgencyCurrency;
  measurement_unit?: AgencyMeasurementUnit;
};

export type AgencyInvitationCreateRequest = {
  email: string;
  agency_name?: string | null;
  agency_trade_name?: string | null;
  phone?: string | null;
};

export type AgencyReviewRequest = {
  action: "approve" | "reject";
  reason?: string | null;
};

export type AgencyActivationRequest = {
  is_active: boolean;
};

export type AgencyPasswordSetupRequest = {
  token: string;
  password: string;
};

export type AgencyWorkflowResponseData = {
  agency: Agency;
  password_setup_token?: string | null;
  password_setup_link?: string | null;
};

export type AgencyWorkflowResponse = {
  success: boolean;
  message: string | null;
  data: AgencyWorkflowResponseData;
  error: unknown;
  meta: Record<string, unknown>;
};

export type AgencyInvitationResponseData = {
  id: string;
  email: string;
  agency_name: string | null;
  agency_trade_name: string | null;
  phone: string | null;
  status: string;
  invitation_link: string | null;
  expires_at: string | null;
  accepted_at: string | null;
  revoked_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type AgencyInvitationResponse = {
  success: boolean;
  message: string | null;
  data: AgencyInvitationResponseData;
  error: unknown;
  meta: Record<string, unknown>;
};

export type DeleteAgencyLogoResponse = GetAgencyResponse;

export type EditAgencyFormValues = {
  agency_name: string;
  agency_trade_name: string;
  website: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
};

// ── Agency list (GET /agency/list) ───────────────────────────────────────────

export type AgencyListParams = {
  skip?: number;
  limit?: number;
  search?: string;
  agencyStatus?: string;
  verificationStatus?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

/** Single row from `GET /agency/list` (`data[]`). */
export type AgencyListItemRaw = {
  id: string;
  agency_name: string;
  agency_trade_name: string;
  legal_document_s3_link: string | null;
  logo_url: string | null;
  email: string;
  phone: string;
  profile_picture_url: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip_code: string | null;
  currency: string;
  measurement_unit: string;
  is_active: boolean;
  is_verified: boolean;
  status?: string;
  agency_status?: string;
  verification_status?: string;
  created_at: string;
  updated_at: string;
};

/** Normalized row for select-agency UI. */
export type AgencyListItem = {
  id: string;
  agency_name: string;
  logo_url: string | null;
  email: string;
  phone: string;
  status: string;
  agency_status?: string;
  verification_status?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
};

export type AgencyListResponse = {
  success: boolean;
  message: string | null;
  data: AgencyListItemRaw[] | null;
  error: unknown;
  meta: Record<string, unknown>;
};

export type NormalizedAgencyListResponse = {
  items: AgencyListItem[];
  total: number;
  skip: number;
  limit: number;
};

// ── User agency (PATCH /users/agency) — see `src/features/user/types/user.types.ts` ──

export type { AssignUserAgencyRequest, AssignUserAgencyResponse } from "@/src/features/user/types";
