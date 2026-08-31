import type {
  PropertyCardContact,
  PropertyListing,
} from "../types/property.types";
import { listingHasContactAgent } from "./propertyContactActions.utils";

function trim(value: string | null | undefined): string {
  return value?.trim() || "";
}

function resolveAgencyDisplayName(listing: PropertyListing): string {
  return (
    trim(listing.agency?.agency_name) ||
    trim(listing.agency?.agency_trade_name)
  );
}

/**
 * Real Email / Call / WhatsApp targets for a listing card.
 * Prefers `cardContact` when the listing was already mapped for display.
 * Agent first, then agency — never owner.
 */
export function resolveListingCardContact(
  listing: PropertyListing,
): PropertyCardContact {
  if (listing.cardContact) {
    return listing.cardContact;
  }

  const agent = listing.agent;
  const agency = listing.agency;

  return {
    name:
      trim(agent?.name) ||
      trim(listing.brokerName) ||
      trim(agency?.agency_name) ||
      trim(agency?.agency_trade_name),
    email: trim(agent?.email) || trim(agency?.email),
    phone: trim(agent?.phone) || trim(agency?.phone),
    whatsapp:
      trim(agent?.whatsapp) ||
      trim(agent?.phone) ||
      trim(agency?.phone),
    hasSourceAgent: listingHasContactAgent(agent),
  };
}

/**
 * Maps a listing for library Grid/List cards:
 * - hides owners
 * - shows Agency Name as the agent-block title when present
 * - shows Agent Name as the agent-block subtitle when both names exist
 * - keeps real contact on `cardContact` so Email / Call / WhatsApp stay accurate
 */
export function mapListingForPropertyCard(
  listing: PropertyListing,
): PropertyListing {
  const cardContact = resolveListingCardContact(listing);
  const agencyName = resolveAgencyDisplayName(listing);
  const agentName = trim(listing.agent?.name);
  const displayName = agencyName || agentName;

  if (!displayName) {
    return {
      ...listing,
      owners: [],
      cardContact,
    };
  }

  const bothNames = Boolean(agencyName && agentName);
  const sourceAgent = listing.agent;

  return {
    ...listing,
    owners: [],
    cardContact,
    agent: {
      id: sourceAgent?.id ?? 0,
      name: displayName,
      photo: sourceAgent?.photo ?? null,
      license_number: sourceAgent?.license_number ?? null,
      phone: bothNames
        ? null
        : (sourceAgent?.phone ?? listing.agency?.phone ?? null),
      email: bothNames
        ? agentName
        : (sourceAgent?.email ?? listing.agency?.email ?? null),
      whatsapp: sourceAgent?.whatsapp ?? null,
    },
  };
}
