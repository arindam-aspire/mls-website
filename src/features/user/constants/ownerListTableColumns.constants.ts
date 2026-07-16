export const OWNER_LIST_TABLE_COLUMN_IDS = [
  "owner",
  "phone",
  "email",
  "properties",
  "leads",
  "status",
  "actions",
] as const;

export type OwnerListTableColumnId =
  (typeof OWNER_LIST_TABLE_COLUMN_IDS)[number];

export const OWNER_LIST_ALWAYS_VISIBLE_COLUMN_IDS = ["owner", "actions"] as const;

export type OwnerListAlwaysVisibleColumnId =
  (typeof OWNER_LIST_ALWAYS_VISIBLE_COLUMN_IDS)[number];

export const OWNER_LIST_TOGGLEABLE_COLUMN_IDS = [
  "phone",
  "email",
  "properties",
  "leads",
  "status",
] as const;

export type OwnerListToggleableColumnId =
  (typeof OWNER_LIST_TOGGLEABLE_COLUMN_IDS)[number];

export type OwnerListColumnVisibility = Record<
  OwnerListToggleableColumnId,
  boolean
>;

export const DEFAULT_OWNER_LIST_COLUMN_VISIBILITY: OwnerListColumnVisibility = {
  phone: true,
  email: true,
  properties: true,
  leads: true,
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
  | "owner"
  | "phone"
  | "email"
  | "properties"
  | "leads"
  | "status"
  | "actions"
> = {
  owner: "owner",
  phone: "phone",
  email: "email",
  properties: "properties",
  leads: "leads",
  status: "status",
  actions: "actions",
};
