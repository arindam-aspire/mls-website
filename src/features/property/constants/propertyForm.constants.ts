import {
  propertyFormSteps,
  type PropertyFormValues,
} from "@abdoun/abdoun-library";

export const INITIAL_PROPERTY_FORM_VALUES: PropertyFormValues = {
  location_insert: {
    city_id: null,
    area_ids: [],
    address: "",
    show_location: false,
  },
  property_details: {
    bedrooms: null,
    bathrooms: null,
    built_up_area: "",
    built_up_area_unit: "SQM",
    parking_spaces: null,
    property_age: null,
    completion_status: null,
    total_floor: "",
    occupancy: null,
    ownership_type: null,
    reference_number: "",
    permit_dld_number: "",
    orientation: null,
    guard_name: "",
    guard_country_code: "+962",
    guard_phone_number: "",
  },
} as PropertyFormValues;

/** Default `PropertyForm` / API step index (1-based; matches `@abdoun/abdoun-library`). */
export const INITIAL_PROPERTY_FORM_ACTIVE_STEP = 1;

/** 1-based Location step index from the library-owned form step catalog. */
export const PROPERTY_FORM_LOCATION_STEP =
  propertyFormSteps.findIndex((step) => step.value === "location") + 1;

/** 1-based Review & Submit step index from the library-owned form step catalog. */
export const PROPERTY_FORM_FINALIZE_STEP =
  propertyFormSteps.findIndex((step) => step.value === "finalize") + 1;
