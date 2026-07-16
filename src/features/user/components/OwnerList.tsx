"use client";

import {
  OwnerListView,
  type OwnerListPaginationProps,
  type OwnerWorkflowActionsConfig,
  type PinnedColumns,
  type SortConfig,
  type TableColumn,
  type TableNoDataFoundContent,
} from "@abdoun/abdoun-library";
import type { OwnerListRow } from "../mappers/mapOwnerListItemToLibraryOwner";
import { OwnerListFilters, type OwnerListFiltersProps } from "./OwnerListFilters";

export type OwnerListData = {
  data: OwnerListRow[];
  columns: TableColumn<OwnerListRow>[];
  sortConfig: SortConfig;
  onSort: (next: SortConfig) => void;
  pagination?: OwnerListPaginationProps;
  noDataFound: TableNoDataFoundContent;
  pinnedColumns?: PinnedColumns;
  gridHiddenColumnIds: string[];
  listTitle: string;
  isLoading: boolean;
  isFetching: boolean;
  /** Mobile card overflow menu (library activate/suspend ids). */
  workflowActions?: OwnerWorkflowActionsConfig;
  onRowClick?: (owner: OwnerListRow) => void;
  page: number;
  onPageChange: (page: number) => void;
};

export type OwnerListProps = {
  filters: OwnerListFiltersProps;
  list: OwnerListData;
};

export function OwnerList({ filters, list }: OwnerListProps) {
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
    onRowClick,
  } = list;

  return (
    <div className="w-full min-w-0 md:rounded-xl md:bg-surface md:text-text md:shadow-[0_0.25rem_1.875rem_rgba(46,45,116,0.05)]">
      <div className="p-0 md:p-4 lg:p-6">
        <OwnerListFilters {...filters} />

        <OwnerListView
          className=""
          listTitle={listTitle}
          data={data}
          columns={columns}
          getRowId={(row) => row.id}
          getRowLabel={(row) => row.name}
          sortConfig={sortConfig}
          onSort={onSort}
          isLoading={isLoading || isFetching}
          noDataFound={noDataFound}
          pagination={pagination}
          pinnedColumns={pinnedColumns}
          gridHiddenColumnIds={gridHiddenColumnIds}
          workflowActions={workflowActions}
          onRowClick={onRowClick}
          mobileCardVariant="auto"
        />
      </div>
    </div>
  );
}
