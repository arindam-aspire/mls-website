import {
  mapSubmissionApiListingToPropertyListing,
  type ListTableView,
  type SubmissionApiListing,
} from "@abdoun/abdoun-library";
import type { ComponentProps } from "react";
import {
  buildRejectedListingRowActions,
  type MyListingRejectedRowActionLabels,
} from "../constants/myListingRowActions.constants";
import type { AgentPropertyListItem } from "../types/property.types";

export type MapAgentPropertyListItemsOptions = {
  rejectedRowActionLabels?: MyListingRejectedRowActionLabels;
};

type LibraryPropertyListing = ComponentProps<typeof ListTableView>["data"][number];

export type MyListingTableRow = LibraryPropertyListing & {
  reviewedDate: string;
  submission_review_reason?: string | null;
};

function isRejectedWorkflow(item: AgentPropertyListItem): boolean {
  const workflowKey = item.submission_workflow_label?.trim() || item.status_slug;
  return workflowKey === "rejected";
}

function toSubmissionApiListing(item: AgentPropertyListItem): SubmissionApiListing {
  return {
    ...item,
    submission_submitted_at: item.submission_submitted_at ?? "",
    agency: item.agency as SubmissionApiListing["agency"],
  };
}

export function mapAgentPropertyListItem(
  item: AgentPropertyListItem,
  options?: MapAgentPropertyListItemsOptions,
): MyListingTableRow {
  const listing = mapSubmissionApiListingToPropertyListing(toSubmissionApiListing(item));

  return {
    ...listing,
    validatedDate: item.submission_submitted_at ?? "",
    reviewedDate: item.submission_reviewed_at ?? "",
    submission_review_reason: item.submission_review_reason,
    actions:
      isRejectedWorkflow(item) && options?.rejectedRowActionLabels
        ? buildRejectedListingRowActions(item, options.rejectedRowActionLabels)
        : undefined,
  };
}

export function mapAgentPropertyListItems(
  items: AgentPropertyListItem[] | undefined,
  options?: MapAgentPropertyListItemsOptions,
): MyListingTableRow[] {
  if (!items?.length) {
    return [];
  }

  return items.map((item) => mapAgentPropertyListItem(item, options));
}
