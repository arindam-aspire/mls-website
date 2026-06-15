export type AgentListSortOrder = "asc" | "desc";

export type AgentListQueryParams = {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: AgentListSortOrder;
};

export const agentEndpoints = {
  LIST: (params: AgentListQueryParams): string => {
    const search = new URLSearchParams({
      page: String(params.page),
      pageSize: String(params.pageSize),
    });

    if (params.sortBy) {
      search.set("sortBy", params.sortBy);
    }

    if (params.sortOrder) {
      search.set("sortOrder", params.sortOrder);
    }

    return `/agents?${search.toString()}`;
  },
} as const;
