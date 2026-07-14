"use client";

import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { getLeadList } from "../services/lead.service";
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
  const [assignedAgentId, setAssignedAgentId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(DEFAULT_LEAD_LIST_PAGE);

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
      assignedAgentId: assignedAgentId.trim() || undefined,
      propertyId: propertyId.trim() || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    }),
    [page, status, debouncedSearch, assignedAgentId, propertyId, dateFrom, dateTo],
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

  const rows = useMemo(() => {
    return (data?.items ?? []).map((lead) => ({
      id: lead.id,
      leadNumber: lead.lead_number,
      propertyTitle: resolveLeadPropertyTitle(lead),
      customerName: resolveLeadCustomerName(lead),
      status: lead.status,
      assignedAgent: resolveAssignedAgentLabel(lead),
      createdAtLabel: formatLeadDate(lead.created_at, locale),
    }));
  }, [data?.items, locale]);

  const pagination = data?.pagination;

  const onClearFilters = useCallback(() => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("");
    setAssignedAgentId("");
    setPropertyId("");
    setDateFrom("");
    setDateTo("");
    setPage(DEFAULT_LEAD_LIST_PAGE);
  }, []);

  const onOpenLead = useCallback(
    (leadId: string) => {
      router.push(`/leads/${leadId}`);
    },
    [router],
  );

  return {
    labels: {
      pageTitle: t("pageTitle"),
      pageSubtitle: t("pageSubtitle"),
      tableTitle: t("list.tableTitle"),
      searchPlaceholder: t("list.searchPlaceholder"),
      clearSearch: tCommon("clearSearch"),
      clearFilters: t("list.filters.clear"),
      filterStatus: t("list.filters.status"),
      filterAgent: t("list.filters.agent"),
      filterAgentPlaceholder: t("list.filters.agentPlaceholder"),
      filterDateFrom: t("list.filters.dateFrom"),
      filterDateTo: t("list.filters.dateTo"),
      filterProperty: t("list.filters.property"),
      filterPropertyPlaceholder: t("list.filters.propertyPlaceholder"),
      columns: {
        leadNo: t("list.columns.leadNo"),
        property: t("list.columns.property"),
        customer: t("list.columns.customer"),
        status: t("list.columns.status"),
        assignedAgent: t("list.columns.assignedAgent"),
        createdDate: t("list.columns.createdDate"),
        actions: t("list.columns.actions"),
      },
      viewDetails: t("list.viewDetails"),
      noDataTitle: t("list.noDataTitle"),
      noDataDescription: t("list.noDataDescription"),
      previous: t("list.pagination.previous"),
      next: t("list.pagination.next"),
      pageOf: pagination
        ? t("list.pagination.pageOf", {
            page: pagination.page,
            totalPages: Math.max(pagination.totalPages, 1),
          })
        : "",
    },
    statusOptions,
    filters: {
      search,
      status,
      assignedAgentId,
      propertyId,
      dateFrom,
      dateTo,
      onSearchChange: setSearch,
      onStatusChange: (value: string) => {
        setStatus(value);
        setPage(DEFAULT_LEAD_LIST_PAGE);
      },
      onAssignedAgentIdChange: (value: string) => {
        setAssignedAgentId(value);
        setPage(DEFAULT_LEAD_LIST_PAGE);
      },
      onPropertyIdChange: (value: string) => {
        setPropertyId(value);
        setPage(DEFAULT_LEAD_LIST_PAGE);
      },
      onDateFromChange: (value: string) => {
        setDateFrom(value);
        setPage(DEFAULT_LEAD_LIST_PAGE);
      },
      onDateToChange: (value: string) => {
        setDateTo(value);
        setPage(DEFAULT_LEAD_LIST_PAGE);
      },
      onClearFilters,
    },
    rows,
    statusLabel: (statusValue: string) =>
      LEAD_STATUSES.includes(statusValue as (typeof LEAD_STATUSES)[number])
        ? tStatus(statusValue as (typeof LEAD_STATUSES)[number])
        : statusValue,
    isLoading: isPending,
    isFetching,
    pagination,
    page,
    onPageChange: setPage,
    onOpenLead,
  };
}
