import type { PropertyArrangementId } from "@/src/features/property/constants/propertyArrangement.constants";

/**
 * Location identification (free-text) field keys. Host DLS renders these on
 * Create Property Location; library Location inputs stay hidden via DOM patch.
 * Catalogs also drive prune/hydrate so arrangement switches and Review stay
 * aligned with `payload.location`.
 *
 * Residential/Commercial Land Type is host-owned: `property_details.land_type_id`
 * from `GET /property-form-options` (`group=land_type`).
 *
 * Library `resolvePropertyFormConfig` treats an empty `identificationFields`
 * array as “use defaults” (includes Basin Number). Empty arrangements therefore
 * pass the host placeholder key; the DOM patch hides it.
 */
export const PROPERTY_IDENTIFICATION_BUILT_IN_KEYS = [
  "apartment_number",
  "plot_number",
  "basin_number",
  "parcel_number",
  "building_number",
] as const;

export type PropertyIdentificationBuiltInKey =
  (typeof PROPERTY_IDENTIFICATION_BUILT_IN_KEYS)[number];

export const PROPERTY_IDENTIFICATION_CUSTOM_KEYS = [
  "floor_number",
  "land_type",
] as const;

export type PropertyIdentificationCustomKey =
  (typeof PROPERTY_IDENTIFICATION_CUSTOM_KEYS)[number];

export type PropertyIdentificationFieldKey =
  | PropertyIdentificationBuiltInKey
  | PropertyIdentificationCustomKey;

/**
 * Host-only placeholder so arrangements can pass a non-empty
 * `identificationFields` array without showing free-text fields. Never submitted.
 */
export const PROPERTY_LAND_IDENTIFICATION_PLACEHOLDER_KEY =
  "__host_land_dls_only__";

/** Residential / Commercial DLS free-text keys (order matches Review labels). */
export const PROPERTY_IDENTIFICATION_FIELDS_PROPERTIES = [
  "parcel_number",
  "plot_number",
  "building_number",
  "floor_number",
  "apartment_number",
] as const satisfies readonly PropertyIdentificationFieldKey[];

/** Land DLS free-text keys: Parcel Number + Plot Number. */
export const PROPERTY_IDENTIFICATION_FIELDS_LAND = [
  "parcel_number",
  "plot_number",
] as const satisfies readonly PropertyIdentificationFieldKey[];

export const PROPERTY_IDENTIFICATION_FIELDS_BY_ARRANGEMENT: Record<
  PropertyArrangementId,
  readonly PropertyIdentificationFieldKey[]
> = {
  properties: PROPERTY_IDENTIFICATION_FIELDS_PROPERTIES,
  land: PROPERTY_IDENTIFICATION_FIELDS_LAND,
};

export const PROPERTY_IDENTIFICATION_NUMERIC_KEYS = [
  "floor_number",
] as const satisfies readonly PropertyIdentificationFieldKey[];
