import {
  propertyFormSteps,
  type DraftListItemData,
} from "@abdoun/abdoun-library";
import type { AgentPropertyDraftListItem } from "../types/property.types";

export type MapAgentPropertyDraftLabels = {
  formatUpdatedAt: (isoDate: string) => string;
};

export function mapAgentPropertyDraftListItem(
  item: AgentPropertyDraftListItem,
  labels: MapAgentPropertyDraftLabels,
): DraftListItemData {
  return {
    id: item.submission_id,
    title: item.title ?? "",
    updatedAtLabel: labels.formatUpdatedAt(item.updated_at),
    thumbnailUrl: null,
    propertyType: "",
    listingPurposeLabel: "",
    currentStep: item.current_step,
    totalSteps: propertyFormSteps.length,
  };
}

export function mapAgentPropertyDraftListItems(
  items: AgentPropertyDraftListItem[] | undefined,
  labels: MapAgentPropertyDraftLabels,
): DraftListItemData[] {
  if (!items?.length) {
    return [];
  }

  return items.map((item) => mapAgentPropertyDraftListItem(item, labels));
}
