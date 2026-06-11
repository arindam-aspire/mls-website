import { PROPERTY_DRAFT_SUBMISSION_SAVE_ACTION } from "@/src/features/property/constants/propertyCreate.constants";
import type {
  PropertyDraftSubmissionPayload,
  PropertyDraftSubmissionRequestBody,
  PropertyDraftSubmissionUpdateRequestBody,
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

  const indexByName = new Map(
    catalog.map((item, index) => [item.name, index + 1] as const),
  );
  const slugToName = new Map(catalog.map((item) => [item.slug, item.name] as const));
  const featureIds: number[] = [];

  for (const value of selected) {
    const name = indexByName.has(value) ? value : slugToName.get(value);
    if (name == null) {
      continue;
    }

    const featureId = indexByName.get(name);
    if (featureId != null && !featureIds.includes(featureId)) {
      featureIds.push(featureId);
    }
  }

  return featureIds;
}

export function buildPropertyDraftSubmissionPayload(
  propertyDetails: PropertyFormValues,
  featuresAndAmenities: FeaturesAndAmenities,
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
        full_name: owner.owner_name || undefined,
        email: owner.email || undefined,
        phone: `${owner.country_code ?? ""}${owner.phone_number ?? ""}` || undefined,
        documents: owner.owner_documents.map((document) => ({
          file_name: document.name,
          url: document.uri,
        })),
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

  payload.review_submit = {
    terms_accepted: false,
    privacy_accepted: false,
    public_display_authorized: false,
    fees_acknowledged: false,
  };

  return payload;
}

export function buildPropertyDraftSubmissionRequestBody(
  propertyDetails: PropertyFormValues,
  featuresAndAmenities: FeaturesAndAmenities,
  currentStep: number,
): PropertyDraftSubmissionRequestBody {
  return {
    payload: buildPropertyDraftSubmissionPayload(propertyDetails, featuresAndAmenities),
    current_step: currentStep,
  };
}

export function buildPropertyDraftSubmissionUpdateRequestBody(
  propertyDetails: PropertyFormValues,
  featuresAndAmenities: FeaturesAndAmenities,
  currentStep: number,
): PropertyDraftSubmissionUpdateRequestBody {
  return {
    action: PROPERTY_DRAFT_SUBMISSION_SAVE_ACTION,
    current_step: currentStep,
    payload: buildPropertyDraftSubmissionPayload(propertyDetails, featuresAndAmenities),
  };
}
