"use client";

import {
  AgentListView,
  type AgentListPaginationProps,
  type PinnedColumns,
  type SortConfig,
  type TableColumn,
  type TableNoDataFoundContent,
} from "@abdoun/abdoun-library";
import {
  LeadListFilters,
  type LeadListFiltersProps,
} from "./LeadListFilters";
import type { LeadListRow } from "../types/leadList.types";

export type LeadListData = {
  data: LeadListRow[];
  columns: TableColumn<LeadListRow>[];
  sortConfig: SortConfig;
  onSort: (next: SortConfig) => void;
  pagination?: AgentListPaginationProps;
  noDataFound: TableNoDataFoundContent;
  pinnedColumns?: PinnedColumns;
  gridHiddenColumnIds: string[];
  listTitle: string;
  isLoading: boolean;
  isFetching: boolean;
  onRowClick: (row: LeadListRow) => void;
};

export type LeadListProps = {
  filters: LeadListFiltersProps;
  list: LeadListData;
};

export function LeadList({ filters, list }: LeadListProps) {
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
    onRowClick,
  } = list;

  return (
    <div className="w-full min-w-0 md:rounded-xl md:bg-surface md:text-text md:shadow-[0_0.25rem_1.875rem_rgba(46,45,116,0.05)]">
      <div className="p-0 md:p-4 lg:p-6">
        <LeadListFilters {...filters} />

        <AgentListView<LeadListRow>
          className=""
          listTitle={listTitle}
          data={data}
          columns={columns}
          getRowId={(row) => row.id}
          getRowLabel={(row) => row.leadNumber}
          onRowClick={onRowClick}
          sortConfig={sortConfig}
          onSort={onSort}
          isLoading={isLoading || isFetching}
          noDataFound={noDataFound}
          pagination={pagination}
          pinnedColumns={pinnedColumns}
          gridHiddenColumnIds={gridHiddenColumnIds}
          gridTitleColumnId="leadNumber"
          mobileCardVariant="generic"
        />
      </div>
    </div>
  );
}
