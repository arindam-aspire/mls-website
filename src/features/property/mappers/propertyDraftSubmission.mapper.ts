import type { AgencyCurrency } from "@/src/features/profile/constants/agencyPreferences";
import type { PropertyArrangementId } from "@/src/features/property/constants/propertyArrangement.constants";
import { PROPERTY_DRAFT_SUBMISSION_SAVE_ACTION } from "@/src/features/property/constants/propertyCreate.constants";
import { PENDING_PROPERTY_REFERENCE_NUMBER } from "@/src/features/property/constants/propertyForm.constants";
import type {
  PropertyDraftSubmissionCurrency,
  PropertyDraftSubmissionData,
  PropertyDraftSubmissionLocation,
  PropertyDraftSubmissionPayload,
  PropertyDraftSubmissionPropertyDetails,
  PropertyDraftSubmissionRequestBody,
  PropertyDraftSubmissionReviewSubmit,
  PropertyDraftSubmissionUpdateRequestBody,
  PropertySubmissionDirectSubmitRequestBody,
} from "@/src/features/property/types/propertyDraftSubmission.types";
import {
  buildOwnerPhone,
  parseOwnerPhoneForForm,
  toOptionalTrimmedString,
} from "@/src/features/property/utils/propertyOwnerPhone.utils";
import {
  EMPTY_PROPERTY_FORM_OPTIONS_CATALOG,
  resolvePropertyFormMasterOptionValue,
} from "@/src/features/property/mappers/propertyFormOptions.mapper";
import type { PropertyFormOptionsCatalog } from "@/src/features/property/types/propertyFormOptions.types";
import {
  applyPropertyLocationDls,
  extractPropertyLocationDls,
} from "@/src/features/property/mappers/dlsLocations.mapper";
import type { PropertyLocationDlsSelection } from "@/src/features/property/types/dls.types";
import type { PropertyLocationIdentificationSnapshot } from "@/src/features/property/utils/propertyIdentificationFields.utils";
import {
  isBrowserDisplayableFileUrl,
  rememberPersistedUploadReference,
  resolvePersistableFileUri,
} from "@/src/lib/resolveUploadedFileUrl";
import type {
  BuiltUpAreaUnit,
  PropertyFormProps,
  PropertyFormValues,
} from "@abdoun/abdoun-library";

type FeaturesAndAmenities = PropertyFormProps["featuresAndAmenities"];
type FeaturesAndAmenityItem = FeaturesAndAmenities[number];
type PropertyFormLocationWithHostFields = NonNullable<
  PropertyFormValues["location_insert"]
> &
  Partial<PropertyLocationDlsSelection> & {
    show_location?: boolean;
  };

function toOutboundReferenceNumber(
  value: string | null | undefined,
): string | undefined {
  const trimmed = toOptionalTrimmedString(value);
  if (!trimmed || trimmed === PENDING_PROPERTY_REFERENCE_NUMBER) {
    return undefined;
  }
  return trimmed;
}

function toFormReferenceNumber(value: string | null | undefined): string {
  const trimmed = toOptionalTrimmedString(value);
  if (!trimmed || trimmed === PENDING_PROPERTY_REFERENCE_NUMBER) {
    return PENDING_PROPERTY_REFERENCE_NUMBER;
  }
  return trimmed;
}

export function getPropertyFormShowLocation(
  propertyDetails: PropertyFormValues,
): boolean {
  const location = propertyDetails.location_insert as
    | PropertyFormLocationWithHostFields
    | undefined;

  return location?.show_location ?? false;
}

function mapLocationIdentificationForPayload(
  location: PropertyFormValues["location_insert"] | undefined,
  options?: { persistParcelNumberInIdentificationFields?: boolean },
): Pick<
  PropertyDraftSubmissionLocation,
  | "apartment_number"
  | "plot_number"
  | "parcel_number"
  | "building_number"
  | "identification_fields"
> {
  const identificationSource = location?.identification_fields ?? {};
  const identification_fields: Record<string, string> = {};

  const floorNumber = toOptionalTrimmedString(identificationSource.floor_number);
  const section = toOptionalTrimmedString(identificationSource.section);
  const parcelNumber =
    toOptionalTrimmedString(location?.parcel_number) ||
    toOptionalTrimmedString(identificationSource.parcel_number);

  if (floorNumber) {
    identification_fields.floor_number = floorNumber;
  }
  if (section) {
    identification_fields.section = section;
  }
  if (options?.persistParcelNumberInIdentificationFields && parcelNumber) {
    identification_fields.parcel_number = parcelNumber;
  }

  return {
    apartment_number: toOptionalTrimmedString(location?.apartment_number),
    plot_number: toOptionalTrimmedString(location?.plot_number),
    parcel_number: parcelNumber,
    building_number: toOptionalTrimmedString(location?.building_number),
    identification_fields:
      Object.keys(identification_fields).length > 0
        ? identification_fields
        : undefined,
  };
}

