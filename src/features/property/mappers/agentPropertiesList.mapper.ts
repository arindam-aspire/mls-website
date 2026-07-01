import {
  mapSubmissionApiListingToPropertyListing,
  type ListTableView,
  type SubmissionApiListing,
} from "@abdoun/abdoun-library";
import type { ComponentProps } from "react";
import {
  buildRejectedListingRowActions,
  buildAgentListingRowActions,
  type MyListingRejectedRowActionLabels,
} from "../constants/myListingRowActions.constants";
import type { AgentPropertyListItem } from "../types/property.types";

export type MapAgentPropertyListItemsOptions = {
  rejectedRowActionLabels?: MyListingRejectedRowActionLabels;
};

type LibraryPropertyListing = ComponentProps<typeof ListTableView>["data"][number];
type LibraryAssignedAgent = LibraryPropertyListing["agent"];

export type MyListingTableRow = LibraryPropertyListing & {
  reviewedDate: string;
  submission_review_reason?: string | null;
};

function normalizeSubmissionStatusKey(value: string | null | undefined): string {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) {
    return "";
  }

  const token = normalized.replace(/[_\s]+/g, "-");
  const aliases: Record<string, string> = {
    active: "active",
    approved: "approved",
    draft: "draft",
    rejected: "rejected",
    submitted: "submitted",
    "pending-approval": "pending-approval",
    "pending-admin-approval": "pending_admin_approval",
    "changes-requested": "changes_requested",
    "in-progress": "in_progress",
    verified: "verified",
  };

  return aliases[token] ?? normalized;
}

function resolveAgentListingDisplayStatusKey(item: AgentPropertyListItem): string {
  const submissionStatus = normalizeSubmissionStatusKey(item.submission_status);

  if (submissionStatus === "active" || submissionStatus === "rejected") {
    return submissionStatus;
  }

  return (
    normalizeSubmissionStatusKey(item.submission_workflow_label) ||
    normalizeSubmissionStatusKey(item.status_slug) ||
    submissionStatus ||
    ""
  );
}

function isRejectedWorkflow(item: AgentPropertyListItem): boolean {
  return resolveAgentListingDisplayStatusKey(item) === "rejected";
}

function resolveAssignedAgent(item: AgentPropertyListItem): LibraryAssignedAgent {
  const agentName = item.agent_name?.trim();
  const agentEmail = item.agent_email?.trim();
  const agentPhone = item.agent_phone?.trim();

  if (!agentName && !agentEmail && !agentPhone) {
    return undefined;
  }

  return {
    id: 0,
    name: agentName || agentEmail || "Assigned agent",
    phone: agentPhone || null,
    whatsapp: agentPhone || null,
    email: agentEmail || null,
    photo: null,
    license_number: null,
  };
}

function toSubmissionApiListing(item: AgentPropertyListItem): SubmissionApiListing {
  return {
    property_id: item.property_id,
    property_hash: item.property_hash,
    title: item.title,
    listing_purpose: item.listing_purpose,
    type_name: item.type_name,
    type_slug: item.type_slug,
    category_name: item.category_name,
    category_slug: item.category_slug,
    status_name: item.status_name,
    status_slug: item.status_slug,
    price: item.price,
    currency: item.currency,
    reference_number: item.reference_number,
    created_at: item.created_at,
    updated_at: item.updated_at,
    submission_id: item.submission_id,
    submission_status: item.submission_status,
    submitted_on: item.submission_submitted_at,
    submission_submitted_by: item.submitted_by,
    submission_reviewed_at: item.submission_reviewed_at,
    submission_review_reason: item.submission_review_reason,
    submission_workflow_label: item.submission_workflow_label,
    can_edit_submission: item.can_edit_submission,
    can_delete_submission: item.can_delete_submission,
    agency: item.agency as SubmissionApiListing["agency"],
  };
}

export function mapAgentPropertyListItem(
  item: AgentPropertyListItem,
  options?: MapAgentPropertyListItemsOptions,
): MyListingTableRow {
  const listing = mapSubmissionApiListingToPropertyListing(toSubmissionApiListing(item));
  const statusKey = resolveAgentListingDisplayStatusKey(item);

  return {
    ...listing,
    agent: resolveAssignedAgent(item) ?? listing.agent,
    status: {
      ...listing.status,
      key: statusKey as typeof listing.status.key,
    },
    validatedDate: item.submission_submitted_at ?? "",
    reviewedDate: item.submission_reviewed_at ?? "",
    submission_review_reason: item.submission_review_reason,
    actions:
      options?.rejectedRowActionLabels
        ? isRejectedWorkflow(item)
          ? buildRejectedListingRowActions(item, options.rejectedRowActionLabels)
          : buildAgentListingRowActions(item, options.rejectedRowActionLabels)
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
