export const OWNER_LIST_STATUS_FILTER_VALUES = ["active", "suspended"] as const;

export type OwnerListStatusFilterValue =
  (typeof OWNER_LIST_STATUS_FILTER_VALUES)[number];

/** UI filter value → future `GET /owners` `status` query param (uppercase API enum). */
export const OWNER_LIST_STATUS_FILTER_TO_API_STATUS: Record<
  OwnerListStatusFilterValue,
  string
> = {
  active: "ACTIVE",
  suspended: "SUSPENDED",
};

export function isOwnerListStatusFilterValue(
  value: string,
): value is OwnerListStatusFilterValue {
  return (OWNER_LIST_STATUS_FILTER_VALUES as readonly string[]).includes(value);
}
