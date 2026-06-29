export const MY_LISTING_STATUS_FILTER_VALUES = [
  "active",
] as const;

export type MyListingStatusFilterValue =
  (typeof MY_LISTING_STATUS_FILTER_VALUES)[number];
