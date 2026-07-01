import type { PropertyListingRowActionDescriptor } from "@abdoun/abdoun-library";
import type { AgentPropertyListItem } from "../types/property.types";

export type MyListingRejectedRowActionLabels = {
  edit: string;
  delete: string;
};

/** Per-row action menu for `submission_workflow_label === "rejected"`. */
export function buildRejectedListingRowActions(
  item: AgentPropertyListItem,
  labels: MyListingRejectedRowActionLabels,
) {
  const hasRejectedReason = Boolean(item.submission_review_reason?.trim());

  return [
    { id: "view" },
    { id: "edit", label: labels.edit, hidden: !item.can_edit_submission },
    { id: "rejected_reason", hidden: !hasRejectedReason },
    {
      id: "delete",
      label: labels.delete,
      tone: "danger" as const,
      hidden: !item.can_delete_submission,
    },
  ];
}

export function buildAgentListingRowActions(
  item: AgentPropertyListItem,
  labels: MyListingRejectedRowActionLabels,
) {
  const actions: PropertyListingRowActionDescriptor[] = [{ id: "view" }];

  if (item.can_edit_submission) {
    actions.push({ id: "edit", label: labels.edit });
  }

  if (item.submission_review_reason?.trim()) {
    actions.push({ id: "rejected_reason" });
  }

  if (item.can_delete_submission) {
    actions.push({
      id: "delete",
      label: labels.delete,
      tone: "danger" as const,
    });
  }

  return actions;
}
