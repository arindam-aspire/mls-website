import { PROPERTY_DRAFT_SUBMISSION_SAVE_ACTION } from "@/src/features/property/constants/propertyCreate.constants";
import type {
  PropertyDraftSubmissionData,
  PropertyDraftSubmissionPayload,
  PropertyDraftSubmissionRequestBody,
  PropertyDraftSubmissionReviewSubmit,
  PropertyDraftSubmissionUpdateRequestBody,
  PropertySubmissionDirectSubmitRequestBody,
} from "@/src/features/property/types/propertyDraftSubmission.types";
import type { PropertyFormProps, PropertyFormValues } from "@abdoun/abdoun-library";

type FeaturesAndAmenities = PropertyFormProps["featuresAndAmenities"];
type FeaturesAndAmenityItem = FeaturesAndAmenities[number];

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

function parsePrice(value: string | undefined): number {
  if (value == null || value.trim() === "") {
    return 0;
  }

  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

const DEFAULT_OWNER_COUNTRY_CODE = "+962";

const OWNER_DIAL_CODES = ["+962", "+966", "+971", "+20", "+1"] as const;

function toOptionalTrimmedString(value: string | undefined | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function buildOwnerPhone(countryCode: string | undefined, phoneNumber: string | undefined): string | undefined {
  const merged = `${countryCode ?? ""}${phoneNumber ?? ""}`.trim();
  return merged || undefined;
}

function parseOwnerPhoneForForm(phone: string | undefined | null): {
  country_code: string;
  phone_number: string;
} {
  const raw = phone?.trim() ?? "";

  if (!raw) {
    return { country_code: DEFAULT_OWNER_COUNTRY_CODE, phone_number: "" };
  }

  if (raw.startsWith("+")) {
    const dialCode = [...OWNER_DIAL_CODES].sort((a, b) => b.length - a.length).find((code) =>
      raw.startsWith(code),
    );

    if (dialCode) {
      return {
        country_code: dialCode,
        phone_number: raw.slice(dialCode.length),
      };
    }
  }

  return { country_code: DEFAULT_OWNER_COUNTRY_CODE, phone_number: raw };
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
      url: document.uri,
    }));
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

