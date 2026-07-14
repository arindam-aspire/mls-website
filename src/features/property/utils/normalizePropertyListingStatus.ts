import {
  createListingStatus,
  PROPERTY_LISTING_STATUS_KEYS,
  type PropertyListingStatus,
  type PropertyListingStatusKey,
} from "@abdoun/abdoun-library";
import type { LocalizedText, PropertyListing } from "../types/property.types";

function resolveStatusKey(statusSlug: string): PropertyListingStatusKey {
  if (
    PROPERTY_LISTING_STATUS_KEYS.includes(statusSlug as PropertyListingStatusKey)
  ) {
    return statusSlug as PropertyListingStatusKey;
  }

  return "draft";
}

export function normalizePropertyListingStatus(
  status: string | PropertyListingStatus,
  label?: string,
): PropertyListingStatus {
  if (typeof status === "object" && status !== null && "key" in status) {
    return status;
  }

  const slug = typeof status === "string" && status.length > 0 ? status : "draft";

  return createListingStatus(resolveStatusKey(slug), label ?? slug);
}

const EMPTY_TITLE: LocalizedText = { en: "", ar: "", esp: "", fr: "" };

function normalizeListingTitle(title: unknown): LocalizedText {
  if (title == null) {
    return EMPTY_TITLE;
  }

  if (typeof title === "string") {
    const trimmed = title.trim();
    return { en: trimmed, ar: trimmed, esp: trimmed, fr: trimmed };
  }

  if (typeof title !== "object") {
    return EMPTY_TITLE;
  }

  const record = title as Record<string, unknown>;
  const en = String(record.en ?? "").trim();
  const ar = String(record.ar ?? "").trim();
  const esp = String(record.esp ?? record.es ?? "").trim();
  const fr = String(record.fr ?? "").trim();
  const fallback = en || ar || esp || fr;

  return {
    en: en || fallback,
    ar: ar || fallback,
    esp: esp || fallback,
    fr: fr || fallback,
  };
}

const PRICE_WITH_CURRENCY_PATTERN = /^[A-Za-z]{3}\s+.+$/;

/** Coerce API currency (string | number | `{ code }` etc.) to an ISO-like code. */
export function coerceListingCurrencyCode(currency: unknown): string | null {
  if (currency == null) {
    return null;
  }

  if (typeof currency === "string") {
    const trimmed = currency.trim();
    return trimmed ? trimmed.toUpperCase() : null;
  }

  if (typeof currency === "number" || typeof currency === "boolean") {
    const asString = String(currency).trim();
    return asString ? asString.toUpperCase() : null;
  }

  if (typeof currency === "object") {
    const record = currency as Record<string, unknown>;
    const nested =
      record.code ??
      record.currency_code ??
      record.currencyCode ??
      record.iso ??
      record.value ??
      record.currency;
    if (nested != null && nested !== currency) {
      return coerceListingCurrencyCode(nested);
    }
  }

  return null;
}

/**
 * Library cards expect `price` like `"JOD 12000"` (then display as `12000 JOD`),
 * and/or a separate string `currency`. Catalogue APIs may send non-string currency.
 */
export function formatListingPriceWithCurrency(
  price: unknown,
  currency?: unknown,
): string {
  const rawPrice =
    typeof price === "number"
      ? String(price)
      : typeof price === "string"
        ? price.trim()
        : "";

  if (!rawPrice) {
    return "";
  }

  if (PRICE_WITH_CURRENCY_PATTERN.test(rawPrice)) {
    return rawPrice;
  }

  const code = coerceListingCurrencyCode(currency) || "JOD";
  const numeric = Number(rawPrice.replace(/,/g, ""));
  const formatted = Number.isFinite(numeric)
    ? numeric.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : rawPrice;

  return `${code} ${formatted}`;
}

type ListingAgencySource = {
  agency_id?: number | string | null;
  agency_name?: string | null;
  agency_trade_name?: string | null;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
} | null;

type ListingAgentSource = {
  id?: number | null;
  name?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  photo?: string | null;
  license_number?: string | null;
} | null;

/** Library `AgencyDetails` forbids `null` and requires `agency_id` + `agency_name`. */
function normalizeListingAgency(
  agency: ListingAgencySource | undefined,
): PropertyListing["agency"] {
  if (!agency) {
    return undefined;
  }

  const agencyName = agency.agency_name?.trim();
  if (agency.agency_id == null || !agencyName) {
    return undefined;
  }

  return {
    agency_id: agency.agency_id,
    agency_name: agencyName,
    agency_trade_name: agency.agency_trade_name ?? null,
    email: agency.email ?? null,
    phone: agency.phone ?? null,
    website: agency.website ?? null,
  };
}

/** Library `AgentDetails` forbids `null` and requires `id` + `name`. */
function normalizeListingAgent(
  agent: ListingAgentSource | undefined,
): PropertyListing["agent"] {
  if (!agent) {
    return undefined;
  }

  const name =
    agent.name?.trim() ||
    agent.email?.trim() ||
    agent.phone?.trim() ||
    agent.whatsapp?.trim() ||
    "";
  if (!name) {
    return undefined;
  }

  const id =
    typeof agent.id === "number" && Number.isFinite(agent.id)
      ? agent.id
      : Number(agent.id);
  const resolvedId = Number.isFinite(id) ? id : 0;

  return {
    id: resolvedId,
    name,
    phone: agent.phone ?? null,
    whatsapp: agent.whatsapp ?? null,
    email: agent.email ?? null,
    photo: agent.photo ?? null,
    license_number: agent.license_number ?? null,
  };
}

type ListingNormalizeInput = Partial<Omit<PropertyListing, "status" | "agency" | "agent">> & {
  status: string | PropertyListingStatus;
  currency?: unknown;
  agency?: ListingAgencySource;
  agent?: ListingAgentSource;
};

/**
 * Coerce API / partial listing rows into a card-safe `PropertyListing`
 * (status object, localized title, price+currency, agency/agent without `null`).
 */
export function normalizePropertyListing(
  listing: ListingNormalizeInput,
): PropertyListing {
  const currencyCode = coerceListingCurrencyCode(listing.currency);
  const agency = normalizeListingAgency(listing.agency);
  const agent = normalizeListingAgent(listing.agent);

  // Drop raw agency/agent/currency — API null/non-string shapes crash library card types.
  const {
    currency: _rawCurrency,
    agency: _rawAgency,
    agent: _rawAgent,
    ...listingRest
  } = listing;

  return {
    ...(listingRest as unknown as PropertyListing),
    status: normalizePropertyListingStatus(listing.status),
    title: normalizeListingTitle(listing.title),
    price: formatListingPriceWithCurrency(listing.price, currencyCode),
    currency: currencyCode,
    ...(agency ? { agency } : {}),
    ...(agent ? { agent } : {}),
  };
}
