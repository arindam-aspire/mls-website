import type { LoggedInUser } from "@/src/features/auth/types/user.types";
import type { PropertyDetails } from "@/src/features/property/types/property.types";
import {
  resolvePropertyDetailsAgent,
  resolvePropertyDetailsOwner,
} from "@/src/features/property/utils/propertyContactActions.utils";
import { resolvePropertyViewOwners } from "@/src/features/property/mappers/mapPropertyDetailsForPropertyView";
import type { ContactModalContext } from "../types/contactModal.types";
import { buildDefaultInquiryMessage } from "../utils/contactMessage.utils";

type LocalizedLike =
  | string
  | {
      en?: string;
      ar?: string;
      es?: string;
      fr?: string;
      esp?: string;
      [key: string]: string | undefined;
    }
  | null
  | undefined;

/** Minimal listing shape used for card contact actions (library + app fields). */
export type ContactPropertyListingSource = {
  id: number;
  property_id?: string | null;
  property_hash?: string | number | null;
  reference_number?: string | null;
  title?: LocalizedLike;
  brokerName?: string | null;
  agent?: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    whatsapp?: string | null;
  } | null;
  agency?: {
    agency_name?: string | null;
    agency_trade_name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
  owners?: Array<{
    name?: string | null;
    full_name?: string | null;
    email?: string | null;
    phone?: string | null;
  }>;
};

/** Resolves numeric `property_hash` for lead creation (listing or details). */
export function resolveContactPropertyHash(source: {
  property_hash?: string | number | null;
  id?: number | string | null;
}): number | null {
  const raw = source.property_hash ?? source.id;
  if (raw == null || raw === "") return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function resolveLocalizedText(
  value: LocalizedLike,
  locale: string,
): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  return (
    value[locale]?.trim() ||
    value.en?.trim() ||
    value.ar?.trim() ||
    value.esp?.trim() ||
    Object.values(value).find((entry) => entry?.trim())?.trim() ||
    ""
  );
}

function customerFromUser(user: LoggedInUser | null | undefined): {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
} {
  return {
    customerName: user?.full_name?.trim() || "",
    customerEmail: user?.email?.trim() || "",
    customerPhone: user?.phone_number?.trim() || "",
  };
}

export function mapListingToContactContext(params: {
  listing: ContactPropertyListingSource;
  user: LoggedInUser | null | undefined;
  locale: string;
  buildMessage: (propertyTitle: string, propertyReference: string) => string;
}): ContactModalContext {
  const { listing, user, locale, buildMessage } = params;
  const agent = listing.agent;
  const agency = listing.agency;
  const owner = listing.owners?.[0];

  // Card Email / Call / WhatsApp → agent (To / Sent to). Agency / owner are fallbacks only.
  const recipientName =
    agent?.name?.trim() ||
    listing.brokerName?.trim() ||
    agency?.agency_name?.trim() ||
    agency?.agency_trade_name?.trim() ||
    owner?.name?.trim() ||
    owner?.full_name?.trim() ||
    "";

  const recipientEmail =
    agent?.email?.trim() ||
    agency?.email?.trim() ||
    owner?.email?.trim() ||
    "";

  const recipientPhone =
    agent?.phone?.trim() ||
    agency?.phone?.trim() ||
    owner?.phone?.trim() ||
    "";

  const recipientWhatsApp =
    agent?.whatsapp?.trim() ||
    agent?.phone?.trim() ||
    agency?.phone?.trim() ||
    recipientPhone;

  const propertyTitle = resolveLocalizedText(listing.title, locale);
  const propertyReference =
    listing.reference_number?.trim() ||
    listing.property_id?.trim() ||
    String(listing.id);

  const customer = customerFromUser(user);

  return {
    recipientName,
    recipientEmail,
    recipientPhone,
    recipientWhatsApp,
    ...customer,
    propertyTitle,
    propertyReference,
    propertyHash: resolveContactPropertyHash(listing),
    createsLead: true,
    defaultMessage: buildDefaultInquiryMessage({
      propertyTitle,
      propertyReference,
      buildMessage,
    }),
  };
}

export function mapPropertyDetailsAgentToContactContext(params: {
  propertyDetails: PropertyDetails | null | undefined;
  user: LoggedInUser | null | undefined;
  locale: string;
  buildMessage: (propertyTitle: string, propertyReference: string) => string;
}): ContactModalContext | null {
  const { propertyDetails, user, locale, buildMessage } = params;
  if (!propertyDetails) return null;

  const agent = resolvePropertyDetailsAgent(propertyDetails);
  if (!agent) return null;

  const propertyTitle = resolveLocalizedText(
    propertyDetails.title as unknown as LocalizedLike,
    locale,
  );
  const propertyReference =
    (propertyDetails as { reference_number?: string | null }).reference_number?.trim() ||
    propertyDetails.property_id?.trim() ||
    String(propertyDetails.id ?? "");

  const customer = customerFromUser(user);
  const detailsHashSource = propertyDetails as {
    property_hash?: string | number | null;
    id?: number | string | null;
  };

  return {
    recipientName:
      (propertyDetails.agent?.name ?? propertyDetails.agent_name)?.trim() ||
      agent.email?.trim() ||
      agent.phone?.trim() ||
      "",
    recipientEmail: agent.email?.trim() || "",
    recipientPhone: agent.phone?.trim() || "",
    recipientWhatsApp: agent.whatsapp?.trim() || agent.phone?.trim() || "",
    ...customer,
    propertyTitle,
    propertyReference,
    propertyHash: resolveContactPropertyHash(detailsHashSource),
    createsLead: true,
    defaultMessage: buildDefaultInquiryMessage({
      propertyTitle,
      propertyReference,
      buildMessage,
    }),
  };
}

export function mapPropertyDetailsOwnerToContactContext(params: {
  propertyDetails: PropertyDetails | null | undefined;
  ownerId?: number;
  user: LoggedInUser | null | undefined;
  locale: string;
  buildMessage: (propertyTitle: string, propertyReference: string) => string;
}): ContactModalContext | null {
  const { propertyDetails, ownerId, user, locale, buildMessage } = params;
  if (!propertyDetails) return null;

  const ownerContact = resolvePropertyDetailsOwner(propertyDetails, ownerId);
  if (!ownerContact) return null;

  const owners = resolvePropertyViewOwners(propertyDetails);
  const matchedOwner =
    ownerId == null
      ? owners[0]
      : owners.find((entry) => entry.id === ownerId) ?? owners[0];

  const propertyTitle = resolveLocalizedText(
    propertyDetails.title as unknown as LocalizedLike,
    locale,
  );
  const propertyReference =
    (propertyDetails as { reference_number?: string | null }).reference_number?.trim() ||
    propertyDetails.property_id?.trim() ||
    String(propertyDetails.id ?? "");

  const customer = customerFromUser(user);
  const detailsHashSource = propertyDetails as {
    property_hash?: string | number | null;
    id?: number | string | null;
  };

  return {
    recipientName:
      matchedOwner?.name?.trim() ||
      ownerContact.email?.trim() ||
      ownerContact.phone?.trim() ||
      "",
    recipientEmail: ownerContact.email?.trim() || "",
    recipientPhone: ownerContact.phone?.trim() || "",
    recipientWhatsApp:
      ownerContact.whatsapp?.trim() || ownerContact.phone?.trim() || "",
    ...customer,
    propertyTitle,
    propertyReference,
    propertyHash: resolveContactPropertyHash(detailsHashSource),
    createsLead: true,
    defaultMessage: buildDefaultInquiryMessage({
      propertyTitle,
      propertyReference,
      buildMessage,
    }),
  };
}
