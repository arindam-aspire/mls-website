"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Owner, OwnerWorkflowActionsConfig, SortConfig } from "@abdoun/abdoun-library";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { useToast } from "@/src/hooks/useToast";
import {
  DEFAULT_OWNER_LIST_PAGE,
  DEFAULT_OWNER_LIST_PAGE_SIZE,
} from "../constants/ownerList.constants";
import {
  OWNER_LIST_COLUMN_I18N_KEY,
  OWNER_LIST_TOGGLEABLE_COLUMN_IDS,
  DEFAULT_OWNER_LIST_COLUMN_VISIBILITY,
  resolveOwnerListColumnVisibility,
  type OwnerListColumnVisibility,
  type OwnerListToggleableColumnId,
} from "../constants/ownerListTableColumns.constants";
import { buildOwnerListColumnLabels } from "../i18n/buildOwnerListColumnLabels";
import { mapOwnerListItemsToLibraryOwners } from "../mappers/mapOwnerListItemToLibraryOwner";
import { getOwnerList } from "../services/owner.service";
import {
  buildOwnerListGridHiddenColumnIds,
  buildOwnerListRequestParams,
  buildOwnerListTableColumns,
  resolveOwnerListPinnedColumns,
} from "../utils";

export function useOwnersScreen() {
  const t = useTranslations("user");
  const tColumns = useTranslations("user.owners.list.columns");
  const toast = useToast();

  const user = useAuthStore((state) => state.user);
  const agencyId = user?.agency?.agency_id?.trim() ?? "";

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(DEFAULT_OWNER_LIST_PAGE);
  const [sortConfig, setSortConfig] = useState<SortConfig>([]);
  const [columnVisibility, setColumnVisibility] = useState<OwnerListColumnVisibility>(
    DEFAULT_OWNER_LIST_COLUMN_VISIBILITY,
  );

  const listRequestParams = useMemo(
    () =>
      buildOwnerListRequestParams({
        page,
        pageSize: DEFAULT_OWNER_LIST_PAGE_SIZE,
        search,
        statusFilter: status,
      }),
    [page, search, status],
  );

  const {
    data: ownerListData,
    isPending: isOwnerListLoading,
    isFetching: isOwnerListFetching,
    isError: isOwnerListError,
    error: ownerListError,
  } = useQuery({
    queryKey: ["owners", "list", agencyId, listRequestParams],
    queryFn: () => getOwnerList(agencyId, listRequestParams),
    enabled: agencyId.length > 0,
  });

  const onWorkflowActionPlaceholder = useCallback(() => {
    toast.info(t("owners.list.workflow.comingSoonTitle"), {
      description: t("owners.list.workflow.comingSoonDescription"),
    });
  }, [t, toast]);

  const workflowActions = useMemo<OwnerWorkflowActionsConfig>(
    () => ({
      view: onWorkflowActionPlaceholder,
      activate: onWorkflowActionPlaceholder,
      suspend: onWorkflowActionPlaceholder,
      delete: onWorkflowActionPlaceholder,
    }),
    [onWorkflowActionPlaceholder],
  );

  const onSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(DEFAULT_OWNER_LIST_PAGE);
  }, []);

  const onStatusChange = useCallback((value: string) => {
    setStatus(value);
    setPage(DEFAULT_OWNER_LIST_PAGE);
  }, []);

  const onPageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const onSort = useCallback((next: SortConfig) => {
    setSortConfig(next);
  }, []);

  const onColumnVisibilityChange = useCallback(
    (columnId: OwnerListToggleableColumnId, visible: boolean) => {
      setColumnVisibility((previous) =>
        resolveOwnerListColumnVisibility({
          ...previous,
          [columnId]: visible,
        }),
      );

      if (!visible) {
        const libraryColumnId =
          columnId === "contact"
            ? "contacts"
            : columnId === "properties"
              ? "propertyOwned"
              : columnId;

        setSortConfig((previous) =>
          previous.filter((rule) => rule.id !== libraryColumnId),
        );
      }
    },
    [],
  );

  const columnLabels = useMemo(() => buildOwnerListColumnLabels(tColumns), [tColumns]);

  const columnOptions = useMemo(() => {
    const visibility = resolveOwnerListColumnVisibility(columnVisibility);

    return OWNER_LIST_TOGGLEABLE_COLUMN_IDS.map((id) => ({
      id,
      label: columnLabels[OWNER_LIST_COLUMN_I18N_KEY[id]],
      visible: visibility[id],
    }));
  }, [columnLabels, columnVisibility]);

  const tableOwners = useMemo(
    () => mapOwnerListItemsToLibraryOwners(ownerListData?.owners ?? []),
    [ownerListData?.owners],
  );

  const columns = useMemo(
    () =>
      buildOwnerListTableColumns({
        labels: columnLabels,
        columnVisibility,
        workflowActions,
      }),
    [columnLabels, columnVisibility, workflowActions],
  );

  const pinnedColumns = useMemo(
    () => resolveOwnerListPinnedColumns(columns.map((column) => column.id)),
    [columns],
  );

  const activeSortConfig = useMemo(
    () =>
      sortConfig.filter((rule) =>
        columns.some((column) => column.id === rule.id && column.sortable),
      ),
    [columns, sortConfig],
  );

  const pagination = useMemo(() => {
    const meta = ownerListData?.pagination;

    if (!meta) {
      return undefined;
    }

    return {
      total: meta.total,
      page: meta.page,
      pageSize: meta.pageSize,
      totalPages: meta.totalPages,
      hasNext: meta.hasNext,
      hasPrevious: meta.hasPrevious,
      maxPageButtons: 5,
      isLoading: isOwnerListFetching,
      onPageChange,
    };
  }, [ownerListData?.pagination, isOwnerListFetching, onPageChange]);

  const gridHiddenColumnIds = useMemo(
    () => buildOwnerListGridHiddenColumnIds(columnVisibility),
    [columnVisibility],
  );

  const noDataFound = useMemo(
    () => ({
      title: t("owners.list.noDataTitle"),
      description: t("owners.list.noDataDescription"),
    }),
    [t],
  );

  useEffect(() => {
    if (!isOwnerListError) {
      return;
    }

    const apiError = ownerListError as unknown as ApiError;
    toast.error(t("owners.list.fetchErrorTitle"), {
      description: apiError.message,
    });
  }, [ownerListError, isOwnerListError, t, toast]);

  return {
    pageTitle: t("owners.pageTitle"),
    pageSubtitle: t("owners.pageSubtitle"),
    listFilters: {
      search,
      status,
      onSearchChange,
      onStatusChange,
      columnOptions,
      onColumnVisibilityChange,
    },
    ownerList: {
      data: tableOwners,
      columns,
      sortConfig: activeSortConfig,
      onSort,
      pagination,
      noDataFound,
      pinnedColumns,
      gridHiddenColumnIds,
      listTitle: t("owners.list.tableTitle"),
      isLoading: isOwnerListLoading,
      isFetching: isOwnerListFetching,
      workflowActions,
      page,
      onPageChange,
    },
  };
}
