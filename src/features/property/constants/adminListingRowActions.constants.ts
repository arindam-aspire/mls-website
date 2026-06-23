import type { PropertyListingRowActionDescriptor } from "@abdoun/abdoun-library";
import type { AdminPropertySubmissionListItem } from "../types/property.types";

export type AdminListingRowActionLabels = {
  assignAgent: string;
  approve: string;
  reject: string;
  reassign: string;
  unassign: string;
};

function normalizeSubmissionStatus(status: string): string {
  return status.trim().toLowerCase();
}

/** Per-row action menu for admin manage-listings (`GET /admin/property-submissions`). */
export function buildAdminListingRowActions(
  item: AdminPropertySubmissionListItem,
  labels: AdminListingRowActionLabels,
  canReviewSubmissions = false,
): PropertyListingRowActionDescriptor[] {
  const status = normalizeSubmissionStatus(item.status);

  if (status === "approved" || status === "rejected") {
    return [{ id: "view" }];
  }

  if (status === "submitted") {
    if (!item.has_assigned_agent) {
      const actions: PropertyListingRowActionDescriptor[] = [
        { id: "assign", label: labels.assignAgent },
        { id: "view" },
      ];
      if (canReviewSubmissions) {
        actions.splice(1, 0, { id: "reject", label: labels.reject, tone: "danger" });
      }
      return actions;
    }

    const actions: PropertyListingRowActionDescriptor[] = [
      { id: "reassign", label: labels.reassign },
      { id: "unassign", label: labels.unassign },
      { id: "view" },
    ];
    if (canReviewSubmissions) {
      actions.unshift({ id: "approve", label: labels.approve });
      actions.splice(2, 0, { id: "reject", label: labels.reject, tone: "danger" });
    }
    return actions;
  }

  return [{ id: "view" }];
}
