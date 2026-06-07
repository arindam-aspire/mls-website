export const PROPERTY_DETAILS_TAB = {
  overview: "overview",
  features: "features",
  locations: "locations",
  documents: "documents",
} as const;

export type PropertyDetailsTabValue =
  (typeof PROPERTY_DETAILS_TAB)[keyof typeof PROPERTY_DETAILS_TAB];

export const PROPERTY_DETAILS_DEFAULT_TAB = PROPERTY_DETAILS_TAB.overview;

export const PROPERTY_DETAILS_PUBLIC_TAB_VALUES = [
  PROPERTY_DETAILS_TAB.overview,
  PROPERTY_DETAILS_TAB.features,
] as const satisfies readonly PropertyDetailsTabValue[];

export const PROPERTY_DETAILS_RESTRICTED_TAB_VALUES = [
  PROPERTY_DETAILS_TAB.locations,
  PROPERTY_DETAILS_TAB.documents,
] as const satisfies readonly PropertyDetailsTabValue[];
