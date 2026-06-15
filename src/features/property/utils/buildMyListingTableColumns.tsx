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
  property: string;
  status: string;
  submission: string;
  submittedByEmpty: string;
  submittedOnEmpty: string;
  reviewedOn: string;
  reviewedOnEmpty: string;
};

function resolveReviewedDate(row: LibraryPropertyListing): string {
  return (row as MyListingTableRow).reviewedDate;
}

function resolveSubmittedBy(row: LibraryPropertyListing): string {
  const submittedBy = row.submission_submitted_by?.trim();

  if (submittedBy) {
    return submittedBy;
  }

  const agencyName = row.agency?.agency_name?.trim();

  if (agencyName) {
    return agencyName;
  }

  return row.brokerName?.trim() ?? "";
}

function resolveSubmittedOnDate(row: LibraryPropertyListing): string {
  const validatedDate = (row as MyListingTableRow).validatedDate?.trim();

  if (validatedDate) {
    return validatedDate;
  }

  return row.submitted_on?.trim() ?? "";
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

function resolveListingReference(listing: LibraryPropertyListing): string {
  return listing.reference_number?.trim() || listing.property_id;
}

function renderSubmissionCell(
  row: LibraryPropertyListing,
  labels: Pick<MyListingTableColumnLabels, "submittedByEmpty" | "submittedOnEmpty">,
  appLocale: AppLocale,
) {
  const submittedBy = resolveSubmittedBy(row);
  const formattedDate = formatListingSubmittedDate(
    resolveSubmittedOnDate(row),
    appLocale,
  );

  return (
    <div className="min-w-0">
      <span className="block w-full min-w-0 truncate text-sm font-medium text-text">
        {submittedBy || labels.submittedByEmpty}
      </span>
      <span className="mt-0.5 block w-full min-w-0 truncate text-xs text-muted">
        {formattedDate ?? labels.submittedOnEmpty}
      </span>
    </div>
  );
}
function renderPropertyCell(
  row: LibraryPropertyListing,
  tableLocale: LibraryTitleLocale,
  onClick?: (listing: LibraryPropertyListing) => void,
) {
  const title = resolveListingTitle(row, tableLocale);
  const reference = resolveListingReference(row);

  return (
    <div className="min-w-0">
      {onClick ? (
        <button
          type="button"
          onClick={() => onClick(row)}
          className={cn(
            "block w-full min-w-0 truncate text-start text-sm font-medium text-secondary underline-offset-2 hover:underline",
          )}
        >
          {title}
        </button>
      ) : (
        <span className="block w-full min-w-0 truncate text-start text-sm font-medium text-text">
          {title}
        </span>
      )}
      <span className="mt-0.5 block w-full min-w-0 truncate text-xs text-muted">
        {reference}
      </span>
    </div>
  );
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

  const columns: TableColumn<LibraryPropertyListing>[] = [];

  columns.push({
    id: "title",
    header: labels.property,
    align: "start",
    sortable: true,
    getSortValue: (row) =>
      `${resolveListingTitle(row, tableLocale)} ${resolveListingReference(row)}`,
    render: (row) => renderPropertyCell(row, tableLocale, onClick),
  });

  columns.push(
    {
      id: "status",
      header: labels.status,
      align: "center",
      width: 200,
      minWidth: 168,
      cellClassName: "whitespace-nowrap",
      render: (row) => (
        <div className="flex justify-center">
          <ListingStatusBadge status={row.status} />
        </div>
      ),
    },
    {
      id: "submission",
      header: labels.submission,
      align: "start",
      sortable: true,
      minWidth: 168,
      getSortValue: (row) => {
        const submittedOnDate = resolveSubmittedOnDate(row);

        if (!submittedOnDate) {
          return null;
        }

        const timestamp = new Date(submittedOnDate).getTime();

        return Number.isNaN(timestamp) ? null : timestamp;
      },
      render: (row) =>
        renderSubmissionCell(
          row,
          {
            submittedByEmpty: labels.submittedByEmpty,
            submittedOnEmpty: labels.submittedOnEmpty,
          },
          appLocale,
        ),
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
  );

  if (actionsColumn) {
    columns.push(actionsColumn);
  }

  return columns;
}
