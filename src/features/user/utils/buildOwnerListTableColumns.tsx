"use client";

import {
  AgentRowActions,
  OwnerStatusBadge,
  DEFAULT_OWNER_PINNED_COLUMNS,
  resolveOwnerPinnedColumns,
  type AgentRowAction,
  type PinnedColumns,
  type TableColumn,
} from "@abdoun/abdoun-library";
import { Eye, Pencil, UserCheck, UserX } from "lucide-react";
import type { ReactNode } from "react";
import {
  resolveOwnerListColumnVisibility,
  type OwnerListColumnVisibility,
  type OwnerListToggleableColumnId,
} from "../constants/ownerListTableColumns.constants";
import type { OwnerListRow } from "../mappers/mapOwnerListItemToLibraryOwner";

export type OwnerListTableColumnLabels = {
  owner: string;
  phone: string;
  email: string;
  properties: string;
  leads: string;
  status: string;
  actions: string;
};

export type OwnerListWorkflowActionLabels = {
  view: string;
  edit: string;
  activate: string;
  deactivate: string;
  actionsAriaLabel: string;
};

export type OwnerListWorkflowHandlers = {
  onView?: (owner: OwnerListRow) => void;
  onEdit?: (owner: OwnerListRow) => void;
  onActivate?: (owner: OwnerListRow) => void;
  onDeactivate?: (owner: OwnerListRow) => void;
  onLinkedPropertiesClick?: (owner: OwnerListRow) => void;
  onLinkedLeadsClick?: (owner: OwnerListRow) => void;
};

const TOGGLEABLE_LIBRARY_COLUMN_ID: Record<OwnerListToggleableColumnId, string> = {
  phone: "phone",
  email: "email",
  properties: "propertyOwned",
  leads: "leadsLinked",
  status: "status",
};

type BuildOwnerListTableColumnsParams = {
  labels: OwnerListTableColumnLabels;
  actionLabels: OwnerListWorkflowActionLabels;
  columnVisibility: OwnerListColumnVisibility;
  handlers?: OwnerListWorkflowHandlers;
  emptyValue?: string;
};

function OwnerNameCell({
  owner,
  onClick,
}: {
  owner: OwnerListRow;
  onClick?: (owner: OwnerListRow) => void;
}) {
  const content = (
    <span className="block w-full min-w-0 truncate text-sm font-medium text-secondary">
      {owner.name}
    </span>
  );

  if (!onClick) {
    return content;
  }

  return (
    <button
      type="button"
      onClick={() => onClick(owner)}
      className="block w-full min-w-0 text-start underline-offset-2 hover:underline"
    >
      {content}
    </button>
  );
}

