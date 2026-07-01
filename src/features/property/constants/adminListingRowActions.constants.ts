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
};

export type AdminListingRowActionOptions = {
  canReviewSubmissions?: boolean;
  canManageAgentAssignment?: boolean;
  canDeactivateSubmissions?: boolean;
  canEditRejectedSubmissions?: boolean;
};

function normalizeSubmissionStatus(status: string): string {
  return status.trim().toLowerCase();
}

/** Per-row action menu for admin manage-listings (`GET /admin/property-submissions`). */
export function buildAdminListingRowActions(
  item: AdminPropertySubmissionListItem,
  labels: AdminListingRowActionLabels,
  options: AdminListingRowActionOptions = {},
): PropertyListingRowActionDescriptor[] {
  const status = normalizeSubmissionStatus(item.status);

  if (status === "active") {
    const actions: PropertyListingRowActionDescriptor[] = [{ id: "view" }];
    if (options.canManageAgentAssignment) {
      if (item.has_assigned_agent) {
        actions.unshift({ id: "reassign", label: labels.reassign });
        actions.splice(1, 0, { id: "unassign", label: labels.unassign, tone: "danger" });
      } else {
        actions.unshift({ id: "assign", label: labels.assignAgent });
      }
    }
    if (options.canDeactivateSubmissions) {
      actions.unshift({ id: "deactivate", label: labels.deactivate, tone: "danger" });
    }
    return actions;
  }

  if (status === "rejected") {
    const actions: PropertyListingRowActionDescriptor[] = [{ id: "view" }];
    if (options.canEditRejectedSubmissions) {
      actions.unshift({ id: "edit", label: labels.edit });
    }
    if (item.review_reason?.trim()) {
      actions.push({ id: "rejected_reason" });
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

  if (status === "pending-approval") {
    const actions: PropertyListingRowActionDescriptor[] = [{ id: "view" }];
    if (options.canReviewSubmissions) {
      actions.unshift({ id: "approve", label: labels.approve });
      actions.splice(1, 0, { id: "reject", label: labels.reject, tone: "danger" });
    }
    return actions;
  }

  return [{ id: "view" }];
}
