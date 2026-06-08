import type { SavedSearchRecord } from "../types/savedSearch.types";

const PROPERTY_LIST_PATH = "/property-list";

export function buildSavedSearchPropertyListSearchParams(savedSearchId: string) {
  const params = new URLSearchParams();

  params.set("savedSearchId", savedSearchId);

  return params.toString();
}

export function buildSavedSearchPropertyListHref(
  recordOrId: SavedSearchRecord | string,
) {
  const savedSearchId =
    typeof recordOrId === "string" ? recordOrId : recordOrId.id;

  return `${PROPERTY_LIST_PATH}?${buildSavedSearchPropertyListSearchParams(savedSearchId)}`;
}
