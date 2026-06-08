import { parsePropertyListUrlParams } from "@/src/features/property/utils/parsePropertyListUrlParams";
import type { PropertyListParams } from "@/src/features/property/types/property.types";
import type { SavedSearchRecord } from "../types/savedSearch.types";

/** Filter fields compared when deciding if `savedSearchId` still applies. */
export const SAVED_SEARCH_FILTER_PARAM_KEYS = [
  "category",
  "status",
  "sort",
  "type",
  "location",
  "city",
  "locations",
  "budgetMin",
  "budgetMax",
  "furnitureStatus",
  "bedrooms",
  "rooms",
  "bathrooms",
  "parking",
  "propertyAge",
  "floorLevel",
  "minArea",
  "maxArea",
  "minPlotArea",
  "maxPlotArea",
  "governorate",
  "directorate",
  "village",
  "parcelName",
  "amenities",
] as const satisfies readonly (keyof PropertyListParams)[];

type SavedSearchFilterParamKey =
  (typeof SAVED_SEARCH_FILTER_PARAM_KEYS)[number];

function getFilterSnapshot(
  params: PropertyListParams,
): Record<SavedSearchFilterParamKey, string> {
  const snapshot = {} as Record<SavedSearchFilterParamKey, string>;

  for (const key of SAVED_SEARCH_FILTER_PARAM_KEYS) {
    const value = params[key];

    if (value !== undefined && value !== "") {
      snapshot[key] = String(value);
    }
  }

  return snapshot;
}

function filterSnapshotsEqual(
  left: Record<SavedSearchFilterParamKey, string>,
  right: Record<SavedSearchFilterParamKey, string>,
) {
  const keys = new Set([
    ...Object.keys(left),
    ...Object.keys(right),
  ]) as Set<SavedSearchFilterParamKey>;

  for (const key of keys) {
    if (left[key] !== right[key]) {
      return false;
    }
  }

  return true;
}

export function needsSavedSearchUrlHydration(params: PropertyListParams) {
  return Boolean(
    params.savedSearchId && !params.category.trim() && !params.status.trim(),
  );
}

export function buildSearchParamsFromSavedSearchRecord(
  record: SavedSearchRecord,
  options?: { similarTo?: string },
) {
  const params = new URLSearchParams(record.query_string.trim());

  params.set("savedSearchId", record.id);

  if (options?.similarTo) {
    params.set("similar_to", options.similarTo);
  }

  return params;
}

export function propertyListFiltersMatchSavedSearch(
  current: PropertyListParams,
  record: SavedSearchRecord,
) {
  const savedParams = parsePropertyListUrlParams(
    new URLSearchParams(record.query_string.trim()),
  );

  return filterSnapshotsEqual(
    getFilterSnapshot(current),
    getFilterSnapshot(savedParams),
  );
}

/** Omits `savedSearchId` from the API payload when filters diverge from the saved search. */
export function resolvePropertyListRequestParams(
  params: PropertyListParams,
  savedSearchRecord?: SavedSearchRecord | null,
): PropertyListParams {
  if (!params.savedSearchId) {
    return params;
  }

  if (
    savedSearchRecord &&
    propertyListFiltersMatchSavedSearch(params, savedSearchRecord)
  ) {
    return params;
  }

  return { ...params, savedSearchId: undefined };
}
