export const OWNER_LIST_TABLE_COLUMN_IDS = [
  "owner",
  "contact",
  "properties",
  "joinedAt",
  "status",
  "actions",
] as const;

export type OwnerListTableColumnId =
  (typeof OWNER_LIST_TABLE_COLUMN_IDS)[number];

export const OWNER_LIST_ALWAYS_VISIBLE_COLUMN_IDS = ["owner", "actions"] as const;

export type OwnerListAlwaysVisibleColumnId =
  (typeof OWNER_LIST_ALWAYS_VISIBLE_COLUMN_IDS)[number];

export const OWNER_LIST_TOGGLEABLE_COLUMN_IDS = [
  "contact",
  "properties",
  "joinedAt",
  "status",
] as const;

export type OwnerListToggleableColumnId =
  (typeof OWNER_LIST_TOGGLEABLE_COLUMN_IDS)[number];

export type OwnerListColumnVisibility = Record<
  OwnerListToggleableColumnId,
  boolean
>;

export const DEFAULT_OWNER_LIST_COLUMN_VISIBILITY: OwnerListColumnVisibility = {
  contact: true,
  properties: true,
  joinedAt: true,
  status: true,
};

export function resolveOwnerListColumnVisibility(
  visibility: Partial<OwnerListColumnVisibility> | undefined,
): OwnerListColumnVisibility {
  return {
    ...DEFAULT_OWNER_LIST_COLUMN_VISIBILITY,
    ...visibility,
  };
}

export const OWNER_LIST_COLUMN_I18N_KEY: Record<
  OwnerListTableColumnId,
  "owner" | "contact" | "properties" | "joinedAt" | "status" | "actions"
> = {
  owner: "owner",
  contact: "contact",
  properties: "properties",
  joinedAt: "joinedAt",
  status: "status",
  actions: "actions",
};
