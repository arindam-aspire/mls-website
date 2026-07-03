import type { ComponentProps } from "react";
import { DraftListCard, propertyFormSteps } from "@abdoun/abdoun-library";
import type { AgentPropertyDraftListItem } from "../types/property.types";

type LibraryDraftListItem = ComponentProps<typeof DraftListCard>["item"];

export type MappedDraftListItem = LibraryDraftListItem & {
  canEdit: boolean;
  canDelete: boolean;
};

export type MapAgentPropertyDraftLabels = {
  formatUpdatedAt: (isoDate: string) => string;
};

export function mapAgentPropertyDraftListItem(
  item: AgentPropertyDraftListItem,
  labels: MapAgentPropertyDraftLabels,
): MappedDraftListItem {
  return {
    id: item.submission_id,
    title: item.title ?? "",
    updatedAtLabel: labels.formatUpdatedAt(item.updated_at),
    thumbnailUrl: null,
    propertyType: "",
    listingPurposeLabel: "",
    currentStep: item.current_step,
    totalSteps: propertyFormSteps.length,
    canEdit: item.can_edit,
    canDelete: item.can_delete,
  };
}

export function mapAgentPropertyDraftListItems(
  items: AgentPropertyDraftListItem[] | undefined,
  labels: MapAgentPropertyDraftLabels,
): MappedDraftListItem[] {
  if (!items?.length) {
    return [];
  }

  return items.map((item) => mapAgentPropertyDraftListItem(item, labels));
}
