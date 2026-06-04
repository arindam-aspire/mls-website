export const AGENCY_CURRENCIES = ["JOD", "USD"] as const;

export type AgencyCurrency = (typeof AGENCY_CURRENCIES)[number];

export const DEFAULT_AGENCY_CURRENCY: AgencyCurrency = "JOD";

export const AGENCY_MEASUREMENT_UNITS = ["SQFT", "SQM"] as const;

export type AgencyMeasurementUnit = (typeof AGENCY_MEASUREMENT_UNITS)[number];

export const DEFAULT_AGENCY_MEASUREMENT_UNIT: AgencyMeasurementUnit = "SQFT";

/** When false, display preferences are read-only (no PUT until backend supports saves). */
export const AGENCY_DISPLAY_PREFERENCES_PERSIST_ENABLED = false;
