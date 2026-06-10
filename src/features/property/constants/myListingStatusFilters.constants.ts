export const MY_LISTING_STATUS_FILTER_VALUES = [
  "draft",
  "in_progress",
  "submitted",
  "pending_approval",
  "pending_admin_approval",
  "changes_requested",
  "approved",
  "verified",
  "rejected",
] as const;

export type MyListingStatusFilterValue =
  (typeof MY_LISTING_STATUS_FILTER_VALUES)[number];
