"use client";

import { useCallback, useEffect, useState } from "react";
import { useGetAgentProperties } from "../mutations/property.mutation";
import type {
  AgentPropertiesListParams,
  AgentPropertyListItem,
  PaginationMeta,
} from "../types/property.types";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

function buildRequestParams(
  search: string,
  status: string,
  page = DEFAULT_PAGE,
): AgentPropertiesListParams {
  const trimmedSearch = search.trim();

  return {
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    ...(trimmedSearch ? { search: trimmedSearch } : {}),
    ...(status ? { status } : {}),
  };
}

export function useListingPropertyScreen() {
  // 4. Local state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [listings, setListings] = useState<AgentPropertyListItem[] | null>(null);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | undefined>();
  const [requestParams, setRequestParams] = useState<AgentPropertiesListParams>(() =>
    buildRequestParams("", ""),
  );

  // 5. Data fetching / queries
  const { mutate: getAgentProperties, isPending: isLoadingAgentProperties } =
    useGetAgentProperties();

  const fetchAgentProperties = useCallback(
    (params: AgentPropertiesListParams) => {
      setRequestParams(params);
      getAgentProperties(params, {
        onSuccess: (response) => {
          const data = response.data;
          setListings(data?.items ?? []);
          setPaginationMeta(
            response.meta?.pagination ??
              (data
                ? {
                    total: data.total,
                    page: data.page,
                    pageSize: data.pageSize,
                    totalPages: data.totalPages,
                    hasNext: data.hasNext,
                    hasPrevious: data.hasPrevious,
                  }
                : undefined),
          );
        },
      });
    },
    [getAgentProperties],
  );

  // 7. Callbacks
  const onSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const onStatusChange = useCallback((value: string) => {
    setStatus(value);
  }, []);

  // 9. Effects
  useEffect(() => {
    fetchAgentProperties(buildRequestParams(search, status));
  }, [fetchAgentProperties, search, status]);

  // 10. Return values
  return {
    listings,
    paginationMeta,
    requestParams,
    filters: {
      search,
      status,
      onSearchChange,
      onStatusChange,
    },
    isLoading: listings === null || isLoadingAgentProperties,
    fetchAgentProperties,
  };
}
