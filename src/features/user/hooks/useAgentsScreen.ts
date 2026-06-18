"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Agent, AgentWorkflowActionsConfig, SortConfig } from "@abdoun/abdoun-library";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useToast } from "@/src/hooks/useToast";
import type { AgentKPIMetricId } from "../components/AgentKPICards";
import {
  AGENT_LIST_SORT_BY,
  AGENT_LIST_SORT_ORDER,
  DEFAULT_AGENT_LIST_PAGE,
  DEFAULT_AGENT_LIST_PAGE_SIZE,
} from "../constants/agentList.constants";
import {
  AGENT_LIST_COLUMN_I18N_KEY,
  AGENT_LIST_TOGGLEABLE_COLUMN_IDS,
  DEFAULT_AGENT_LIST_COLUMN_VISIBILITY,
  resolveAgentListColumnVisibility,
  type AgentListColumnVisibility,
  type AgentListToggleableColumnId,
} from "../constants/agentListTableColumns.constants";
import { buildAgentListColumnLabels } from "../i18n/buildAgentListColumnLabels";
import { mapAgentListItemsToLibraryAgents } from "../mappers/mapAgentListItemToLibraryAgent";
import { getAgentList, getAgentSummary } from "../services/agent.service";
import { useInviteAgentByEmailModal } from "./useInviteAgentByEmailModal";
import { useManualOnboardAgentModal } from "./useManualOnboardAgentModal";
import { useDeleteAgentConfirm } from "./useDeleteAgentConfirm";
import { useResendAgentInvitationConfirm } from "./useResendAgentInvitationConfirm";
import {
  buildAgentListGridHiddenColumnIds,
  buildAgentListRequestParams,
  buildAgentListTableColumns,
  mapAgentSummaryToKpiMetrics,
  resolveAgentListPinnedColumns,
} from "../utils";

