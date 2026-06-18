import {
  DEFAULT_OWNER_LIST_PAGE,
  DEFAULT_OWNER_LIST_PAGE_SIZE,
} from "../constants/ownerList.constants";
import type { OwnerListParams } from "../types/owner.types";
import { mapOwnerListStatusFilterToApiStatus } from "./mapOwnerListStatusFilterToApiStatus";

type BuildOwnerListRequestParamsInput = {
  page?: number;
  pageSize?: number;
  search?: string;
  statusFilter?: string;
};

export function buildOwnerListRequestParams({
  page = DEFAULT_OWNER_LIST_PAGE,
  pageSize = DEFAULT_OWNER_LIST_PAGE_SIZE,
  search = "",
  statusFilter = "",
}: BuildOwnerListRequestParamsInput = {}): OwnerListParams {
  const trimmedSearch = search.trim();
  const apiStatus = mapOwnerListStatusFilterToApiStatus(statusFilter);

  return {
    page,
    pageSize,
    ...(trimmedSearch ? { search: trimmedSearch } : {}),
    ...(apiStatus ? { status: apiStatus } : {}),
  };
}
