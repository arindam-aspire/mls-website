import type { PropertyListingRowActionDescriptor } from "@abdoun/abdoun-library";
import type { AdminPropertySubmissionListItem } from "../types/property.types";

export type AdminListingRowActionLabels = {
  assignAgent: string;
  approve: string;
  deactivate: string;
  reject: string;
  edit: string;
  reassign: string;
  unassign: string;
  delete: string;
};

export type AdminListingRowActionOptions = {
  canReviewSubmissions?: boolean;
  canReviewUnassignedAgencySubmissions?: boolean;
  canManageAgentAssignment?: boolean;
  canDeactivateSubmissions?: boolean;
  canEditRejectedSubmissions?: boolean;
};

function normalizeSubmissionStatus(status: string): string {
  const token = status.trim().toLowerCase().replace(/[_\s]+/g, "-");

  const aliases: Record<string, string> = {
    "agent-assigned": "agent-assigned",
    "pending-admin-approval": "pending-approval",
    "pending-approval": "pending-approval",
    "deal-closure-requested": "deal-closure-requested",
    "deal-closed": "deal-closed",
  };

  return aliases[token] ?? token;
}

/** True when the submission has no assigned agency (null, omitted, or empty payload). */
export function isAdminSubmissionAgencyUnassigned(
  agency: AdminPropertySubmissionListItem["agency"] | undefined,
): boolean {
  if (agency == null) {
    return true;
  }

  const agencyId = agency.agency_id;

  return agencyId == null || String(agencyId).trim() === "";
}

/** Per-row action menu for admin manage-listings (`GET /admin/property-submissions`). */
export function buildAdminListingRowActions(
  item: AdminPropertySubmissionListItem,
  labels: AdminListingRowActionLabels,
  options: AdminListingRowActionOptions = {},
): PropertyListingRowActionDescriptor[] {
  const status = normalizeSubmissionStatus(item.status);
  const canReviewSubmission =
    (options.canReviewSubmissions && item.has_assigned_agent) ||
    (options.canReviewUnassignedAgencySubmissions &&
      isAdminSubmissionAgencyUnassigned(item.agency));

  if (status === "active") {
    const actions: PropertyListingRowActionDescriptor[] = [{ id: "view" }];
    if (options.canDeactivateSubmissions) {
      actions.unshift({ id: "deactivate", label: labels.deactivate, tone: "danger" });
    }
    return actions;
  }

  if (status === "rejected") {
    const actions: PropertyListingRowActionDescriptor[] = [{ id: "view" }];
    if (item.review_reason?.trim()) {
      actions.push({ id: "rejected_reason" });
    }
    if (item.can_delete_submission) {
      actions.push({ id: "delete", label: labels.delete, tone: "danger" });
    }
    return actions;
  }

  if (
    status === "deal_closure_requested" ||
    status === "deal-closure-requested" ||
    status === "deal_closed" ||
    status === "deal-closed" ||
    status === "deactivated"
  ) {
    return [{ id: "view" }];
  }

  if (status === "submitted") {
    const actions: PropertyListingRowActionDescriptor[] = [{ id: "view" }];
    if (options.canManageAgentAssignment) {
      actions.unshift({ id: "assign", label: labels.assignAgent });
    }
    if (canReviewSubmission) {
      actions.unshift({ id: "approve", label: labels.approve });
      actions.splice(1, 0, { id: "reject", label: labels.reject, tone: "danger" });
    }
    return actions;
  }

  if (status === "agent-assigned") {
    const actions: PropertyListingRowActionDescriptor[] = [{ id: "view" }];
    if (
      options.canManageAgentAssignment &&
      item.has_assigned_agent
    ) {
      actions.unshift({ id: "reassign", label: labels.reassign });
      actions.splice(1, 0, { id: "unassign", label: labels.unassign, tone: "danger" });
    }
    if (canReviewSubmission) {
      actions.unshift({ id: "approve", label: labels.approve });
      actions.splice(1, 0, { id: "reject", label: labels.reject, tone: "danger" });
    }
    return actions;
  }

  if (status === "pending-approval") {
    const actions: PropertyListingRowActionDescriptor[] = [{ id: "view" }];
    if (options.canManageAgentAssignment && !item.has_assigned_agent) {
      actions.unshift({ id: "assign", label: labels.assignAgent });
    }
    if (canReviewSubmission) {
      actions.unshift({ id: "approve", label: labels.approve });
      actions.splice(1, 0, { id: "reject", label: labels.reject, tone: "danger" });
    }
    return actions;
  }

  return [{ id: "view" }];
}
