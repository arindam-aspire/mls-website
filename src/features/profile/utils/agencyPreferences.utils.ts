import {
  AGENCY_CURRENCIES,
  AGENCY_MEASUREMENT_UNITS,
  DEFAULT_AGENCY_CURRENCY,
  DEFAULT_AGENCY_MEASUREMENT_UNIT,
  type AgencyCurrency,
  type AgencyMeasurementUnit,
} from "../constants/agencyPreferences";

function normalizeEnum<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  if (typeof value !== "string") return fallback;
  const upper = value.trim().toUpperCase();
  return (allowed as readonly string[]).includes(upper) ? (upper as T) : fallback;
}

export function normalizeAgencyCurrency(value: unknown): AgencyCurrency {
  return normalizeEnum(value, AGENCY_CURRENCIES, DEFAULT_AGENCY_CURRENCY);
}

export function normalizeAgencyMeasurementUnit(value: unknown): AgencyMeasurementUnit {
  return normalizeEnum(value, AGENCY_MEASUREMENT_UNITS, DEFAULT_AGENCY_MEASUREMENT_UNIT);
}
