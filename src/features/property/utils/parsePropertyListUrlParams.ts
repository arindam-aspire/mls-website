import {
  getInitialBudgetMax,
  getInitialBudgetMin,
} from "@/src/components/search";
import { normalizeAmenitiesParam } from "../components/propertyListAdvancedFilters.constants";
import type { PropertyListParams } from "../types/property.types";

export const DEFAULT_PROPERTY_LIST_SORT = "newest";

export const DEFAULT_PROPERTY_LIST_PARAMS: PropertyListParams = {
  page: 1,
  pageSize: 10,
  category: "residential",
  status: "buy",
  sort: DEFAULT_PROPERTY_LIST_SORT,
};

function getOptionalString(value: string | null) {
  return value || undefined;
}

function parseOptionalNumber(value: string | null) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parsePropertyListUrlParams(
  searchParams: URLSearchParams,
): PropertyListParams {
  return {
    page: Number(searchParams.get("page")) || 1,
    pageSize: Number(searchParams.get("pageSize")) || 10,
    category: searchParams.get("category") || "",
    status: searchParams.get("status") || "",
    sort: searchParams.get("sort") || DEFAULT_PROPERTY_LIST_SORT,
    type: getOptionalString(searchParams.get("type")),
    location: getOptionalString(searchParams.get("location")),
    city: getOptionalString(searchParams.get("city")),
    locations: getOptionalString(searchParams.get("locations")),
    budgetMin: parseOptionalNumber(getInitialBudgetMin(searchParams) || null),
    budgetMax: parseOptionalNumber(getInitialBudgetMax(searchParams) || null),
    furnitureStatus: getOptionalString(searchParams.get("furnitureStatus")),
    bedrooms: parseOptionalNumber(searchParams.get("bedrooms")),
    rooms: parseOptionalNumber(searchParams.get("rooms")),
    bathrooms: parseOptionalNumber(searchParams.get("bathrooms")),
    parking: parseOptionalNumber(searchParams.get("parking")),
    propertyAge: getOptionalString(searchParams.get("propertyAge")),
    floorLevel: getOptionalString(searchParams.get("floorLevel")),
    minArea: parseOptionalNumber(searchParams.get("minArea")),
    maxArea: parseOptionalNumber(searchParams.get("maxArea")),
    minPlotArea: parseOptionalNumber(searchParams.get("minPlotArea")),
    maxPlotArea: parseOptionalNumber(searchParams.get("maxPlotArea")),
    governorate: getOptionalString(searchParams.get("governorate")),
    directorate: getOptionalString(searchParams.get("directorate")),
    village: getOptionalString(searchParams.get("village")),
    parcelName: getOptionalString(searchParams.get("parcelName")),
    amenities: normalizeAmenitiesParam(
      getOptionalString(searchParams.get("amenities")),
    ),
    similar_to: getOptionalString(searchParams.get("similar_to")),
    savedSearchId: getOptionalString(searchParams.get("savedSearchId")),
  };
}
