import {
  buildOwnerTableColumns,
  DEFAULT_OWNER_PINNED_COLUMNS,
  resolveOwnerPinnedColumns,
  type Owner,
  type OwnerWorkflowActionsConfig,
  type PinnedColumns,
  type TableColumn,
} from "@abdoun/abdoun-library";
import {
  resolveOwnerListColumnVisibility,
  type OwnerListColumnVisibility,
  type OwnerListToggleableColumnId,
} from "../constants/ownerListTableColumns.constants";

export type OwnerListTableColumnLabels = {
  owner: string;
  contact: string;
  properties: string;
  joinedAt: string;
  status: string;
};

const TOGGLEABLE_LIBRARY_COLUMN_ID: Record<OwnerListToggleableColumnId, string> = {
  contact: "contacts",
  properties: "propertyOwned",
  joinedAt: "joinedAt",
  status: "status",
};

const LIBRARY_COLUMN_LABEL_KEY: Record<string, keyof OwnerListTableColumnLabels> = {
  name: "owner",
  contacts: "contact",
  propertyOwned: "properties",
  joinedAt: "joinedAt",
  status: "status",
};

type BuildOwnerListTableColumnsParams = {
  labels: OwnerListTableColumnLabels;
  columnVisibility: OwnerListColumnVisibility;
  onNameClick?: (owner: Owner) => void;
  workflowActions?: OwnerWorkflowActionsConfig;
};

export function buildOwnerListTableColumns({
  labels,
  columnVisibility,
  onNameClick,
  workflowActions,
}: BuildOwnerListTableColumnsParams): TableColumn<Owner>[] {
  const visibility = resolveOwnerListColumnVisibility(columnVisibility);
  const hiddenToggleableIds = new Set(
    (Object.entries(TOGGLEABLE_LIBRARY_COLUMN_ID) as [OwnerListToggleableColumnId, string][])
      .filter(([toggleId]) => !visibility[toggleId])
      .map(([, libraryId]) => libraryId),
  );

  return buildOwnerTableColumns({ onClick: onNameClick, workflowActions })
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

export function buildOwnerListGridHiddenColumnIds(
  columnVisibility: OwnerListColumnVisibility,
): string[] {
  const visibility = resolveOwnerListColumnVisibility(columnVisibility);

  return (Object.entries(TOGGLEABLE_LIBRARY_COLUMN_ID) as [OwnerListToggleableColumnId, string][])
    .filter(([toggleId]) => !visibility[toggleId])
    .map(([, libraryId]) => libraryId);
}

export function resolveOwnerListPinnedColumns(
  columnIds: string[],
): PinnedColumns | undefined {
  return resolveOwnerPinnedColumns(DEFAULT_OWNER_PINNED_COLUMNS, columnIds);
}
