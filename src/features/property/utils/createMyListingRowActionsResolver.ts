import {
  buildRowActionsFromListingDescriptors,
  buildStatusBasedRowActions,
  type ListTableView,
  type PropertyTableRowAction,
  type PropertyTableWorkflowActionsConfig,
} from "@abdoun/abdoun-library";
import type { ComponentProps } from "react";
import { withMyListingRowActionIcons } from "./myListingRowActionIcons";

type LibraryPropertyListing = ComponentProps<typeof ListTableView>["data"][number];

export type MyListingRowActionOptions = {
  onRowAction?: (actionId: string, listing: LibraryPropertyListing) => void;
  canViewDelete?: boolean;
  onClickDelete?: (listing: LibraryPropertyListing) => void;
};

type CreateMyListingRowActionsResolverParams = {
  workflowActions: PropertyTableWorkflowActionsConfig;
  listingRowActionOptions?: MyListingRowActionOptions;
};

function bindDeleteConfirmation(
  actions: PropertyTableRowAction[],
  onRequestDelete?: (listing: LibraryPropertyListing) => void,
): PropertyTableRowAction[] {
  if (!onRequestDelete) {
    return actions;
  }

  return actions.map((action) => {
    if (action.id !== "delete") {
      return action;
    }

    return {
      ...action,
      onClick: (row) => {
        onRequestDelete(row);
      },
    };
  });
}

export function createMyListingRowActionsResolver({
  workflowActions,
  listingRowActionOptions,
}: CreateMyListingRowActionsResolverParams): (
  listing: LibraryPropertyListing,
) => PropertyTableRowAction[] {
  const onRequestDelete = listingRowActionOptions?.onClickDelete;

  return (listing) => {
    let actions: PropertyTableRowAction[];

    if (listing.actions != null) {
      actions = buildRowActionsFromListingDescriptors(listing, {
        actionHandlers: workflowActions,
        ...listingRowActionOptions,
      });
    } else {
      actions = buildStatusBasedRowActions(listing, workflowActions);
    }

    return bindDeleteConfirmation(
      withMyListingRowActionIcons(actions),
      onRequestDelete,
    );
  };
}