function hydrateLocationIdentificationFields(
  location: PropertyDraftSubmissionLocation,
): Record<string, string> {
  const identificationFields: Record<string, string> = {
    ...(location.identification_fields ?? {}),
  };

  if (!String(identificationFields.section ?? "").trim()) {
    const sheet = location.sheet_number;
    if (sheet != null && String(sheet).trim()) {
      identificationFields.section = String(sheet).trim();
    }
  }

  return identificationFields;
}

export function extractPropertyFormDls(
  propertyDetails: PropertyFormValues,
): PropertyLocationDlsSelection {
  return extractPropertyLocationDls(
    propertyDetails.location_insert as Record<string, unknown> | undefined,
  );
}

export function withPropertyFormHostLocationFields(
  propertyDetails: PropertyFormValues,
  extras: {
    showLocation: boolean;
    dls?: PropertyLocationDlsSelection;
    identification?: PropertyLocationIdentificationSnapshot;
  },
): PropertyFormValues {
  const location = (propertyDetails.location_insert ??
    {}) as PropertyFormLocationWithHostFields;
  const dls =
    extras.dls ??
    extractPropertyLocationDls(location as Record<string, unknown>);
  const identification = extras.identification;
  const locationIdentificationFields =
    location.identification_fields &&
    typeof location.identification_fields === "object"
      ? location.identification_fields
      : {};

  return {
    ...propertyDetails,
    location_insert: applyPropertyLocationDls(
      {
        city_id: null,
        area_id: null,
        area_ids: [],
        address: "",
        latitude: null,
        longitude: null,
        apartment_number: "",
        plot_number: "",
        basin_number: "",
        parcel_number: "",
        building_number: "",
        identification_fields: {},
        ...location,
        apartment_number:
          identification?.apartment_number || location.apartment_number || "",
        plot_number: identification?.plot_number || location.plot_number || "",
        parcel_number:
          identification?.parcel_number || location.parcel_number || "",
        building_number:
          identification?.building_number || location.building_number || "",
        identification_fields: {
          ...locationIdentificationFields,
          ...(identification?.identification_fields ?? {}),
        },
        show_location: extras.showLocation,
      },
      dls,
    ),
  } as PropertyFormValues;
}

export function withPropertyFormShowLocation(
  propertyDetails: PropertyFormValues,
  showLocation: boolean,
): PropertyFormValues {
  return withPropertyFormHostLocationFields(propertyDetails, { showLocation });
}

function matchesFeaturesAndAmenitiesTaxonomy(
  item: FeaturesAndAmenityItem,
  categoryId: number | null,
  propertyTypeId: number | null,
): boolean {
  if (item.category_id != null) {
    if (categoryId == null || item.category_id !== categoryId) {
      return false;
    }
  }

  if (item.property_type_id != null) {
    if (propertyTypeId == null || item.property_type_id !== propertyTypeId) {
      return false;
    }
  }

  return true;
}

function getFilteredFeaturesAndAmenitiesCatalog(
  featuresAndAmenities: FeaturesAndAmenities,
  categoryId: number | null,
  propertyTypeId: number | null,
): FeaturesAndAmenityItem[] {
  if (categoryId == null || propertyTypeId == null) {
    return [];
  }

  return featuresAndAmenities.filter((item) =>
    matchesFeaturesAndAmenitiesTaxonomy(item, categoryId, propertyTypeId),
  );
}

function parseOptionalNumber(value: string | null | undefined): number | null {
  if (value == null || value.trim() === "") {
    return null;
  }

  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function toDraftMasterOptionValue(
  value: string | number | null | undefined,
): string | number | null {
  if (value == null) {
    return null;
  }

  const trimmed = String(value).trim();
  if (!trimmed) {
    return null;
  }

  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed);
  }

  return trimmed;
}

function readDraftMasterOptionField(
  details: PropertyDraftSubmissionPropertyDetails,
  keys: Array<keyof PropertyDraftSubmissionPropertyDetails>,
): unknown {
  for (const key of keys) {
    const value = details[key];
    if (value != null && value !== "") {
      return value;
    }
  }

  return null;
}

const SQUARE_FEET_TO_SQUARE_METERS = 0.09290304;

