import type { PropertyListParams } from "../types/property.types";

export const PROPERTY_SEARCH_STATUS_OPTIONS = [
  { value: "buy", label: "Buy" },
  { value: "rent", label: "Rent" },
] as const;

export const DEFAULT_PROPERTY_SEARCH_FILTER_PARAMS: PropertyListParams = {
  page: 1,
  pageSize: 10,
  category: "residential",
  status: "buy",
};
