import { propertyFormSteps } from "@abdoun/abdoun-library";
import type { PropertyFormValues } from "@abdoun/abdoun-library";

export type PropertyCreateFormStepId = (typeof propertyFormSteps)[number]["value"];

/** Maps each PropertyForm step id to its `PropertyFormValues` section key. */
export const PROPERTY_CREATE_FORM_STEP_SECTIONS: Record<
  PropertyCreateFormStepId,
  keyof PropertyFormValues
> = {
  setup: "basic_info",
  location: "location_insert",
  details: "property_details",
  owners: "owner_info",
  pricing: "pricing_details",
  amenities: "amenities",
  media: "media_upload",
  finalize: "terms_acceptance",
};

export const PROPERTY_CREATE_FORM_STEP_IDS = propertyFormSteps.map(
  (step) => step.value,
) as PropertyCreateFormStepId[];
