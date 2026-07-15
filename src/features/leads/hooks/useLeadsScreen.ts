"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { SortConfig } from "@abdoun/abdoun-library";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useToast } from "@/src/hooks/useToast";
import { useRouter } from "@/src/i18n/navigation";
import {
  DEFAULT_LEAD_LIST_PAGE,
  DEFAULT_LEAD_LIST_PAGE_SIZE,
  LEADS_QUERY_KEY,
  LEAD_LIST_REFETCH_INTERVAL_MS,
} from "../constants/leadList.constants";
import { LEAD_STATUSES } from "../types/lead.types";
import type { LeadListRow } from "../types/leadList.types";
import { getLeadList } from "../services/lead.service";
import {
  buildLeadListTableColumns,
  DEFAULT_LEAD_LIST_PINNED_COLUMNS,
  LEAD_LIST_GRID_HIDDEN_COLUMN_IDS,
} from "../utils/buildLeadListTableColumns";
import {
  formatLeadDate,
  resolveAssignedAgentLabel,
  resolveLeadCustomerName,
  resolveLeadPropertyTitle,
} from "../utils/leadDisplay.utils";

export function useLeadsScreen() {
  const t = useTranslations("leads");
  const tStatus = useTranslations("leads.status");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const toast = useToast();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(DEFAULT_LEAD_LIST_PAGE);
  const [sortConfig, setSortConfig] = useState<SortConfig>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(DEFAULT_LEAD_LIST_PAGE);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const listParams = useMemo(
    () => ({
      page,
      pageSize: DEFAULT_LEAD_LIST_PAGE_SIZE,
      status: status || undefined,
      search: debouncedSearch || undefined,
    }),
    [page, status, debouncedSearch],
  );

  const {
    data,
    isPending,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: [LEADS_QUERY_KEY, "list", listParams],
    queryFn: () => getLeadList(listParams),
    refetchInterval: LEAD_LIST_REFETCH_INTERVAL_MS,
  });

  useEffect(() => {
    if (!isError || !error) return;
    toast.error(t("list.fetchErrorTitle"), {
      description: (error as unknown as ApiError).message,
    });
  }, [isError, error, t, toast]);

  const statusLabel = useCallback(
    (statusValue: string) =>
      LEAD_STATUSES.includes(statusValue as (typeof LEAD_STATUSES)[number])
        ? tStatus(statusValue as (typeof LEAD_STATUSES)[number])
        : statusValue,
    [tStatus],
  );

  const statusOptions = useMemo(
    () => [
      { value: "", label: t("list.filters.statusAll") },
      ...LEAD_STATUSES.map((value) => ({
        value,
        label: tStatus(value),
      })),
    ],
    [t, tStatus],
  );

  const rows = useMemo<LeadListRow[]>(() => {
    return (data?.items ?? []).map((lead) => ({
      id: lead.id,
      leadNumber: lead.lead_number,
      propertyTitle: resolveLeadPropertyTitle(lead),
      customerName: resolveLeadCustomerName(lead),
      status: lead.status,
      assignedAgent: resolveAssignedAgentLabel(lead),
      createdAtLabel: formatLeadDate(lead.created_at, locale),
      createdAtSortValue: lead.created_at ?? "",
    }));
  }, [data?.items, locale]);

  const onSearchChange = useCallback((value: string) => {
    setSearch(value);
  }, []);

  const onStatusChange = useCallback((value: string) => {
    setStatus(value);
    setPage(DEFAULT_LEAD_LIST_PAGE);
  }, []);

  const onOpenLead = useCallback(
    (leadId: string) => {
      router.push(`/leads/${leadId}`);
    },
    [router],
  );

  const onRowClick = useCallback(
    (row: LeadListRow) => {
      onOpenLead(row.id);
    },
    [onOpenLead],
  );

  const onPageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const onSort = useCallback((next: SortConfig) => {
    setSortConfig(next);
  }, []);

  const columnLabels = useMemo(
    () => ({
      leadNo: t("list.columns.leadNo"),
      property: t("list.columns.property"),
      customer: t("list.columns.customer"),
      status: t("list.columns.status"),
      assignedAgent: t("list.columns.assignedAgent"),
      createdDate: t("list.columns.createdDate"),
      actions: t("list.columns.actions"),
    }),
    [t],
  );

  const columns = useMemo(
    () =>
      buildLeadListTableColumns({
        labels: columnLabels,
        viewDetailsLabel: t("list.viewDetails"),
        statusLabel,
        onOpenLead,
      }),
    [columnLabels, onOpenLead, statusLabel, t],
  );

  const activeSortConfig = useMemo(
    () =>
      sortConfig.filter((rule) =>
        columns.some((column) => column.id === rule.id && column.sortable),
      ),
    [columns, sortConfig],
  );

  const pagination = useMemo(() => {
    const meta = data?.pagination;

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
      isLoading: isFetching,
      onPageChange,
    };
  }, [data?.pagination, isFetching, onPageChange]);

  const noDataFound = useMemo(
    () => ({
      title: t("list.noDataTitle"),
      description: t("list.noDataDescription"),
    }),
    [t],
  );

  const pinnedColumns = useMemo(
    () => ({
      left: [...DEFAULT_LEAD_LIST_PINNED_COLUMNS.left],
      right: [...DEFAULT_LEAD_LIST_PINNED_COLUMNS.right],
    }),
    [],
  );

  return {
    pageTitle: t("pageTitle"),
    pageSubtitle: t("pageSubtitle"),
    listFilters: {
      search,
      status,
      statusOptions,
      labels: {
        searchPlaceholder: t("list.searchPlaceholder"),
        clearSearch: tCommon("clearSearch"),
        filterStatus: t("list.filters.status"),
        statusAll: t("list.filters.statusAll"),
      },
      onSearchChange,
      onStatusChange,
    },
    leadList: {
      data: rows,
      columns,
      sortConfig: activeSortConfig,
      onSort,
      pagination,
      noDataFound,
      pinnedColumns,
      gridHiddenColumnIds: [...LEAD_LIST_GRID_HIDDEN_COLUMN_IDS],
      listTitle: t("list.tableTitle"),
      isLoading: isPending,
      isFetching,
      onRowClick,
    },
  };
}
