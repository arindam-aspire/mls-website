export type DlsLocationsEndpointParams = {
  level: "gov" | "dept" | "vill" | "hod" | "sect";
  gov_code?: string;
  dept_code?: string;
  vill_code?: string;
  hod_code?: string;
};

function appendOptionalQueryParam(
  search: URLSearchParams,
  key: string,
  value: string | undefined,
) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return;
  }

  search.set(key, trimmed);
}

export const publicEndpoints = {
  PROPERTY_TAXONOMY: "/property-taxonomy",
  /** @deprecated Use `PROPERTY_TAXONOMY` */
  CATEGORY_PROPERTY_LIST: "/property-taxonomy",
  LOCATION_TAXONOMY: "/location-taxonomy",
  DLS_LOCATIONS: (params: DlsLocationsEndpointParams): string => {
    const search = new URLSearchParams({ level: params.level });
    appendOptionalQueryParam(search, "gov_code", params.gov_code);
    appendOptionalQueryParam(search, "dept_code", params.dept_code);
    appendOptionalQueryParam(search, "vill_code", params.vill_code);
    appendOptionalQueryParam(search, "hod_code", params.hod_code);
    return `/dls-locations?${search.toString()}`;
  },
} as const;
