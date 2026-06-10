import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const PAGE_METADATA_KEYS = [
  "dashboard",
  "favourites",
  "recentlyViewed",
  "savedSearches",
  "notifications",
  "myProfile",
  "propertyList",
  "propertyDetails",
  "inquiries",
  "listing",
  "manageListings",
  "propertyCreate",
  "propertyUpdate",
] as const;

export type PageMetadataKey = (typeof PAGE_METADATA_KEYS)[number];

export async function buildPageMetadata(pageKey: PageMetadataKey): Promise<Metadata> {
  const t = await getTranslations("metadata");

  return {
    title: `${t(pageKey)} - ${t("titleSuffix")}`,
  };
}
