import type { SavedSearchRecord } from "../types/savedSearch.types";

const PROPERTY_LIST_PATH = "/property-list";

export function buildSavedSearchPropertyListSearchParams(
  record: SavedSearchRecord,
) {
  const params = new URLSearchParams(record.query_string.trim());

  params.set("savedSearchId", record.id);

  return params.toString();
}

export function buildSavedSearchPropertyListHref(record: SavedSearchRecord) {
  return `${PROPERTY_LIST_PATH}?${buildSavedSearchPropertyListSearchParams(record)}`;
}