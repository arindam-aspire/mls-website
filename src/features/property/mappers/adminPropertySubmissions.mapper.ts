import type { AdminPropertySubmissionListItem, AgentPropertyListItem } from "../types/property.types";
import {
  buildAdminListingRowActions,
  type AdminListingRowActionOptions,
  type AdminListingRowActionLabels,
} from "../constants/adminListingRowActions.constants";
import {
  mapAgentPropertyListItem,
  type MapAgentPropertyListItemsOptions,
  type MyListingTableRow,
} from "./agentPropertiesList.mapper";

export type MapAdminPropertySubmissionListItemsOptions = MapAgentPropertyListItemsOptions & {
  adminRowActionLabels?: AdminListingRowActionLabels;
  adminRowActionOptions?: AdminListingRowActionOptions;
};

export function mapAdminSubmissionToAgentPropertyListItem(
  item: AdminPropertySubmissionListItem,
): AgentPropertyListItem {
  return {
    property_id: item.property_id,
    property_hash: item.property_hash,
    title: item.property_title,
    listing_purpose: "",
    type_name: "",
    type_slug: "",
    category_name: "",
    category_slug: "",
    status_name: item.status_label?.trim() || item.status,
    status_slug: item.status,
    price: "",
    currency: "",
    reference_number: item.property_reference_number ?? "",
    created_at: item.submitted_at,
    updated_at: item.reviewed_at ?? item.submitted_at,
    submission_id: item.submission_id,
    submission_status: item.status,
    submission_submitted_at: item.submitted_at,
    submission_reviewed_at: item.reviewed_at,
    submission_review_reason: item.review_reason ?? null,
    submission_workflow_label: item.status,
    can_edit_submission: false,
    can_delete_submission: false,
    agency: null,
    submitted_by: item.submitted_by_name?.trim() || item.submitted_by?.trim() || null,
    agent_user_id: item.agent_user_id,
    agent_name: item.agent_name,
    agent_email: item.agent_email,
    agent_phone: item.agent_phone,
  };
}

export function mapAdminPropertySubmissionListItems(
  items: AdminPropertySubmissionListItem[] | undefined,
  options?: MapAdminPropertySubmissionListItemsOptions,
): MyListingTableRow[] {
  if (!items?.length) {
    return [];
  }

  return items.map((item) => {
    const row = mapAgentPropertyListItem(
      mapAdminSubmissionToAgentPropertyListItem(item),
      options,
    );

    if (!options?.adminRowActionLabels) {
      return row;
    }

    return {
      ...row,
      actions: buildAdminListingRowActions(
        item,
        options.adminRowActionLabels,
        options.adminRowActionOptions,
      ),
    };
  });
}
