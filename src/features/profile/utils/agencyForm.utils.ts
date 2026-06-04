import type { Agency, EditAgencyFormValues, UpdateAgencyRequest } from "../types/profile.types";

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function agencyToEditFormValues(agency: Agency): EditAgencyFormValues {
  return {
    agency_name: agency.agency_name.trim(),
    agency_trade_name: agency.agency_trade_name.trim(),
    website: agency.website?.trim() ?? "",
    address: agency.address?.trim() ?? "",
    city: agency.city?.trim() ?? "",
    state: agency.state?.trim() ?? "",
    country: agency.country?.trim() ?? "",
    zip_code: agency.zip_code?.trim() ?? "",
  };
}

type EditAgencyFieldsUpdate = Pick<
  UpdateAgencyRequest,
  | "agency_name"
  | "agency_trade_name"
  | "website"
  | "address"
  | "city"
  | "state"
  | "country"
  | "zip_code"
>;

export function editFormValuesToUpdateAgencyRequest(
  values: EditAgencyFormValues,
): Required<EditAgencyFieldsUpdate> {
  return {
    agency_name: values.agency_name.trim(),
    agency_trade_name: values.agency_trade_name.trim(),
    website: emptyToNull(values.website),
    address: emptyToNull(values.address),
    city: emptyToNull(values.city),
    state: emptyToNull(values.state),
    country: emptyToNull(values.country),
    zip_code: emptyToNull(values.zip_code),
  };
}

export function editFormValuesToChangedUpdateAgencyRequest(
  agency: Agency,
  values: EditAgencyFormValues,
): UpdateAgencyRequest {
  const baseline = agencyToEditFormValues(agency);
  const next = editFormValuesToUpdateAgencyRequest(values);
  const previous = editFormValuesToUpdateAgencyRequest(baseline);
  const payload: UpdateAgencyRequest = {};

  if (next.agency_name !== previous.agency_name) {
    payload.agency_name = next.agency_name;
  }
  if (next.agency_trade_name !== previous.agency_trade_name) {
    payload.agency_trade_name = next.agency_trade_name;
  }
  if (next.website !== previous.website) {
    payload.website = next.website;
  }
  if (next.address !== previous.address) {
    payload.address = next.address;
  }
  if (next.city !== previous.city) {
    payload.city = next.city;
  }
  if (next.state !== previous.state) {
    payload.state = next.state;
  }
  if (next.country !== previous.country) {
    payload.country = next.country;
  }
  if (next.zip_code !== previous.zip_code) {
    payload.zip_code = next.zip_code;
  }

  return payload;
}

export function hasUpdateAgencyRequestChanges(body: UpdateAgencyRequest): boolean {
  return Object.keys(body).length > 0;
}

export function isValidOptionalUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return true;

  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function toExternalWebsiteHref(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.href;
    }
  } catch {
    return null;
  }

  return null;
}
