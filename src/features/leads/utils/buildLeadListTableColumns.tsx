import type { TableColumn } from "@abdoun/abdoun-library";
import { Button } from "@/src/components/ui";
import { LeadStatusBadge } from "../components/LeadStatusBadge";
import type { LeadListRow } from "../types/leadList.types";

export type LeadListTableColumnLabels = {
  leadNo: string;
  property: string;
  customer: string;
  status: string;
  assignedAgent: string;
  createdDate: string;
  actions: string;
};

type BuildLeadListTableColumnsParams = {
  labels: LeadListTableColumnLabels;
  viewDetailsLabel: string;
  statusLabel: (status: string) => string;
  onOpenLead: (leadId: string) => void;
};

export function buildLeadListTableColumns({
  labels,
  viewDetailsLabel,
  statusLabel,
  onOpenLead,
}: BuildLeadListTableColumnsParams): TableColumn<LeadListRow>[] {
  return [
    {
      id: "leadNumber",
      header: labels.leadNo,
      sortable: true,
      getSortValue: (row) => row.leadNumber,
      cellClassName: "font-medium",
      render: (row) => row.leadNumber,
    },
    {
      id: "propertyTitle",
      header: labels.property,
      sortable: true,
      getSortValue: (row) => row.propertyTitle,
      cellClassName: "max-w-[12rem] truncate",
      render: (row) => row.propertyTitle,
    },
    {
      id: "customerName",
      header: labels.customer,
      sortable: true,
      getSortValue: (row) => row.customerName,
      cellClassName: "max-w-[10rem] truncate",
      render: (row) => row.customerName,
    },
    {
      id: "status",
      header: labels.status,
      sortable: true,
      getSortValue: (row) => row.status,
      render: (row) => (
        <LeadStatusBadge
          status={row.status}
          label={statusLabel(row.status)}
        />
      ),
    },
    {
      id: "assignedAgent",
      header: labels.assignedAgent,
      sortable: true,
      getSortValue: (row) => row.assignedAgent,
      cellClassName: "max-w-[10rem] truncate",
      render: (row) => row.assignedAgent,
    },
    {
      id: "createdAt",
      header: labels.createdDate,
      sortable: true,
      getSortValue: (row) => row.createdAtSortValue,
      cellClassName: "whitespace-nowrap",
      render: (row) => row.createdAtLabel,
    },
    {
      id: "actions",
      header: labels.actions,
      sortable: false,
      render: (row) => (
        <Button
          type="button"
          variant="outline"
          color="secondary"
          size="sm"
          className="min-h-11"
          onClick={(event) => {
            event.stopPropagation();
            onOpenLead(row.id);
          }}
        >
          {viewDetailsLabel}
        </Button>
      ),
    },
  ];
}

export const DEFAULT_LEAD_LIST_PINNED_COLUMNS = {
  left: ["leadNumber"],
  right: ["actions"],
} as const;

export const LEAD_LIST_GRID_HIDDEN_COLUMN_IDS = ["actions", "leadNumber"];