export type BuildPropertyDraftSubmissionPayloadOptions = {
  /** When true, all review flags are sent as accepted (submit path after library validation). */
  forSubmit?: boolean;
  /** Selected agency for owner-created listings; backend falls back to auth context for agency users. */
  agencyId?: string | null;
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
    const listingPurpose =
      basicInfo.listing_purpose === "sale" || basicInfo.listing_purpose === "rent"
        ? basicInfo.listing_purpose
        : basicInfo.listing_purpose === null
          ? null
          : undefined;

    payload.basic_information = {
      listing_purpose: listingPurpose,
      category_id: basicInfo.category_id,
      type_id: basicInfo.type_id,
      title: basicInfo.title || undefined,
      description: basicInfo.description || undefined,
    };
  }

  if (location != null) {
    payload.location = {
      city_id: location.city_id,
      area_id: location.area_ids[0] ?? null,
      address: location.address || undefined,
    };
  }

  if (owners.length > 0) {
    payload.owner_information = {
      owners: owners.map((owner) => ({
        full_name: toOptionalTrimmedString(owner.owner_name),
        email: toOptionalTrimmedString(owner.email),
        phone: buildOwnerPhone(owner.country_code, owner.phone_number),
        nationality: toOptionalTrimmedString(owner.nationality),
        ssi: toOptionalTrimmedString(owner.social_security_id),
        address: toOptionalTrimmedString(owner.owner_address),
        documents: mapOwnerDocuments(owner.owner_documents),
      })),
    };
  }

  if (details != null) {
    payload.property_details = {
      bedrooms: details.bedrooms,
      bathrooms: details.bathrooms,
      built_up_area: parseOptionalNumber(details.built_up_area),
      parking_spaces: details.parking_spaces,
      property_age: details.property_age,
      total_floors: parseOptionalNumber(details.total_floor),
      completion_status: details.completion_status,
      occupancy: details.occupancy,
      ownership_type: details.ownership_type,
      reference_number: details.reference_number || undefined,
      permit_number: details.permit_dld_number || undefined,
      orientation: details.orientation,
    };
  }

  if (pricing != null) {
    payload.pricing = {
      price: parsePrice(pricing.price),
      service_charge: parsePrice(pricing.service_charge),
      maintenance_fee: parsePrice(pricing.maintenance_fee),
      currency: "JOD",
    };
  }

  const featureIds = mapSelectedAmenitiesToFeatureIds(
    selectedAmenities,
    featuresAndAmenities,
    categoryId,
    propertyTypeId,
  );

  if (featureIds.length > 0) {
    payload.amenities = { feature_ids: featureIds };
  }

  if (media != null) {
    const images = media.media_files.map((file, index) => ({
      file_name: file.name,
      url: file.uri,
      is_primary: index === 0,
      display_order: index,
    }));

    const documents = media.documents.map((file, index) => ({
      file_name: file.name,
      url: file.uri,
      display_order: index,
    }));

    payload.media_documents = {
      images: images.length > 0 ? images : undefined,
      videos: [],
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
    agency_id: options?.agencyId ?? undefined,
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
    agency_id: options?.agencyId ?? undefined,
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
    agency_id: options?.agencyId ?? undefined,
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

function formatPropertyAgeField(value: string | number | null | undefined): string | null {
  if (value == null) {
    return null;
  }

  const text = String(value).trim();

  if (!text) {
    return null;
  }

  const numericAge = Number(text);

  if (Number.isFinite(numericAge) && /^\d+(\.\d+)?$/.test(text)) {
    if (numericAge <= 0) {
      return "new";
    }

    if (numericAge <= 5) {
      return "1-5";
    }

    if (numericAge <= 10) {
      return "6-10";
    }

    return "10+";
  }

  return text;
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
    propertyDetails.basic_info = {
      title: basicInfo.title ?? "",
      description: basicInfo.description ?? "",
      listing_purpose: basicInfo.listing_purpose ?? null,
      category_id: basicInfo.category_id ?? null,
      type_id: basicInfo.type_id ?? null,
    };
  }

  if (location != null) {
    propertyDetails.location_insert = {
      city_id: location.city_id ?? null,
      area_ids: location.area_id != null ? [location.area_id] : [],
      address: location.address ?? "",
    };
  }

  if (owners.length > 0) {
    propertyDetails.owner_info = {
      owners: owners.map((owner) => {
        const { country_code, phone_number } = parseOwnerPhoneForForm(owner.phone);

        return {
          owner_name: owner.full_name ?? "",
          email: owner.email ?? "",
          country_code,
          phone_number,
          social_security_id: owner.ssi ?? "",
          nationality: owner.nationality ?? "",
          owner_address: owner.address ?? "",
          owner_documents: (owner.documents ?? []).map((document) => ({
            name: document.file_name ?? "",
            uri: document.url ?? "",
          })),
        };
      }),
    };
  }

  if (details != null) {
    propertyDetails.property_details = {
      bedrooms: details.bedrooms ?? null,
      bathrooms: details.bathrooms ?? null,
      built_up_area: formatNumberField(details.built_up_area),
      parking_spaces: details.parking_spaces ?? null,
      property_age: formatPropertyAgeField(details.property_age),
      total_floor: formatNumberField(details.total_floors),
      completion_status: details.completion_status ?? null,
      occupancy: details.occupancy ?? null,
      ownership_type: details.ownership_type ?? null,
      reference_number: details.reference_number ?? "",
      permit_dld_number: details.permit_number ?? "",
      orientation: details.orientation ?? null,
    };
  }

  if (pricing != null) {
    propertyDetails.pricing_details = {
      price: formatPriceField(pricing.price),
      service_charge: formatPriceField(pricing.service_charge),
      maintenance_fee: formatPriceField(pricing.maintenance_fee),
    };
  }

  const selectedAmenities = mapFeatureIdsToSelectedAmenities(
    payload.amenities?.feature_ids,
    featuresAndAmenities,
    categoryId,
    propertyTypeId,
  );

  if (selectedAmenities.length > 0) {
    propertyDetails.amenities = {
      selected_amenities: selectedAmenities,
    };
  }

  if (media != null) {
    propertyDetails.media_upload = {
      media_files: (media.images ?? []).map((image) => ({
        name: image.file_name ?? "",
        uri: image.url ?? "",
      })),
      youtube_url: media.youtube_url ?? "",
      virtual_tour_url: media.virtual_tour_url ?? "",
      documents: (media.documents ?? []).map((document) => ({
        name: document.file_name ?? "",
        uri: document.url ?? "",
      })),
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
