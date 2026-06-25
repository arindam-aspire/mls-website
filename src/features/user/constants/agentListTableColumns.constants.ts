export const AGENT_LIST_TABLE_COLUMN_IDS = [
  "agent",
  "contact",
  "city",
  "status",
  "activityDate",
  "actions",
] as const;

export type AgentListTableColumnId =
  (typeof AGENT_LIST_TABLE_COLUMN_IDS)[number];

export const AGENT_LIST_ALWAYS_VISIBLE_COLUMN_IDS = ["agent", "actions"] as const;

export type AgentListAlwaysVisibleColumnId =
  (typeof AGENT_LIST_ALWAYS_VISIBLE_COLUMN_IDS)[number];

export const AGENT_LIST_TOGGLEABLE_COLUMN_IDS = [
  "contact",
  "city",
  "status",
  "activityDate",
] as const;

export type AgentListToggleableColumnId =
  (typeof AGENT_LIST_TOGGLEABLE_COLUMN_IDS)[number];

export type AgentListColumnVisibility = Record<
  AgentListToggleableColumnId,
  boolean
>;

export const DEFAULT_AGENT_LIST_COLUMN_VISIBILITY: AgentListColumnVisibility = {
  contact: true,
  city: true,
  status: true,
  activityDate: true,
};

export function resolveAgentListColumnVisibility(
  visibility: Partial<AgentListColumnVisibility> | undefined,
): AgentListColumnVisibility {
  return {
    ...DEFAULT_AGENT_LIST_COLUMN_VISIBILITY,
    ...visibility,
  };
}

export const AGENT_LIST_COLUMN_I18N_KEY: Record<
  AgentListTableColumnId,
  "agent" | "contact" | "city" | "status" | "activityDate" | "actions"
> = {
  agent: "agent",
  contact: "contact",
  city: "city",
  status: "status",
  activityDate: "activityDate",
  actions: "actions",
};
