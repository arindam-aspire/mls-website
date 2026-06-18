import {
  OWNER_LIST_STATUS_FILTER_TO_API_STATUS,
  isOwnerListStatusFilterValue,
} from "../constants/ownerListStatusFilters.constants";

export function mapOwnerListStatusFilterToApiStatus(
  statusFilter: string,
): string | undefined {
  if (!isOwnerListStatusFilterValue(statusFilter)) {
    return undefined;
  }

  return OWNER_LIST_STATUS_FILTER_TO_API_STATUS[statusFilter];
}
