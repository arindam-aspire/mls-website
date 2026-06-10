import type { ComponentProps } from "react";
import {
  createListingStatus,
  PROPERTY_LISTING_STATUS_KEYS,
  type ListTableView,
  type PropertyListingStatusKey,
} from "@abdoun/abdoun-library";
import type { AgentPropertyListItem } from "../types/property.types";

type LibraryPropertyListing = ComponentProps<typeof ListTableView>["data"][number];

const EMPTY_LOCALIZED_TEXT = {
  en: "",
  ar: "",
  esp: "",
  fr: "",
};

const EMPTY_LOCALIZED_NULLABLE_TEXT = {
  en: null,
  ar: null,
  esp: null,
  fr: null,
};

const EMPTY_LOCATION = {
  country_id: 0,
  country: "",
  city_id: 0,
  city: "",
  region_id: 0,
  region: "",
  address: EMPTY_LOCALIZED_TEXT,
  latitude: null,
  longitude: null,
  map_embed_url: null,
};

const EMPTY_MEDIA = {
  thumbnail: null,
  images: [],
  videos: [],
  virtual_tour_url: null,
  floor_plan_images: [],
  documents: [],
};

function toLocalizedText(value: string) {
  return {
    en: value,
    ar: value,
    esp: value,
    fr: value,
  };
}

function resolveStatusKey(statusSlug: string): PropertyListingStatusKey {
  if (
    PROPERTY_LISTING_STATUS_KEYS.includes(statusSlug as PropertyListingStatusKey)
  ) {
    return statusSlug as PropertyListingStatusKey;
  }

  return "draft";
}

function formatListingPrice(price: string, currency: string): string {
  if (!price) {
    return "";
  }

  if (currency && !price.includes(currency)) {
    return `${price} ${currency}`.trim();
  }

  return price;
}

export function mapAgentPropertyListItem(
  item: AgentPropertyListItem,
): LibraryPropertyListing {
  const statusKey = resolveStatusKey(item.status_slug);

  return {
    id: item.property_hash,
    property_id: item.property_id,
    reference_number: item.reference_number,
    title: toLocalizedText(item.title),
    description: EMPTY_LOCALIZED_NULLABLE_TEXT,
    price: formatListingPrice(item.price, item.currency),
    status: createListingStatus(statusKey, item.status_name),
    category: item.category_name,
    searchPropertyType: item.type_slug,
    city: "",
    areaName: "",
    propertyType: item.type_name,
    media: EMPTY_MEDIA,
    location: EMPTY_LOCATION,
    location_detail: EMPTY_LOCATION,
    beds: 0,
    baths: 0,
    area: null,
    acres: null,
    highlights: "",
    badges: [],
    handover: null,
    paymentPlan: null,
    validatedDate: item.submission_submitted_at ?? "",
    brokerName: "",
    brokerLogo: null,
    owners: [],
    is_exclusive: false,
    is_favourite: false,
    property_hash: String(item.property_hash),
  };
}

export function mapAgentPropertyListItems(
  items: AgentPropertyListItem[] | undefined,
): LibraryPropertyListing[] {
  if (!items?.length) {
    return [];
  }

  return items.map(mapAgentPropertyListItem);
}
