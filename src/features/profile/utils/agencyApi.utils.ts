import type {
  Agency,
  AgencyApiPayload,
  GetAgencyResponse,
  NormalizedGetAgencyResponse,
} from "../types/profile.types";
import {
  normalizeAgencyCurrency,
  normalizeAgencyMeasurementUnit,
} from "./agencyPreferences.utils";

export function normalizeAgencyEntity(agency: Agency): Agency {
  return {
    ...agency,
    currency: normalizeAgencyCurrency(agency.currency),
    measurement_unit: normalizeAgencyMeasurementUnit(agency.measurement_unit),
  };
}

export function isAgencyApiPayload(
  data: Agency | AgencyApiPayload,
): data is AgencyApiPayload {
  return (
    typeof data === "object" &&
    data !== null &&
    "agency" in data &&
    typeof (data as AgencyApiPayload).agency === "object"
  );
}

export function unwrapAgencyFromResponseData(data: Agency | AgencyApiPayload): Agency {
  const agency = isAgencyApiPayload(data) ? data.agency : data;
  return normalizeAgencyEntity(agency);
}

export function normalizeGetAgencyResponse(
  response: GetAgencyResponse,
): NormalizedGetAgencyResponse {
  return {
    ...response,
    data: unwrapAgencyFromResponseData(response.data),
  };
}
