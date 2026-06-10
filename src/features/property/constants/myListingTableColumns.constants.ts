export const MY_LISTING_TABLE_COLUMN_IDS = [
  "title",
  "reference",
  "status",
  "submittedOn",
  "actions",
] as const;

export type MyListingTableColumnId = (typeof MY_LISTING_TABLE_COLUMN_IDS)[number];

/** Always shown in the table; excluded from the toggle-columns popover. */
export const MY_LISTING_ALWAYS_VISIBLE_COLUMN_IDS = ["title", "actions"] as const;

export type MyListingAlwaysVisibleColumnId =
  (typeof MY_LISTING_ALWAYS_VISIBLE_COLUMN_IDS)[number];

/** Shown in the toggle-columns popover. */
export const MY_LISTING_TOGGLEABLE_COLUMN_IDS = [
  "reference",
  "status",
  "submittedOn",
] as const;

export type MyListingToggleableColumnId =
  (typeof MY_LISTING_TOGGLEABLE_COLUMN_IDS)[number];

export type MyListingColumnVisibility = Record<MyListingToggleableColumnId, boolean>;

export const DEFAULT_MY_LISTING_COLUMN_VISIBILITY: MyListingColumnVisibility = {
  reference: true,
  status: true,
  submittedOn: true,
};

export const MY_LISTING_COLUMN_I18N_KEY: Record<
  MyListingTableColumnId,
  "propertyName" | "reference" | "status" | "submittedOn" | "actions"
> = {
  title: "propertyName",
  reference: "reference",
  status: "status",
  submittedOn: "submittedOn",
  actions: "actions",
};

export function isMyListingAlwaysVisibleColumn(
  columnId: string,
): columnId is MyListingAlwaysVisibleColumnId {
  return (MY_LISTING_ALWAYS_VISIBLE_COLUMN_IDS as readonly string[]).includes(columnId);
}

export function isMyListingTableColumnVisible(
  columnId: string,
  visibility: MyListingColumnVisibility,
): boolean {
  if (isMyListingAlwaysVisibleColumn(columnId)) {
    return true;
  }

  if (!(MY_LISTING_TOGGLEABLE_COLUMN_IDS as readonly string[]).includes(columnId)) {
    return false;
  }

  return visibility[columnId as MyListingToggleableColumnId];
}
