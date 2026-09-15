export const PROPERTY_LOCATION_MAP_DEFAULT_LATITUDE = 31.9539;
export const PROPERTY_LOCATION_MAP_DEFAULT_LONGITUDE = 35.9106;
export const PROPERTY_LOCATION_MAP_DEFAULT_ZOOM = 13;
export const PROPERTY_LOCATION_MAP_MIN_ZOOM = 3;
export const PROPERTY_LOCATION_MAP_MAX_ZOOM = 20;
export const PROPERTY_LOCATION_MAP_REGION = "JO";

export const PROPERTY_LOCATION_MAP_TYPE = {
  roadmap: "roadmap",
  satellite: "satellite",
} as const;

export const PROPERTY_LOCATION_MAP_RENDERING_TYPE = "VECTOR" as const;

export type PropertyLocationMapTypeId =
  (typeof PROPERTY_LOCATION_MAP_TYPE)[keyof typeof PROPERTY_LOCATION_MAP_TYPE];
