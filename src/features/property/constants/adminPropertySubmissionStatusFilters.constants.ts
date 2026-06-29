/** Status values supported by `GET /admin/property-submissions`. */
export const ADMIN_PROPERTY_SUBMISSION_STATUS_FILTER_VALUES = [
  "pending-approval",
  "active",
  "rejected",
] as const;

export type AdminPropertySubmissionStatusFilterValue =
  (typeof ADMIN_PROPERTY_SUBMISSION_STATUS_FILTER_VALUES)[number];
