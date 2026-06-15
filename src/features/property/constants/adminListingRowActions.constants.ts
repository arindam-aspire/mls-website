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
): PropertyListingRowActionDescriptor[] {
  const status = normalizeSubmissionStatus(item.status);

  if (status === "approved" || status === "rejected") {
    return [{ id: "view" }];
  }

  if (status === "submitted") {
    if (!item.has_assigned_agent) {
      return [
        { id: "assign", label: labels.assignAgent },
        { id: "reject", label: labels.reject, tone: "danger" },
        { id: "view" },
      ];
    }

    return [
      { id: "approve", label: labels.approve },
      { id: "reassign", label: labels.reassign },
      { id: "reject", label: labels.reject, tone: "danger" },
      { id: "unassign", label: labels.unassign },
      { id: "view" },
    ];
  }

  return [{ id: "view" }];
}