export function useAgentsScreen() {
  const t = useTranslations("user");
  const tColumns = useTranslations("user.agents.list.columns");
  const toast = useToast();

  const inviteAgentByEmailModal = useInviteAgentByEmailModal();
  const manualOnboardAgentModal = useManualOnboardAgentModal();
  const resendAgentConfirm = useResendAgentInvitationConfirm();
  const deleteAgentConfirm = useDeleteAgentConfirm();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(DEFAULT_AGENT_LIST_PAGE);
  const [sortConfig, setSortConfig] = useState<SortConfig>([]);
  const [columnVisibility, setColumnVisibility] = useState<AgentListColumnVisibility>(
    DEFAULT_AGENT_LIST_COLUMN_VISIBILITY,
  );

  const listRequestParams = useMemo(
    () =>
      buildAgentListRequestParams({
        page,
        pageSize: DEFAULT_AGENT_LIST_PAGE_SIZE,
        sortBy: AGENT_LIST_SORT_BY,
        sortOrder: AGENT_LIST_SORT_ORDER,
        search,
        statusFilter: status,
      }),
    [page, search, status],
  );

  const {
    data: agentSummary,
    isPending: isKpiLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["agents", "summary"],
    queryFn: getAgentSummary,
  });

  const {
    data: agentListData,
    isPending: isAgentListLoading,
    isFetching: isAgentListFetching,
    isError: isAgentListError,
    error: agentListError,
  } = useQuery({
    queryKey: ["agents", "list", listRequestParams],
    queryFn: () => getAgentList(listRequestParams),
  });

  const onOpenInviteAgentByEmail = inviteAgentByEmailModal.openModal;
  const onOpenManualOnboardAgent = manualOnboardAgentModal.openModal;

  const onWorkflowActionPlaceholder = useCallback(() => {
    toast.info(t("agents.list.workflow.comingSoonTitle"), {
      description: t("agents.list.workflow.comingSoonDescription"),
    });
  }, [t, toast]);

  const onResendInvitation = useCallback(
    (agent: Agent) => {
      resendAgentConfirm.openConfirm(agent);
    },
    [resendAgentConfirm],
  );

  const onRevokeInvitation = useCallback(
    (agent: Agent) => {
      deleteAgentConfirm.openConfirm(agent, "revoke");
    },
    [deleteAgentConfirm],
  );

  const onRemoveAgent = useCallback(
    (agent: Agent) => {
      deleteAgentConfirm.openConfirm(agent, "remove");
    },
    [deleteAgentConfirm],
  );

  const workflowActions = useMemo<AgentWorkflowActionsConfig>(
    () => ({
      activate: onWorkflowActionPlaceholder,
      approve: onWorkflowActionPlaceholder,
      deactivate: onWorkflowActionPlaceholder,
      decline: onWorkflowActionPlaceholder,
      grant_admin: onWorkflowActionPlaceholder,
      resend: onResendInvitation,
      revoke: onRevokeInvitation,
      remove: onRemoveAgent,
    }),
    [
      onRemoveAgent,
      onResendInvitation,
      onRevokeInvitation,
      onWorkflowActionPlaceholder,
    ],
  );

  const onSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(DEFAULT_AGENT_LIST_PAGE);
  }, []);

  const onStatusChange = useCallback((value: string) => {
    setStatus(value);
    setPage(DEFAULT_AGENT_LIST_PAGE);
  }, []);

  const onPageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const onSort = useCallback((next: SortConfig) => {
    setSortConfig(next);
  }, []);

  const onColumnVisibilityChange = useCallback(
    (columnId: AgentListToggleableColumnId, visible: boolean) => {
      setColumnVisibility((previous) =>
        resolveAgentListColumnVisibility({
          ...previous,
          [columnId]: visible,
        }),
      );

      if (!visible) {
        const libraryColumnId =
          columnId === "contact"
            ? "contacts"
            : columnId;

        setSortConfig((previous) =>
          previous.filter((rule) => rule.id !== libraryColumnId),
        );
      }
    },
    [],
  );

  const columnLabels = useMemo(() => buildAgentListColumnLabels(tColumns), [tColumns]);

  const kpiMetrics = useMemo(
    () =>
      mapAgentSummaryToKpiMetrics(agentSummary, (id: AgentKPIMetricId) =>
        t(`agents.kpi.${id}`),
      ),
    [agentSummary, t],
  );

  const columnOptions = useMemo(() => {
    const visibility = resolveAgentListColumnVisibility(columnVisibility);

    return AGENT_LIST_TOGGLEABLE_COLUMN_IDS.map((id) => ({
      id,
      label: columnLabels[AGENT_LIST_COLUMN_I18N_KEY[id]],
      visible: visibility[id],
    }));
  }, [columnLabels, columnVisibility]);

  const tableAgents = useMemo(
    () => mapAgentListItemsToLibraryAgents(agentListData?.agents ?? []),
    [agentListData?.agents],
  );

  const columns = useMemo(
    () =>
      buildAgentListTableColumns({
        labels: columnLabels,
        columnVisibility,
        workflowActions,
      }),
    [columnLabels, columnVisibility, workflowActions],
  );

  const pinnedColumns = useMemo(
    () => resolveAgentListPinnedColumns(columns.map((column) => column.id)),
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
    const meta = agentListData?.pagination;

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
      isLoading: isAgentListFetching,
      onPageChange,
    };
  }, [agentListData?.pagination, isAgentListFetching, onPageChange]);

  const noDataFound = useMemo(
    () => ({
      title: t("agents.list.noDataTitle"),
      description: t("agents.list.noDataDescription"),
    }),
    [t],
  );

  const gridHiddenColumnIds = useMemo(
    () => buildAgentListGridHiddenColumnIds(columnVisibility),
    [columnVisibility],
  );

  useEffect(() => {
    if (!isError) {
      return;
    }

    const apiError = error as unknown as ApiError;
    toast.error(t("agents.summary.fetchErrorTitle"), {
      description: apiError.message,
    });
  }, [error, isError, t, toast]);

  useEffect(() => {
    if (!isAgentListError) {
      return;
    }

    const apiError = agentListError as unknown as ApiError;
    toast.error(t("agents.list.fetchErrorTitle"), {
      description: apiError.message,
    });
  }, [agentListError, isAgentListError, t, toast]);

  return {
    pageTitle: t("agents.pageTitle"),
    pageSubtitle: t("agents.pageSubtitle"),
    inviteByEmailLabel: t("agents.inviteByEmail"),
    manualOnboardLabel: t("agents.manualOnboard"),
    kpiMetrics,
    kpiSectionAriaLabel: t("agents.kpi.ariaLabel"),
    isKpiLoading,
    listFilters: {
      search,
      status,
      onSearchChange,
      onStatusChange,
      columnOptions,
      onColumnVisibilityChange,
    },
    agentList: {
      data: tableAgents,
      columns,
      sortConfig: activeSortConfig,
      onSort,
      pagination,
      noDataFound,
      pinnedColumns,
      gridHiddenColumnIds,
      listTitle: t("agents.list.tableTitle"),
      isLoading: isAgentListLoading,
      isFetching: isAgentListFetching,
      workflowActions,
      page,
      onPageChange,
    },
    onOpenInviteAgentByEmail,
    onOpenManualOnboardAgent,
    inviteAgentByEmailModal,
    manualOnboardAgentModal,
    resendAgentConfirm,
    deleteAgentConfirm,
  };
}
