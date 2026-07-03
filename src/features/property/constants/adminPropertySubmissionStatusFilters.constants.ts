/** Status values supported by `GET /admin/property-submissions`. */
export const ADMIN_PROPERTY_SUBMISSION_STATUS_FILTER_VALUES = [
  "submitted",
  "agent-assigned",
  "pending-approval",
  "active",
  "deal_closed",
  "deactivated",
  "rejected",
] as const;

export type AdminPropertySubmissionStatusFilterValue =
  (typeof ADMIN_PROPERTY_SUBMISSION_STATUS_FILTER_VALUES)[number];
