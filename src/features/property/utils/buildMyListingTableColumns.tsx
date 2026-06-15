import type { AppLocale } from "@/src/i18n/routing";
import { formatListingSubmittedDate } from "@/src/features/property/utils/formatListingSubmittedDate";
import { cn } from "@/src/lib/cn";
import {
  buildPropertyTableColumns,
  ListingStatusBadge,
  type ListTableView,
  type PropertyTableWorkflowActionsConfig,
  type TableColumn,
} from "@abdoun/abdoun-library";
import type { ComponentProps } from "react";
import type { MyListingTableRow } from "@/src/features/property/mappers/agentPropertiesList.mapper";
import {
  createMyListingRowActionsResolver,
  type MyListingRowActionOptions,
} from "./createMyListingRowActionsResolver";

type LibraryPropertyListing = ComponentProps<typeof ListTableView>["data"][number];
type LibraryTitleLocale = keyof LibraryPropertyListing["title"];

type MyListingTableColumnLabels = {
  propertyName: string;
  reference: string;
  status: string;
  submittedOn: string;
  submittedOnEmpty: string;
  reviewedOn: string;
  reviewedOnEmpty: string;
};

function resolveReviewedDate(row: LibraryPropertyListing): string {
  return (row as MyListingTableRow).reviewedDate;
}

type BuildMyListingTableColumnsParams = {
  labels: MyListingTableColumnLabels;
  tableLocale: LibraryTitleLocale;
  appLocale: AppLocale;
  onClick?: (listing: LibraryPropertyListing) => void;
  workflowActions: PropertyTableWorkflowActionsConfig;
  listingRowActionOptions?: MyListingRowActionOptions;
};

function resolveListingTitle(
  listing: LibraryPropertyListing,
  locale: LibraryTitleLocale,
): string {
  return listing.title[locale] || listing.title.en;
}

export function buildMyListingTableColumns({
  labels,
  tableLocale,
  appLocale,
  onClick,
  workflowActions,
  listingRowActionOptions,
}: BuildMyListingTableColumnsParams): TableColumn<LibraryPropertyListing>[] {
  const rowActions = createMyListingRowActionsResolver({
    workflowActions,
    listingRowActionOptions,
  });

  const defaultColumns = buildPropertyTableColumns({
    locale: tableLocale,
    onClick,
    rowActions,
  });

  const actionsColumn = defaultColumns.find((column) => column.id === "actions");

  const columns: TableColumn<LibraryPropertyListing>[] = [
    {
      id: "title",
      header: labels.propertyName,
      align: "start",
      sortable: true,
      getSortValue: (row) => resolveListingTitle(row, tableLocale),
      render: (row) =>
        onClick ? (
          <button
            type="button"
            onClick={() => onClick(row)}
            className={cn(
              "block w-full min-w-0 truncate text-start text-sm font-medium text-secondary underline-offset-2 hover:underline",
            )}
          >
            {resolveListingTitle(row, tableLocale)}
          </button>
        ) : (
          <span className="block w-full min-w-0 truncate text-start text-sm">
            {resolveListingTitle(row, tableLocale)}
          </span>
        ),
    },
    {
      id: "reference",
      header: labels.reference,
      align: "start",
      render: (row) => (
        <span className="font-medium text-secondary">
          {row.reference_number ?? row.property_id}
        </span>
      ),
    },
    {
      id: "status",
      header: labels.status,
      align: "center",
      width: 140,
      minWidth: 120,
      cellClassName: "whitespace-nowrap",
      render: (row) => (
        <div className="flex justify-center">
          <ListingStatusBadge status={row.status} />
        </div>
      ),
    },
    {
      id: "submittedOn",
      header: labels.submittedOn,
      align: "start",
      sortable: true,
      cellClassName: "whitespace-nowrap text-text/80",
      getSortValue: (row) => {
        if (!row.validatedDate) {
          return null;
        }

        const timestamp = new Date(row.validatedDate).getTime();

        return Number.isNaN(timestamp) ? null : timestamp;
      },
      render: (row) => {
        const formatted = formatListingSubmittedDate(row.validatedDate, appLocale);

        return (
          <span className="block w-full min-w-0 truncate">
            {formatted ?? labels.submittedOnEmpty}
          </span>
        );
      },
    },
    {
      id: "reviewedOn",
      header: labels.reviewedOn,
      align: "start",
      sortable: true,
      cellClassName: "whitespace-nowrap text-text/80",
      getSortValue: (row) => {
        const reviewedDate = resolveReviewedDate(row);

        if (!reviewedDate) {
          return null;
        }

        const timestamp = new Date(reviewedDate).getTime();

        return Number.isNaN(timestamp) ? null : timestamp;
      },
      render: (row) => {
        const formatted = formatListingSubmittedDate(
          resolveReviewedDate(row),
          appLocale,
        );

        return (
          <span className="block w-full min-w-0 truncate">
            {formatted ?? labels.reviewedOnEmpty}
          </span>
        );
      },
    },
  ];

  if (actionsColumn) {
    columns.push(actionsColumn);
  }

  return columns;
}
