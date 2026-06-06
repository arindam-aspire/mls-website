import { DEFAULT_SEARCH_CRITERIA_PARAMS } from "../constants/searchCriteriaFilter.constants";
import type {
  SavedSearchCriteria,
  SearchCriteriaParams,
} from "../types/savedSearch.types";

function parseOptionalNumber(value: string | undefined) {
  if (!value?.trim()) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseSavedSearchCriteriaToParams(
  criteria: SavedSearchCriteria,
): SearchCriteriaParams {
  return {
    status: criteria.status ?? DEFAULT_SEARCH_CRITERIA_PARAMS.status,
    category: criteria.category ?? DEFAULT_SEARCH_CRITERIA_PARAMS.category,
    type: criteria.type,
    location: criteria.location,
    city: criteria.city,
    locations: criteria.locations,
    budgetMin: parseOptionalNumber(criteria.budgetMin),
    budgetMax: parseOptionalNumber(criteria.budgetMax),
    furnitureStatus: criteria.furnitureStatus,
    bedrooms: parseOptionalNumber(criteria.bedrooms),
    rooms: parseOptionalNumber(criteria.rooms),
    bathrooms: parseOptionalNumber(criteria.bathrooms),
    parking: parseOptionalNumber(criteria.parking),
    propertyAge: criteria.propertyAge,
    floorLevel: criteria.floorLevel,
    minArea: parseOptionalNumber(criteria.minArea),
    maxArea: parseOptionalNumber(criteria.maxArea),
    minPlotArea: parseOptionalNumber(criteria.minPlotArea),
    maxPlotArea: parseOptionalNumber(criteria.maxPlotArea),
    governorate: criteria.governorate,
    directorate: criteria.directorate,
    village: criteria.village,
    parcelName: criteria.parcelName,
    amenities: criteria.amenities,
  };
}