function normalizeBuiltUpAreaToSquareMeters(
  value: string,
  unit: BuiltUpAreaUnit,
): number | null {
  const parsed = parseOptionalNumber(value);

  if (parsed == null || unit === "SQM") {
    return parsed;
  }

  return Number((parsed * SQUARE_FEET_TO_SQUARE_METERS).toFixed(8));
}

function formatBuiltUpAreaField(
  value: number | null | undefined,
  unit: BuiltUpAreaUnit | undefined,
): string {
  if (value == null) {
    return "";
  }

  if (unit === "SQFT") {
    return formatNumberField(
      Number((value * SQUARE_FEET_TO_SQUARE_METERS).toFixed(4)),
    );
  }

  return formatNumberField(value);
}

function parsePrice(value: string | undefined): number {
  if (value == null || value.trim() === "") {
    return 0;
  }

  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

const PROPERTY_MEDIA_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const PROPERTY_MEDIA_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
const PROPERTY_MEDIA_VIDEO_MIME_TYPES = ["video/mp4", "video/quicktime"];
const PROPERTY_MEDIA_VIDEO_EXTENSIONS = [".mp4", ".mov"];
const PROPERTY_DOCUMENT_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const PROPERTY_DOCUMENT_EXTENSIONS = [".pdf", ".doc", ".docx"];

function hasAcceptedFileExtension(name: string | undefined, extensions: string[]): boolean {
  const lowerName = name?.toLowerCase() ?? "";
  return extensions.some((extension) => lowerName.endsWith(extension));
}

function isVideoMediaFile(file: { name?: string; mimeType?: string | null }): boolean {
  return (
    PROPERTY_MEDIA_VIDEO_MIME_TYPES.includes(file.mimeType ?? "") ||
    hasAcceptedFileExtension(file.name, PROPERTY_MEDIA_VIDEO_EXTENSIONS)
  );
}

function isImageMediaFile(file: { name?: string; mimeType?: string | null }): boolean {
  return (
    PROPERTY_MEDIA_IMAGE_MIME_TYPES.includes(file.mimeType ?? "") ||
    hasAcceptedFileExtension(file.name, PROPERTY_MEDIA_IMAGE_EXTENSIONS)
  );
}

function isPropertyDocumentFile(file: { name?: string; mimeType?: string | null }): boolean {
  return (
    PROPERTY_DOCUMENT_MIME_TYPES.includes(file.mimeType ?? "") ||
    hasAcceptedFileExtension(file.name, PROPERTY_DOCUMENT_EXTENSIONS)
  );
}

type OwnerFormDocument = {
  name: string;
  uri: string;
};

function mapOwnerDocuments(documents: OwnerFormDocument[] | undefined) {
  if (!documents?.length) {
    return [];
  }

  return documents
    .filter((document) => document.uri?.trim())
    .map((document) => ({
      file_name: document.name || undefined,
      url: resolvePersistableFileUri(document.uri),
    }));
}

type DraftMediaFile = {
  file_name?: string;
  url?: string;
  signed_read_url?: string;
  thumb_url?: string;
  object_key?: string;
};

function toFormMediaFields(file: DraftMediaFile): {
  uri: string;
  previewUri?: string;
} {
  const persistUri = (file.object_key ?? file.url ?? "").trim();
  const displayUri =
    [file.signed_read_url, file.thumb_url, file.url]
      .map((value) => value?.trim() ?? "")
      .find((value) => isBrowserDisplayableFileUrl(value)) ?? "";

  if (displayUri && persistUri) {
    rememberPersistedUploadReference(displayUri, persistUri);
  }

  return {
    uri: persistUri || displayUri,
    previewUri: displayUri || undefined,
  };
}

function mapSelectedAmenitiesToFeatureIds(
  selected: string[],
  featuresAndAmenities: FeaturesAndAmenities,
  categoryId: number | null,
  propertyTypeId: number | null,
): number[] {
  const catalog = getFilteredFeaturesAndAmenitiesCatalog(
    featuresAndAmenities,
    categoryId,
    propertyTypeId,
  );

  if (catalog.length === 0 || selected.length === 0) {
    return [];
  }

  const featureIds: number[] = [];

  for (const value of selected) {
    const item = catalog.find((entry) => entry.name === value || entry.slug === value);
    if (item != null && !featureIds.includes(item.id)) {
      featureIds.push(item.id);
    }
  }

  return featureIds;
}

const PROPERTY_DRAFT_SUBMISSION_DEFAULT_CURRENCY: PropertyDraftSubmissionCurrency = "JOD";

function resolvePropertyDraftSubmissionCurrency(
  currency?: PropertyDraftSubmissionCurrency,
): PropertyDraftSubmissionCurrency {
  return currency ?? PROPERTY_DRAFT_SUBMISSION_DEFAULT_CURRENCY;
}

/** Maps agency display currency to draft-submission pricing (API currently accepts JOD only). */
export function toPropertyDraftSubmissionCurrency(
  currency?: AgencyCurrency,
): PropertyDraftSubmissionCurrency {
  return currency === "JOD" ? "JOD" : PROPERTY_DRAFT_SUBMISSION_DEFAULT_CURRENCY;
}

export type BuildPropertyDraftSubmissionPayloadOptions = {
  /** When true, all review flags are sent as accepted (submit path after library validation). */
  forSubmit?: boolean;
  /** Whether an owner/super-admin submission should be routed through an agency. */
  routeThroughAgency?: boolean;
  /** Selected agency for owner-created listings; backend falls back to auth context for agency users. */
  agencyId?: string | null;
  /** Agency display currency; defaults to JOD when omitted. */
  currency?: PropertyDraftSubmissionCurrency;
  /** When `land`, parcel number is also persisted on `identification_fields`. */
  arrangement?: PropertyArrangementId;
};

function mapReviewSubmit(
  propertyDetails: PropertyFormValues,
  options?: BuildPropertyDraftSubmissionPayloadOptions,
): PropertyDraftSubmissionReviewSubmit {
  if (options?.forSubmit) {
    return {
      terms_accepted: true,
      privacy_accepted: true,
      public_display_authorized: true,
      fees_acknowledged: true,
    };
  }

  const terms = propertyDetails.terms_acceptance;

  return {
    terms_accepted: terms?.terms_accepted ?? false,
    privacy_accepted: terms?.privacy_accepted ?? false,
    public_display_authorized: terms?.public_display_authorized ?? false,
    fees_acknowledged: terms?.fees_acknowledged ?? false,
  };
}

export function buildPropertyDraftSubmissionPayload(
  propertyDetails: PropertyFormValues,
  featuresAndAmenities: FeaturesAndAmenities,
  options?: BuildPropertyDraftSubmissionPayloadOptions,
): PropertyDraftSubmissionPayload {
  const basicInfo = propertyDetails.basic_info;
  const location = propertyDetails.location_insert;
  const details = propertyDetails.property_details;
  const owners = propertyDetails.owner_info?.owners ?? [];
  const pricing = propertyDetails.pricing_details;
  const selectedAmenities = propertyDetails.amenities?.selected_amenities ?? [];
  const media = propertyDetails.media_upload;

  const categoryId = basicInfo?.category_id ?? null;
  const propertyTypeId = basicInfo?.type_id ?? null;

  const payload: PropertyDraftSubmissionPayload = {};

  if (basicInfo != null) {
    const listingPurposes = Array.from(
      new Set(
        (basicInfo.listing_purposes ?? [])
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    );

    if (listingPurposes.length === 0 && basicInfo.listing_purpose?.trim()) {
      listingPurposes.push(basicInfo.listing_purpose.trim());
    }

    const listingPurpose =
      listingPurposes.length === 1 ? listingPurposes[0] : undefined;

    payload.basic_information = {
      listing_purposes: listingPurposes.length > 0 ? listingPurposes : undefined,
      listing_purpose:
        listingPurpose === "sale" || listingPurpose === "rent"
          ? listingPurpose
          : undefined,
      category_id: basicInfo.category_id,
      type_id: basicInfo.type_id,
      title: basicInfo.title || undefined,
      description: basicInfo.description || undefined,
    };
  }

  const dls = extractPropertyLocationDls(
    location as Record<string, unknown> | undefined,
    details as Record<string, unknown> | undefined,
  );

  if (location != null) {
    payload.location = applyPropertyLocationDls(
      {
        latitude: location.latitude ?? null,
        longitude: location.longitude ?? null,
        show_location: getPropertyFormShowLocation(propertyDetails),
        ...mapLocationIdentificationForPayload(location, {
          persistParcelNumberInIdentificationFields:
            options?.arrangement === "land",
        }),
      },
      dls,
    );
  }

  if (owners.length > 0) {
    const ownerInfo = propertyDetails.owner_info;
    payload.owner_information = {
      owner_id: ownerInfo?.owner_id ?? owners.find((owner) => owner.owner_id)?.owner_id ?? null,
      owner_mode: ownerInfo?.owner_mode,
      owners: owners.map((owner) => ({
        owner_id: owner.owner_id,
        full_name: toOptionalTrimmedString(owner.full_name || owner.owner_name),
        email: toOptionalTrimmedString(owner.email),
        phone: buildOwnerPhone(owner.country_code, owner.phone_number),
        nationality: toOptionalTrimmedString(owner.nationality),
        ssi: toOptionalTrimmedString(owner.ssi || owner.social_security_id),
        documents: mapOwnerDocuments(owner.owner_documents),
      })),
    };
  }

  if (details != null) {
    const builtUpAreaUnit = details.built_up_area_unit ?? "SQM";

    const referenceNumber = toOutboundReferenceNumber(details.reference_number);

    const propertyDetailsPayload: PropertyDraftSubmissionPropertyDetails = {
      bedrooms: details.bedrooms,
      bathrooms: details.bathrooms,
      built_up_area: normalizeBuiltUpAreaToSquareMeters(
        details.built_up_area ?? "",
        builtUpAreaUnit,
      ),
      built_up_area_unit: "SQM",
      parking_spaces: details.parking_spaces,
      year_built: details.year_built ?? null,
      furnishing_status: toDraftMasterOptionValue(details.furnishing_status),
      floor_level: null,
      floor: null,
      land_type_id: toDraftMasterOptionValue(
        (details as { land_type_id?: string | number | null }).land_type_id ??
          (details as { land_type?: string | number | null }).land_type,
      ),
      total_floors: parseOptionalNumber(details.total_floor),
      completion_status: details.completion_status,
      occupancy: details.occupancy,
      ownership_type: details.ownership_type,
      ...(referenceNumber ? { reference_number: referenceNumber } : {}),
      orientation: details.orientation,
      guard_name: toOptionalTrimmedString(details.guard_name),
      guard_phone_number: buildOwnerPhone(
        details.guard_country_code,
        details.guard_phone_number,
      ),
    };

    payload.property_details = applyPropertyLocationDls(
      propertyDetailsPayload,
      dls,
    );
  }

  if (pricing != null) {
    const namedPrices = {
      furnished_sale_price: parsePrice(pricing.furnished_sale_price),
      unfurnished_sale_price: parsePrice(pricing.unfurnished_sale_price),
      furnished_rent_price: parsePrice(pricing.furnished_rent_price),
      unfurnished_rent_price: parsePrice(pricing.unfurnished_rent_price),
      semi_furnished_rent_price: parsePrice(pricing.semi_furnished_rent_price),
    };
    const fallbackPrice =
      parsePrice(pricing.price) ||
      namedPrices.furnished_sale_price ||
      namedPrices.unfurnished_sale_price ||
      namedPrices.furnished_rent_price ||
      namedPrices.unfurnished_rent_price ||
      namedPrices.semi_furnished_rent_price;
    const additionalPrices = Object.fromEntries(
      Object.entries(pricing.additional_prices ?? {})
        .map(([key, value]) => [
          key,
          parsePrice(typeof value === "string" ? value : String(value ?? "")),
        ] as const)
        .filter(([, value]) => value > 0),
    );

    payload.pricing = {
      ...namedPrices,
      price: fallbackPrice,
      ...(Object.keys(additionalPrices).length > 0
        ? { additional_prices: additionalPrices }
        : {}),
      service_charge: parsePrice(pricing.service_charge),
      maintenance_fee: parsePrice(pricing.maintenance_fee),
      currency: resolvePropertyDraftSubmissionCurrency(options?.currency),
    };
  }

  const selectedFeatureIds = propertyDetails.amenities?.feature_ids ?? [];
  const featureIds =
    selectedFeatureIds.length > 0
      ? Array.from(new Set(selectedFeatureIds))
      : mapSelectedAmenitiesToFeatureIds(
          selectedAmenities,
          featuresAndAmenities,
          categoryId,
          propertyTypeId,
        );

  if (featureIds.length > 0) {
    payload.amenities = { feature_ids: featureIds };
  }

  if (media != null) {
    const mediaFiles = media.media_files ?? [];
    const imageFiles = mediaFiles.filter((file) => isImageMediaFile(file));
    const videoFiles = mediaFiles.filter((file) => isVideoMediaFile(file));

    const hasExplicitPrimary = imageFiles.some((file) => file.is_primary);
    const images = imageFiles.map((file, index) => ({
      file_name: file.name,
      url: resolvePersistableFileUri(file.uri),
      is_primary: hasExplicitPrimary ? Boolean(file.is_primary) : index === 0,
      display_order: file.display_order ?? index,
    }));

    const videos = videoFiles.map((file, index) => ({
      file_name: file.name,
      url: resolvePersistableFileUri(file.uri),
      display_order: index,
    }));

    const documents = (media.documents ?? [])
      .filter((file) => isPropertyDocumentFile(file))
      .map((file, index) => ({
        file_name: file.name,
        url: resolvePersistableFileUri(file.uri),
        display_order: index,
      }));

    payload.media_documents = {
      images: images.length > 0 ? images : undefined,
      videos: videos.length > 0 ? videos : undefined,
      documents: documents.length > 0 ? documents : undefined,
      youtube_url: media.youtube_url || undefined,
      virtual_tour_url: media.virtual_tour_url?.trim()
        ? media.virtual_tour_url.trim()
        : null,
    };
  }

  payload.review_submit = mapReviewSubmit(propertyDetails, options);

  return payload;
}

export function buildPropertyDraftSubmissionRequestBody(
  propertyDetails: PropertyFormValues,
  featuresAndAmenities: FeaturesAndAmenities,
  currentStep: number,
  lastCompletedStep: number,
  options?: BuildPropertyDraftSubmissionPayloadOptions,
): PropertyDraftSubmissionRequestBody {
  return {
    route_through_agency: options?.routeThroughAgency ?? false,
    agency_id: options?.agencyId,
    payload: buildPropertyDraftSubmissionPayload(
      propertyDetails,
      featuresAndAmenities,
      options,
    ),
    current_step: currentStep,
    last_completed_step: lastCompletedStep,
  };
}

export function buildPropertySubmissionDirectSubmitRequestBody(
  propertyDetails: PropertyFormValues,
  featuresAndAmenities: FeaturesAndAmenities,
  options?: BuildPropertyDraftSubmissionPayloadOptions,
): PropertySubmissionDirectSubmitRequestBody {
  return {
    route_through_agency: options?.routeThroughAgency ?? false,
    agency_id: options?.agencyId,
    payload: buildPropertyDraftSubmissionPayload(
      propertyDetails,
      featuresAndAmenities,
      options,
    ),
    confirm_submit: true,
  };
}

export function buildPropertyDraftSubmissionUpdateRequestBody(
  propertyDetails: PropertyFormValues,
  featuresAndAmenities: FeaturesAndAmenities,
  currentStep: number,
  lastCompletedStep: number,
  options?: BuildPropertyDraftSubmissionPayloadOptions,
): PropertyDraftSubmissionUpdateRequestBody {
  return {
    action: PROPERTY_DRAFT_SUBMISSION_SAVE_ACTION,
    route_through_agency: options?.routeThroughAgency ?? false,
    agency_id: options?.agencyId,
    current_step: currentStep,
    last_completed_step: lastCompletedStep,
    payload: buildPropertyDraftSubmissionPayload(
      propertyDetails,
      featuresAndAmenities,
      options,
    ),
  };
}

function formatNumberField(value: number | null | undefined): string {
  if (value == null) {
    return "";
  }

  return String(value);
}

function formatPriceField(value: number | null | undefined): string {
  if (value == null || value === 0) {
    return "";
  }

  return String(value);
}

function formatYearBuiltField(
  value: string | number | null | undefined,
): number | null {
  if (value == null || value === "") {
    return null;
  }

  const numericYear = Number(value);
  if (!Number.isFinite(numericYear)) {
    return null;
  }

  const year = Math.trunc(numericYear);
  if (year < 1800 || year > new Date().getFullYear() + 5) {
    return null;
  }

  return year;
}

function mapFeatureIdsToSelectedAmenities(
  featureIds: number[] | undefined,
  featuresAndAmenities: FeaturesAndAmenities,
  categoryId: number | null,
  propertyTypeId: number | null,
): string[] {
  const catalog = getFilteredFeaturesAndAmenitiesCatalog(
    featuresAndAmenities,
    categoryId,
    propertyTypeId,
  );

  if (!featureIds?.length || catalog.length === 0) {
    return [];
  }

  const catalogById = new Map(catalog.map((item) => [item.id, item] as const));
  const selected: string[] = [];

  for (const featureId of featureIds) {
    const item = catalogById.get(featureId);

    if (item?.name && !selected.includes(item.name)) {
      selected.push(item.name);
    }
  }

  return selected;
}

export function mapPropertyDraftSubmissionToPropertyFormValues(
  data: PropertyDraftSubmissionData,
  featuresAndAmenities: FeaturesAndAmenities,
  formOptionsCatalog: PropertyFormOptionsCatalog = EMPTY_PROPERTY_FORM_OPTIONS_CATALOG,
): PropertyFormValues {
  const payload = data.payload;
  const basicInfo = payload.basic_information;
  const location = payload.location;
  const details = payload.property_details;
  const owners = payload.owner_information?.owners ?? [];
  const pricing = payload.pricing;
  const media = payload.media_documents;

  const categoryId = basicInfo?.category_id ?? null;
  const propertyTypeId = basicInfo?.type_id ?? null;
  const maxReachedStep = Math.max(data.current_step, data.last_completed_step);

  const propertyDetails: PropertyFormValues = {
    active_step: data.current_step,
    max_reached_step: maxReachedStep,
  };

  if (basicInfo != null) {
    const listingPurposes = Array.from(
      new Set(
        [
          ...(basicInfo.listing_purposes ?? []),
          basicInfo.listing_purpose ?? "",
        ]
          .map((value) => value.trim())
          .filter(Boolean),
      ),
    );

    propertyDetails.basic_info = {
      title: basicInfo.title ?? "",
      description: basicInfo.description ?? "",
      listing_purposes: listingPurposes,
      listing_purpose: listingPurposes.length === 1 ? listingPurposes[0] ?? null : null,
      category_id: basicInfo.category_id ?? null,
      type_id: basicInfo.type_id ?? null,
    };
  }

  if (location != null) {
    const dls = extractPropertyLocationDls(
      location as Record<string, unknown>,
      details as Record<string, unknown> | undefined,
    );

    const identificationFields = hydrateLocationIdentificationFields(location);
    const parcelNumber =
      toOptionalTrimmedString(location.parcel_number) ||
      toOptionalTrimmedString(identificationFields.parcel_number) ||
      "";

    propertyDetails.location_insert = applyPropertyLocationDls(
      {
        city_id: null,
        area_id: null,
        area_ids: [],
        address: "",
        latitude: location.latitude ?? null,
        longitude: location.longitude ?? null,
        apartment_number: location.apartment_number ?? "",
        plot_number: location.plot_number ?? "",
        basin_number: "",
        parcel_number: parcelNumber,
        building_number: location.building_number ?? "",
        identification_fields: identificationFields,
        show_location: location.show_location ?? false,
      },
      dls,
    ) as PropertyFormValues["location_insert"];
  }

  if (owners.length > 0) {
    const hydratedOwners = owners.map((owner) => {
      const { country_code, phone_number } = parseOwnerPhoneForForm(owner.phone);
      const fullName = owner.full_name ?? "";

      return {
        owner_id: owner.owner_id,
        owner_name: fullName,
        full_name: fullName,
        email: owner.email ?? "",
        country_code,
        phone_number,
        social_security_id: owner.ssi ?? "",
        ssi: owner.ssi ?? "",
        nationality: owner.nationality ?? "",
        owner_documents: (owner.documents ?? []).map((document) => ({
          name: document.file_name ?? "",
          uri: toFormMediaFields(document).uri,
        })),
      };
    });
    const selectedOwnerId =
      payload.owner_information?.owner_id ??
      hydratedOwners.find((owner) => owner.owner_id)?.owner_id ??
      null;

    propertyDetails.owner_info = {
      owner_mode:
        payload.owner_information?.owner_mode ??
        (selectedOwnerId ? "search" : "create"),
      owner_id: selectedOwnerId,
      owners: hydratedOwners,
    };
  }

  if (details != null) {
    const guardPhone = parseOwnerPhoneForForm(
      details.guard_phone_number ?? details.guard_phone,
    );
    const yearBuilt =
      formatYearBuiltField(details.year_built) ??
      formatYearBuiltField(details.property_age);

    propertyDetails.property_details = {
      bedrooms: details.bedrooms ?? null,
      bathrooms: details.bathrooms ?? null,
      built_up_area: formatBuiltUpAreaField(
        details.built_up_area,
        details.built_up_area_unit,
      ),
      built_up_area_unit: "SQM",
      parking_spaces: details.parking_spaces ?? null,
      year_built: yearBuilt,
      property_age:
        yearBuilt == null && details.property_age != null
          ? String(details.property_age)
          : null,
      furnishing_status: resolvePropertyFormMasterOptionValue(
        readDraftMasterOptionField(details, [
          "furnishing_status",
          "furnishingStatus",
          "furniture_status",
          "furnishing_status_id",
          "furniture_status_id",
        ]),
        formOptionsCatalog.furnishingStatusOptions,
      ),
      // Floor removed from Property Information — do not hydrate.
      floor_level: null,
      total_floor: formatNumberField(details.total_floors),
      completion_status: details.completion_status ?? null,
      occupancy: details.occupancy ?? null,
      ownership_type: details.ownership_type ?? null,
      reference_number: toFormReferenceNumber(details.reference_number),
      orientation: details.orientation ?? null,
      guard_name: details.guard_name ?? "",
      guard_country_code: guardPhone.country_code,
      guard_phone_number: guardPhone.phone_number,
      // Host-owned until library `PropertyDetailsFormValues` includes it.
      land_type_id: resolvePropertyFormMasterOptionValue(
        readDraftMasterOptionField(details, [
          "land_type_id",
          "landTypeId",
          "land_type",
          "landType",
        ]),
        formOptionsCatalog.landTypeOptions,
      ),
    } as NonNullable<PropertyFormValues["property_details"]> & {
      land_type_id?: string | null;
    };
  }

  if (pricing != null) {
    const pricingCurrency = pricing.currency === "USD" ? "USD" : "JOD";
    const legacyPrice = formatPriceField(pricing.price);

    propertyDetails.pricing_details = {
      price: legacyPrice,
      price_currency: pricingCurrency,
      service_charge: formatPriceField(pricing.service_charge),
      service_charge_currency: pricingCurrency,
      maintenance_fee: formatPriceField(pricing.maintenance_fee),
      maintenance_fee_currency: pricingCurrency,
      furnished_sale_price: formatPriceField(pricing.furnished_sale_price),
      unfurnished_sale_price: formatPriceField(
        pricing.unfurnished_sale_price ??
          (pricing.furnished_sale_price == null ? pricing.price : undefined),
      ),
      furnished_rent_price: formatPriceField(pricing.furnished_rent_price),
      unfurnished_rent_price: formatPriceField(
        pricing.unfurnished_rent_price ??
          (pricing.furnished_rent_price == null &&
          pricing.furnished_sale_price == null &&
          pricing.unfurnished_sale_price == null
            ? pricing.price
            : undefined),
      ),
      semi_furnished_rent_price: formatPriceField(
        pricing.semi_furnished_rent_price,
      ),
      additional_prices: Object.fromEntries(
        Object.entries(pricing.additional_prices ?? {}).map(([key, value]) => [
          key,
          formatPriceField(value),
        ]),
      ),
    };
  }

  const amenityFeatureIds = payload.amenities?.feature_ids ?? [];

  if (amenityFeatureIds.length > 0) {
    const selectedAmenities = mapFeatureIdsToSelectedAmenities(
      amenityFeatureIds,
      featuresAndAmenities,
      categoryId,
      propertyTypeId,
    );

    propertyDetails.amenities = {
      selected_amenities: selectedAmenities,
      feature_ids: amenityFeatureIds,
    };
  }

  if (media != null) {
    const mediaFiles = [
      ...(media.images ?? []).map((image, index) => ({
        name: image.file_name ?? "",
        ...toFormMediaFields(image),
        mimeType: image.file_name?.toLowerCase().endsWith(".gif")
          ? "image/gif"
          : undefined,
        is_primary: Boolean(image.is_primary) || (index === 0 && !(media.images ?? []).some((item) => item.is_primary)),
        display_order: image.display_order ?? index,
      })),
      ...(media.videos ?? []).map((video) => ({
        name: video.file_name ?? "",
        ...toFormMediaFields(video),
        mimeType: video.file_name?.toLowerCase().endsWith(".mov")
          ? "video/quicktime"
          : "video/mp4",
      })),
    ].filter((file) => isImageMediaFile(file) || isVideoMediaFile(file));

    propertyDetails.media_upload = {
      media_files: mediaFiles,
      youtube_url: media.youtube_url ?? "",
      virtual_tour_url: media.virtual_tour_url ?? "",
      documents: (media.documents ?? [])
        .map((document) => ({
          name: document.file_name ?? "",
          uri: toFormMediaFields(document).uri,
        }))
        .filter((file) => isPropertyDocumentFile(file)),
    };
  }

  const reviewSubmit = payload.review_submit;

  if (reviewSubmit != null) {
    propertyDetails.terms_acceptance = {
      terms_accepted: reviewSubmit.terms_accepted ?? false,
      privacy_accepted: reviewSubmit.privacy_accepted ?? false,
      public_display_authorized: reviewSubmit.public_display_authorized ?? false,
      fees_acknowledged: reviewSubmit.fees_acknowledged ?? false,
    };
  }

  return propertyDetails;
}
