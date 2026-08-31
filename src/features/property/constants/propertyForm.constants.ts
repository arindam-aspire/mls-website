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
} as PropertyFormValues;

/** Default `PropertyForm` / API step index (1-based; matches `@abdoun/abdoun-library`). */
export const INITIAL_PROPERTY_FORM_ACTIVE_STEP = 1;

/** 1-based Location step index from the library-owned form step catalog. */
export const PROPERTY_FORM_LOCATION_STEP =
  propertyFormSteps.findIndex((step) => step.value === "location") + 1;

/** 1-based Review & Submit step index from the library-owned form step catalog. */
export const PROPERTY_FORM_FINALIZE_STEP =
  propertyFormSteps.findIndex((step) => step.value === "finalize") + 1;
