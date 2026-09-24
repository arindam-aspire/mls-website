/**
 * DLS / listing arrangements for category selection.
 * Properties groups Residential + Commercial; Land is its own arrangement.
 */
export const PROPERTY_ARRANGEMENT_IDS = ["properties", "land"] as const;

export type PropertyArrangementId = (typeof PROPERTY_ARRANGEMENT_IDS)[number];

export const DEFAULT_PROPERTY_ARRANGEMENT: PropertyArrangementId = "properties";

/** Category slugs that belong to each arrangement (API / taxonomy contracts). */
export const PROPERTY_ARRANGEMENT_CATEGORY_SLUGS: Record<
  PropertyArrangementId,
  readonly string[]
> = {
  properties: ["residential", "commercial"],
  land: ["land"],
};
