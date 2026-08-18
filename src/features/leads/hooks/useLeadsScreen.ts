"use client";

import { useQuery, useQueries, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { SortConfig } from "@abdoun/abdoun-library";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import {
  isAgencyUser,
  isOwnerUser,
  isSuperAdminUser,
} from "@/src/features/auth/utils/profileMenuRoleAccess";
import { resolveAgentNameFromCache } from "@/src/features/user/utils/resolveAgentNameFromCache";
import { getPropertyDetails } from "@/src/features/property/services/property.service";
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
import type { PropertyDetails } from "@/src/features/property/types/property.types";
import { getLeadList, getOwnerLeadList } from "../services/lead.service";
import {
  buildLeadListTableColumns,
  DEFAULT_LEAD_LIST_PINNED_COLUMNS,
  LEAD_LIST_GRID_HIDDEN_COLUMN_IDS,
} from "../utils/buildLeadListTableColumns";
import {
  formatLeadDate,
  hasAssignedLeadAgent,
  resolveAssignedAgentLabel,
  resolveLeadCustomerName,
  resolveLeadPropertyTitle,
  resolveLeadStatusForViewer,
  resolvePropertyAgentComparableIds,
  resolvePropertyAgentDisplayName,
} from "../utils/leadDisplay.utils";
import { LEAD_CLOSE_STATUS_VALUES } from "../constants/leadStatus.constants";

type LeadListScope = "management" | "owner";

type UseLeadsScreenOptions = {
  scope?: LeadListScope;
};

export function useLeadsScreen({
  scope = "management",
}: UseLeadsScreenOptions = {}) {
  const t = useTranslations("leads");
  const tStatus = useTranslations("leads.status");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const toast = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isOwnerScope = scope === "owner";
  const ownerId = isOwnerScope && isOwnerUser(user) ? user?.id : undefined;
  const canViewCloseStatus =
    isAgencyUser(user) || isSuperAdminUser(user);

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
    queryKey: isOwnerScope
      ? [LEADS_QUERY_KEY, "owner-list", ownerId, listParams]
      : [LEADS_QUERY_KEY, "list", listParams],
    queryFn: () =>
      isOwnerScope
        ? getOwnerLeadList(ownerId!, listParams)
        : getLeadList(listParams),
    enabled: !isOwnerScope || Boolean(ownerId),
    refetchInterval: LEAD_LIST_REFETCH_INTERVAL_MS,
  });

  useEffect(() => {
    if (!isError || !error) return;
    toast.error(t("list.fetchErrorTitle"), {
      description: (error as unknown as ApiError).message,
    });
  }, [isError, error, t, toast]);

  const propertyIds = useMemo(() => {
    const ids = new Set<string>();
    for (const lead of data?.items ?? []) {
      const propertyId = lead.property_id?.trim();
      if (propertyId) {
        ids.add(propertyId);
      }
    }
    return [...ids];
  }, [data?.items]);

  const propertyDetailsQueries = useQueries({
    queries: propertyIds.map((propertyId) => ({
      queryKey: ["property", "details", propertyId],
      queryFn: () => getPropertyDetails(propertyId),
      staleTime: 5 * 60 * 1000,
    })),
  });

  const propertyDetailsById = useMemo(() => {
    const map = new Map<string, PropertyDetails>();
    propertyIds.forEach((propertyId, index) => {
      const details = propertyDetailsQueries[index]?.data?.data ?? null;
      if (details) {
        map.set(propertyId, details);
      }
    });
    return map;
  }, [propertyDetailsQueries, propertyIds]);

  const statusLabel = useCallback(
    (statusValue: string) => {
      const viewerStatus = resolveLeadStatusForViewer(
        statusValue,
        canViewCloseStatus,
      );
      const normalized = viewerStatus ?? statusValue;

      return LEAD_STATUSES.includes(normalized as (typeof LEAD_STATUSES)[number])
        ? tStatus(normalized as (typeof LEAD_STATUSES)[number])
        : normalized;
    },
    [canViewCloseStatus, tStatus],
  );

  const statusOptions = useMemo(
    () => [
      { value: "", label: t("list.filters.statusAll") },
      ...LEAD_STATUSES.filter(
        (value) =>
          canViewCloseStatus ||
          !(LEAD_CLOSE_STATUS_VALUES as readonly string[]).includes(value),
      ).map((value) => ({
        value,
        label: tStatus(value),
      })),
    ],
    [canViewCloseStatus, t, tStatus],
  );

  const rows = useMemo<LeadListRow[]>(() => {
    return (data?.items ?? []).map((lead) => {
      const assignedAgentId = lead.assigned_agent_id?.trim();
      const propertyDetails = lead.property_id
        ? propertyDetailsById.get(lead.property_id) ?? null
        : null;
      const assignedAgentLabel = hasAssignedLeadAgent(lead)
        ? resolveAssignedAgentLabel(lead, {
            propertyAgentName: resolvePropertyAgentDisplayName(propertyDetails),
            propertyAgentIds: resolvePropertyAgentComparableIds(propertyDetails),
            cachedAgentName: resolveAgentNameFromCache(
              queryClient,
              assignedAgentId,
            ),
            currentUserName:
              assignedAgentId && user?.id === assignedAgentId
                ? user.full_name?.trim() || null
                : null,
          }) || t("details.emptyValue")
        : t("details.emptyValue");

      return {
        id: lead.id,
        leadNumber: lead.lead_number,
        propertyTitle: resolveLeadPropertyTitle(lead),
        customerName: resolveLeadCustomerName(lead),
        status:
          resolveLeadStatusForViewer(lead.status, canViewCloseStatus) ??
          lead.status,
        assignedAgent: assignedAgentLabel,
        createdAtLabel: formatLeadDate(lead.created_at, locale),
        createdAtSortValue: lead.created_at ?? "",
      };
    });
  }, [canViewCloseStatus, data?.items, locale, propertyDetailsById, queryClient, t, user]);

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
        onOpenLead: isOwnerScope ? undefined : onOpenLead,
      }),
    [columnLabels, isOwnerScope, onOpenLead, statusLabel, t],
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
      title: isOwnerScope
        ? t("ownerList.noDataTitle")
        : t("list.noDataTitle"),
      description: isOwnerScope
        ? t("ownerList.noDataDescription")
        : t("list.noDataDescription"),
    }),
    [isOwnerScope, t],
  );

  const pinnedColumns = useMemo(
    () => ({
      left: [...DEFAULT_LEAD_LIST_PINNED_COLUMNS.left],
      right: isOwnerScope
        ? []
        : [...DEFAULT_LEAD_LIST_PINNED_COLUMNS.right],
    }),
    [isOwnerScope],
  );

  return {
    pageTitle: isOwnerScope ? t("ownerPageTitle") : t("pageTitle"),
    pageSubtitle: isOwnerScope
      ? t("ownerPageSubtitle")
      : t("pageSubtitle"),
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
      gridHiddenColumnIds: isOwnerScope
        ? LEAD_LIST_GRID_HIDDEN_COLUMN_IDS.filter((id) => id !== "actions")
        : [...LEAD_LIST_GRID_HIDDEN_COLUMN_IDS],
      listTitle: isOwnerScope
        ? t("ownerList.tableTitle")
        : t("list.tableTitle"),
      isLoading: isPending,
      isFetching,
      onRowClick: isOwnerScope ? undefined : onRowClick,
    },
  };
}
