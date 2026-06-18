import {
  buildAgentTableColumns,
  DEFAULT_AGENT_PINNED_COLUMNS,
  resolveAgentPinnedColumns,
  type Agent,
  type AgentWorkflowActionsConfig,
  type PinnedColumns,
  type TableColumn,
} from "@abdoun/abdoun-library";
import {
  resolveAgentListColumnVisibility,
  type AgentListColumnVisibility,
  type AgentListToggleableColumnId,
} from "../constants/agentListTableColumns.constants";

export type AgentListTableColumnLabels = {
  agent: string;
  contact: string;
  city: string;
  status: string;
  activityDate: string;
};

const TOGGLEABLE_LIBRARY_COLUMN_ID: Record<AgentListToggleableColumnId, string> = {
  contact: "contacts",
  city: "city",
  status: "status",
  activityDate: "activityDate",
};

const LIBRARY_COLUMN_LABEL_KEY: Record<string, keyof AgentListTableColumnLabels> = {
  name: "agent",
  contacts: "contact",
  city: "city",
  status: "status",
  activityDate: "activityDate",
};

type BuildAgentListTableColumnsParams = {
  labels: AgentListTableColumnLabels;
  columnVisibility: AgentListColumnVisibility;
  onNameClick?: (agent: Agent) => void;
  workflowActions?: AgentWorkflowActionsConfig;
};

export function buildAgentListTableColumns({
  labels,
  columnVisibility,
  onNameClick,
  workflowActions,
}: BuildAgentListTableColumnsParams): TableColumn<Agent>[] {
  const visibility = resolveAgentListColumnVisibility(columnVisibility);
  const hiddenToggleableIds = new Set(
    (Object.entries(TOGGLEABLE_LIBRARY_COLUMN_ID) as [AgentListToggleableColumnId, string][])
      .filter(([toggleId]) => !visibility[toggleId])
      .map(([, libraryId]) => libraryId),
  );

  return buildAgentTableColumns({ onClick: onNameClick, workflowActions })
    .filter((column) => !hiddenToggleableIds.has(column.id))
    .map((column) => {
      const labelKey = LIBRARY_COLUMN_LABEL_KEY[column.id];

      if (!labelKey) {
        return column;
      }

      return {
        ...column,
        header: labels[labelKey],
      };
    });
}

export function buildAgentListGridHiddenColumnIds(
  columnVisibility: AgentListColumnVisibility,
): string[] {
  const visibility = resolveAgentListColumnVisibility(columnVisibility);

  return (Object.entries(TOGGLEABLE_LIBRARY_COLUMN_ID) as [AgentListToggleableColumnId, string][])
    .filter(([toggleId]) => !visibility[toggleId])
    .map(([, libraryId]) => libraryId);
}

export function resolveAgentListPinnedColumns(
  columnIds: string[],
): PinnedColumns | undefined {
  return resolveAgentPinnedColumns(DEFAULT_AGENT_PINNED_COLUMNS, columnIds);
}