function CountLinkCell({
  count,
  onClick,
  ariaLabel,
}: {
  count: number;
  onClick?: () => void;
  ariaLabel: string;
}) {
  if (!onClick || count <= 0) {
    return (
      <span className="tabular-nums text-sm text-text">{count}</span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="rounded-lg px-1.5 py-0.5 text-sm font-semibold tabular-nums text-primary underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
    >
      {count}
    </button>
  );
}

function buildOwnerRowActions(
  owner: OwnerListRow,
  actionLabels: OwnerListWorkflowActionLabels,
  handlers: OwnerListWorkflowHandlers | undefined,
): AgentRowAction<OwnerListRow>[] {
  const actions: AgentRowAction<OwnerListRow>[] = [];

  if (handlers?.onView) {
    actions.push({
      id: "view",
      label: actionLabels.view,
      icon: <Eye className="size-4 shrink-0" aria-hidden />,
      onClick: handlers.onView,
    });
  }

  if (handlers?.onEdit) {
    actions.push({
      id: "edit",
      label: actionLabels.edit,
      icon: <Pencil className="size-4 shrink-0" aria-hidden />,
      onClick: handlers.onEdit,
    });
  }

  if (owner.status.key === "active" && handlers?.onDeactivate) {
    actions.push({
      id: "deactivate",
      label: actionLabels.deactivate,
      icon: <UserX className="size-4 shrink-0" aria-hidden />,
      onClick: handlers.onDeactivate,
    });
  }

  if (owner.status.key === "suspended" && handlers?.onActivate) {
    actions.push({
      id: "activate",
      label: actionLabels.activate,
      icon: <UserCheck className="size-4 shrink-0" aria-hidden />,
      onClick: handlers.onActivate,
    });
  }

  return actions;
}

export function buildOwnerListTableColumns({
  labels,
  actionLabels,
  columnVisibility,
  handlers,
  emptyValue = "—",
}: BuildOwnerListTableColumnsParams): TableColumn<OwnerListRow>[] {
  const visibility = resolveOwnerListColumnVisibility(columnVisibility);
  const formatOptional = (value: string | undefined): ReactNode =>
    value?.trim() ? value : emptyValue;

  const columns: TableColumn<OwnerListRow>[] = [
    {
      id: "name",
      header: labels.owner,
      align: "start",
      sortable: true,
      minWidth: 160,
      getSortValue: (row) => row.name,
      render: (row) => (
        <OwnerNameCell owner={row} onClick={handlers?.onView} />
      ),
    },
  ];

  if (visibility.phone) {
    columns.push({
      id: "phone",
      header: labels.phone,
      align: "start",
      sortable: true,
      minWidth: 140,
      getSortValue: (row) => row.phone ?? "",
      render: (row) => (
        <span className="block min-w-0 truncate text-sm text-text">
          {formatOptional(row.phone)}
        </span>
      ),
    });
  }

  if (visibility.email) {
    columns.push({
      id: "email",
      header: labels.email,
      align: "start",
      sortable: true,
      minWidth: 180,
      getSortValue: (row) => row.email ?? "",
      render: (row) => (
        <span className="block min-w-0 truncate text-sm text-text">
          {formatOptional(row.email)}
        </span>
      ),
    });
  }

  if (visibility.properties) {
    columns.push({
      id: "propertyOwned",
      header: labels.properties,
      align: "center",
      sortable: true,
      minWidth: 120,
      getSortValue: (row) => row.propertyOwned,
      render: (row) => (
        <div className="flex justify-center">
          <CountLinkCell
            count={row.propertyOwned}
            onClick={
              handlers?.onLinkedPropertiesClick
                ? () => handlers.onLinkedPropertiesClick?.(row)
                : undefined
            }
            ariaLabel={`${labels.properties}: ${row.propertyOwned}`}
          />
        </div>
      ),
    });
  }

  if (visibility.leads) {
    columns.push({
      id: "leadsLinked",
      header: labels.leads,
      align: "center",
      sortable: true,
      minWidth: 120,
      getSortValue: (row) => row.leadsLinked,
      render: (row) => (
        <div className="flex justify-center">
          <CountLinkCell
            count={row.leadsLinked}
            onClick={
              handlers?.onLinkedLeadsClick
                ? () => handlers.onLinkedLeadsClick?.(row)
                : undefined
            }
            ariaLabel={`${labels.leads}: ${row.leadsLinked}`}
          />
        </div>
      ),
    });
  }

  if (visibility.status) {
    columns.push({
      id: "status",
      header: labels.status,
      align: "center",
      sortable: true,
      width: 140,
      minWidth: 120,
      getSortValue: (row) => row.status.label,
      cellClassName: "whitespace-nowrap",
      render: (row) => (
        <div className="flex justify-center">
          <OwnerStatusBadge status={row.status} />
        </div>
      ),
    });
  }

  columns.push({
    id: "actions",
    header: labels.actions,
    align: "center",
    width: 48,
    minWidth: 48,
    maxWidth: 80,
    resizable: false,
    headerClassName: "w-12 overflow-visible p-0",
    cellClassName: "overflow-visible p-0",
    render: (row) => {
      const rowActions = buildOwnerRowActions(row, actionLabels, handlers);

      if (rowActions.length === 0) {
        return null;
      }

      return (
        <div className="flex justify-center">
          <AgentRowActions
            row={row}
            buttonSize="md"
            rowActions={rowActions}
            ariaLabel={`${actionLabels.actionsAriaLabel} ${row.name}`}
          />
        </div>
      );
    },
  });

  return columns;
}

export function buildOwnerListGridHiddenColumnIds(
  columnVisibility: OwnerListColumnVisibility,
): string[] {
  const visibility = resolveOwnerListColumnVisibility(columnVisibility);

  return (
    Object.entries(TOGGLEABLE_LIBRARY_COLUMN_ID) as [
      OwnerListToggleableColumnId,
      string,
    ][]
  )
    .filter(([toggleId]) => !visibility[toggleId])
    .map(([, libraryId]) => libraryId);
}

export function resolveOwnerListPinnedColumns(
  columnIds: string[],
): PinnedColumns | undefined {
  return resolveOwnerPinnedColumns(DEFAULT_OWNER_PINNED_COLUMNS, columnIds);
}
