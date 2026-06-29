import type {
  Agency,
  AgencyApiPayload,
  AgencyListItem,
  AgencyListItemRaw,
  AgencyListResponse,
  GetAgencyResponse,
  NormalizedAgencyListResponse,
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

function normalizeNullableUrl(value: string | null | undefined): string | null {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeAgencyListItem(raw: AgencyListItemRaw): AgencyListItem | null {
  const id = raw.id?.trim() ?? "";
  if (!id) {
    return null;
  }

  const agencyName = raw.agency_name?.trim() ?? "";

  return {
    id,
    agency_name: agencyName,
    logo_url: normalizeNullableUrl(raw.logo_url),
    email: raw.email?.trim() ?? "",
    phone: raw.phone?.trim() ?? "",
    status: raw.status?.trim() || (raw.is_active ? "ACTIVE" : "PENDING_APPROVAL"),
    is_active: Boolean(raw.is_active),
    is_verified: Boolean(raw.is_verified),
    created_at: raw.created_at?.trim() ?? "",
  };
}

export function normalizeAgencyListResponse(
  response: AgencyListResponse,
  params: { skip: number; limit: number },
): NormalizedAgencyListResponse {
  const rawItems = response.data ?? [];

  const items = rawItems
    .map(normalizeAgencyListItem)
    .filter((item): item is AgencyListItem => item !== null);

  return {
    items,
    total: items.length,
    skip: params.skip,
    limit: params.limit,
  };
}
