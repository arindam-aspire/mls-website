"use client";

import {
  AgentListView,
  type Agent,
  type AgentListPaginationProps,
  type AgentWorkflowActionsConfig,
  type PinnedColumns,
  type SortConfig,
  type TableColumn,
  type TableNoDataFoundContent,
} from "@abdoun/abdoun-library";
import { AgentListFilters, type AgentListFiltersProps } from "./AgentListFilters";

export type AgentListData = {
  data: Agent[];
  columns: TableColumn<Agent>[];
  sortConfig: SortConfig;
  onSort: (next: SortConfig) => void;
  pagination?: AgentListPaginationProps;
  noDataFound: TableNoDataFoundContent;
  pinnedColumns?: PinnedColumns;
  gridHiddenColumnIds: string[];
  listTitle: string;
  isLoading: boolean;
  isFetching: boolean;
  workflowActions?: AgentWorkflowActionsConfig;
  page: number;
  onPageChange: (page: number) => void;
};

export type AgentListProps = {
  filters: AgentListFiltersProps;
  list: AgentListData;
};

export function AgentList({ filters, list }: AgentListProps) {
  const {
    data,
    columns,
    sortConfig,
    onSort,
    pagination,
    noDataFound,
    pinnedColumns,
    gridHiddenColumnIds,
    listTitle,
    isLoading,
    isFetching,
    workflowActions,
  } = list;

  return (
    <div className="w-full min-w-0 md:rounded-xl md:bg-surface md:text-text md:shadow-[0_0.25rem_1.875rem_rgba(46,45,116,0.05)]">
      <div className="p-0 md:p-4 lg:p-6">
        <AgentListFilters {...filters} />

        <AgentListView
          className=""
          listTitle={listTitle}
          data={data}
          columns={columns}
          getRowId={(row) => row.id}
          getRowLabel={(row) => row.name ?? row.email}
          sortConfig={sortConfig}
          onSort={onSort}
          isLoading={isLoading || isFetching}
          noDataFound={noDataFound}
          pagination={pagination}
          pinnedColumns={pinnedColumns}
          gridHiddenColumnIds={gridHiddenColumnIds}
          workflowActions={workflowActions}
          mobileCardVariant="auto"
        />
      </div>
    </div>
  );
}
