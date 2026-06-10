import { SELECT_DROPDOWN_EMPTY_VALUE } from "@/src/components/ui";
import { parseLocationOptionValue } from "@/src/features/landing/utils/locationTaxonomy.utils";
import { serializeAmenitiesParam } from "@/src/features/property/constants/propertyListAdvancedFilters.constants";
import type { SavedSearchCriteria } from "../types/savedSearch.types";
import type { BuildSaveSearchFilterItemsInput } from "./buildSaveSearchFilterItems";

function appendCriteriaValue(
  criteria: SavedSearchCriteria,
  key: keyof SavedSearchCriteria,
  value: string | undefined,
) {
  const trimmed = value?.trim();

  if (!trimmed || trimmed === SELECT_DROPDOWN_EMPTY_VALUE) {
    return;
  }

  criteria[key] = trimmed;
}

export function buildSaveSearchCriteria(
  input: BuildSaveSearchFilterItemsInput,
): SavedSearchCriteria {
  const criteria: SavedSearchCriteria = {};

  appendCriteriaValue(criteria, "status", input.status);
  appendCriteriaValue(criteria, "category", input.category);
  appendCriteriaValue(criteria, "type", input.type);

  if (input.locationValue) {
    const { city, locations } = parseLocationOptionValue(input.locationValue);

    appendCriteriaValue(criteria, "city", city);
    appendCriteriaValue(criteria, "locations", locations);
  } else {
    appendCriteriaValue(criteria, "location", input.location);
  }

  appendCriteriaValue(criteria, "budgetMin", input.budgetMin);
  appendCriteriaValue(criteria, "budgetMax", input.budgetMax);
  appendCriteriaValue(criteria, "bedrooms", input.bedrooms);
  appendCriteriaValue(criteria, "rooms", input.rooms);
  appendCriteriaValue(criteria, "bathrooms", input.bathrooms);
  appendCriteriaValue(criteria, "parking", input.parking);
  appendCriteriaValue(criteria, "propertyAge", input.propertyAge);
  appendCriteriaValue(criteria, "floorLevel", input.floorLevel);
  appendCriteriaValue(criteria, "furnitureStatus", input.furnitureStatus);
  appendCriteriaValue(criteria, "minArea", input.minArea);
  appendCriteriaValue(criteria, "maxArea", input.maxArea);
  appendCriteriaValue(criteria, "minPlotArea", input.minPlotArea);
  appendCriteriaValue(criteria, "maxPlotArea", input.maxPlotArea);
  appendCriteriaValue(criteria, "governorate", input.governorate);
  appendCriteriaValue(criteria, "directorate", input.directorate);
  appendCriteriaValue(criteria, "village", input.village);
  appendCriteriaValue(criteria, "parcelName", input.parcelName);

  if (input.selectedAmenities.length > 0) {
    const serialized = serializeAmenitiesParam(new Set(input.selectedAmenities));

    if (serialized) {
      criteria.amenities = serialized;
    }
  }

  return criteria;
}
