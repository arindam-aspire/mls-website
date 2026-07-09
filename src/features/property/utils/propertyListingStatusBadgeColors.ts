export type PropertyListingStatusBadgeColorKey =
  | "draft"
  | "submitted"
  | "agent-assigned"
  | "pending-approval"
  | "active"
  | "rejected"
  | "deal-closure-requested"
  | "deal-closed"
  | "sold"
  | "rented";

const PROPERTY_LISTING_STATUS_BADGE_COLOR_CLASSES: Record<
  PropertyListingStatusBadgeColorKey,
  string
> = {
  draft:
    "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300",
  submitted:
    "border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-600 dark:bg-blue-950/50 dark:text-blue-300",
  "agent-assigned":
    "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-300",
  "pending-approval":
    "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-600 dark:bg-amber-950/50 dark:text-amber-300",
  active:
    "border-green-300 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-950/50 dark:text-green-300",
  rejected:
    "border-red-300 bg-red-50 text-red-700 dark:border-red-600 dark:bg-red-950/50 dark:text-red-300",
  "deal-closure-requested":
    "border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-600 dark:bg-orange-950/50 dark:text-orange-300",
  "deal-closed":
    "border-teal-300 bg-teal-50 text-teal-700 dark:border-teal-600 dark:bg-teal-950/50 dark:text-teal-300",
  sold: "border-purple-300 bg-purple-50 text-purple-700 dark:border-purple-600 dark:bg-purple-950/50 dark:text-purple-300",
  rented:
    "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-300",
};

const DEFAULT_PROPERTY_LISTING_STATUS_BADGE_COLOR_CLASSES =
  "border-secondary/25 bg-page text-muted";

export function normalizePropertyListingStatusKeyForBadge(
  statusKey: string,
): string {
  return statusKey.trim().toLowerCase().replace(/[_\s]+/g, "-");
}

export function getPropertyListingStatusBadgeClassName(
  statusKey: string,
): string {
  const normalized = normalizePropertyListingStatusKeyForBadge(statusKey);

  if (normalized in PROPERTY_LISTING_STATUS_BADGE_COLOR_CLASSES) {
    return PROPERTY_LISTING_STATUS_BADGE_COLOR_CLASSES[
      normalized as PropertyListingStatusBadgeColorKey
    ];
  }

  return DEFAULT_PROPERTY_LISTING_STATUS_BADGE_COLOR_CLASSES;
}
