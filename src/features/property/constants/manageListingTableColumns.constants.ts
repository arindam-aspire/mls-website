export const MANAGE_LISTING_TABLE_COLUMN_IDS = [
  "title",
  "status",
  "submittedBy",
  "agentName",
  "submission",
  "reviewedOn",
  "actions",
] as const;

export type ManageListingTableColumnId = (typeof MANAGE_LISTING_TABLE_COLUMN_IDS)[number];

/** Always shown in the table; excluded from the toggle-columns popover. */
export const MANAGE_LISTING_ALWAYS_VISIBLE_COLUMN_IDS = ["title", "actions"] as const;

export type ManageListingAlwaysVisibleColumnId =
  (typeof MANAGE_LISTING_ALWAYS_VISIBLE_COLUMN_IDS)[number];

/** Shown in the toggle-columns popover. */
export const MANAGE_LISTING_TOGGLEABLE_COLUMN_IDS = [
  "status",
  "submittedBy",
  "agentName",
  "submission",
  "reviewedOn",
] as const;

export type ManageListingToggleableColumnId =
  (typeof MANAGE_LISTING_TOGGLEABLE_COLUMN_IDS)[number];

export type ManageListingColumnVisibility = Record<
  ManageListingToggleableColumnId,
  boolean
>;

export const DEFAULT_MANAGE_LISTING_COLUMN_VISIBILITY: ManageListingColumnVisibility = {
  status: true,
  submittedBy: true,
  agentName: true,
  submission: true,
  reviewedOn: true,
};

export const MANAGE_LISTING_COLUMN_I18N_KEY: Record<
  ManageListingTableColumnId,
  | "property"
  | "status"
  | "submittedBy"
  | "agentName"
  | "submission"
  | "reviewedOn"
  | "actions"
> = {
  title: "property",
  status: "status",
  submittedBy: "submittedBy",
  agentName: "agentName",
  submission: "submission",
  reviewedOn: "reviewedOn",
  actions: "actions",
};

export function isManageListingAlwaysVisibleColumn(
  columnId: string,
): columnId is ManageListingAlwaysVisibleColumnId {
  return (MANAGE_LISTING_ALWAYS_VISIBLE_COLUMN_IDS as readonly string[]).includes(
    columnId,
  );
}

export function isManageListingTableColumnVisible(
  columnId: string,
  visibility: ManageListingColumnVisibility,
): boolean {
  if (isManageListingAlwaysVisibleColumn(columnId)) {
    return true;
  }

  if (!(MANAGE_LISTING_TOGGLEABLE_COLUMN_IDS as readonly string[]).includes(columnId)) {
    return false;
  }

  return visibility[columnId as ManageListingToggleableColumnId];
}
