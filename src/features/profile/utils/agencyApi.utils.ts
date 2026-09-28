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

function readAgencyRecordId(value: unknown): string | null {
  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  const trimmed = String(value).trim();
  if (!trimmed || trimmed.toLowerCase() === "null" || trimmed.toLowerCase() === "undefined") {
    return null;
  }

  return trimmed;
}

function readAgencyPhone(raw: AgencyListItemRaw): string {
  const phone = raw.phone?.trim() ?? "";
  if (phone) {
    return phone;
  }

  return raw.phone_number?.trim() ?? "";
}

/**
 * Invited rows are not agencies. `agency_id` is null and `invitation_id` is set,
 * or `agency_status` is `Invited`.
 */
export function isInvitedAgencyListRow(raw: AgencyListItemRaw): boolean {
  if (raw.agency_status?.trim().toLowerCase() === "invited") {
    return true;
  }

  return readAgencyRecordId(raw.agency_id) == null && readAgencyRecordId(raw.invitation_id) != null;
}

/** True when `agencyId` can be sent to agency-detail APIs. */
export function isUsableAgencyId(agencyId: string | null | undefined): agencyId is string {
  return readAgencyRecordId(agencyId) != null;
}

/** Real agencies only. Invited rows must not be passed to `GET /agency/{id}`. */
export function isSelectableAgency(
  agency: AgencyListItem,
): agency is AgencyListItem & { agency_id: string } {
  return !agency.is_invited && isUsableAgencyId(agency.agency_id);
}

function normalizeAgencyListItem(raw: AgencyListItemRaw): AgencyListItem | null {
  const invited = isInvitedAgencyListRow(raw);
  const invitationId = readAgencyRecordId(raw.invitation_id);
  const explicitAgencyId = readAgencyRecordId(raw.agency_id);
  const legacyId = readAgencyRecordId(raw.id);
  const agencyId = invited ? null : explicitAgencyId ?? (invitationId ? null : legacyId);
  const rowId = (invited ? invitationId ?? legacyId : agencyId ?? legacyId) ?? invitationId;

  if (!rowId) {
    return null;
  }

  const agencyName = raw.agency_name?.trim() ?? "";

  return {
    id: rowId,
    agency_id: agencyId,
    invitation_id: invitationId,
    is_invited: invited,
    agency_name: agencyName,
    logo_url: normalizeNullableUrl(raw.logo_url),
    email: raw.email?.trim() ?? "",
    phone: readAgencyPhone(raw),
    status: invited
      ? raw.status?.trim() || "PENDING"
      : raw.status?.trim() || (raw.is_active ? "ACTIVE" : "PENDING_APPROVAL"),
    agency_status: invited
      ? raw.agency_status?.trim() || "Invited"
      : raw.agency_status?.trim() || (raw.is_active ? "Active" : "Inactive"),
    verification_status: invited
      ? raw.verification_status?.trim() || ""
      : raw.verification_status?.trim() ||
        (raw.is_verified
          ? "Verified"
          : raw.status === "REJECTED"
            ? "Rejected"
            : "Pending Verification"),
    is_active: invited ? false : Boolean(raw.is_active),
    is_verified: invited ? false : Boolean(raw.is_verified),
    created_at: raw.created_at?.trim() ?? "",
  };
}

export function normalizeAgencyListResponse(
  response: AgencyListResponse,
  params: { skip: number; limit: number },
): NormalizedAgencyListResponse {
  const rawItems = response.data ?? [];
  const pagination =
    response.meta &&
    typeof response.meta === "object" &&
    "pagination" in response.meta &&
    response.meta.pagination &&
    typeof response.meta.pagination === "object"
      ? (response.meta.pagination as { total?: unknown })
      : null;
  const total =
    typeof pagination?.total === "number" ? pagination.total : rawItems.length;

  const items = rawItems
    .map(normalizeAgencyListItem)
    .filter((item): item is AgencyListItem => item !== null);

  return {
    items,
    total,
    skip: params.skip,
    limit: params.limit,
  };
}
