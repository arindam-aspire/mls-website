"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import {
  AGENT_LIST_SORT_BY,
  AGENT_LIST_SORT_ORDER,
  DEFAULT_AGENT_LIST_PAGE,
  DEFAULT_AGENT_LIST_PAGE_SIZE,
} from "@/src/features/user/constants/agentList.constants";
import { getAgentList } from "@/src/features/user/services/agent.service";
import type { AgentListItem, AgentListPagination } from "@/src/features/user/types/agent.types";
import { filterActiveAgents } from "@/src/features/user/utils/filterActiveAgents";
import { filterAgentsBySearch } from "@/src/features/user/utils/filterAgentsBySearch";
import { useToast } from "@/src/hooks/useToast";
import type { AssignAgentModalMode } from "../types/assignAgentModal.types";

type UseAssignAgentModalParams = {
  open: boolean;
  listingTitle: string;
  mode?: AssignAgentModalMode;
  isAssigning?: boolean;
  onClose: () => void;
  onAssign: (agentId: string) => void;
};

export function useAssignAgentModal({
  open,
  listingTitle,
  mode = "assign",
  isAssigning = false,
  onClose,
  onAssign,
}: UseAssignAgentModalParams) {
  const t = useTranslations("propertyList.manageListings.assignAgentModal");
  const tCommon = useTranslations("common");
  const toast = useToast();

  const [page, setPage] = useState(DEFAULT_AGENT_LIST_PAGE);
  const [agents, setAgents] = useState<AgentListItem[]>([]);
  const [pagination, setPagination] = useState<AgentListPagination | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: agentListPage,
    isPending,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "agents",
      "list",
      page,
      DEFAULT_AGENT_LIST_PAGE_SIZE,
      AGENT_LIST_SORT_BY,
      AGENT_LIST_SORT_ORDER,
    ],
    queryFn: () =>
      getAgentList({
        page,
        pageSize: DEFAULT_AGENT_LIST_PAGE_SIZE,
        sortBy: AGENT_LIST_SORT_BY,
        sortOrder: AGENT_LIST_SORT_ORDER,
      }),
    enabled: open,
  });

  const filteredAgents = useMemo(
    () => filterAgentsBySearch(agents, searchQuery),
    [agents, searchQuery],
  );

  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === selectedAgentId) ?? null,
    [agents, selectedAgentId],
  );

  const closeModal = useCallback(() => {
    if (isAssigning) {
      return;
    }

    onClose();
  }, [isAssigning, onClose]);

  const onSelectAgent = useCallback(
    (agent: AgentListItem) => {
      if (isAssigning) {
        return;
      }

      setSelectedAgentId(agent.id);
    },
    [isAssigning],
  );

  const onSearchChange = useCallback(
    (value: string) => {
      if (isAssigning) {
        return;
      }

      setSearchQuery(value);
    },
    [isAssigning],
  );

  const onClearSearch = useCallback(() => {
    if (isAssigning) {
      return;
    }

    setSearchQuery("");
  }, [isAssigning]);

  const onLoadMore = useCallback(() => {
    if (isAssigning || isFetching || !pagination?.hasNext) {
      return;
    }

    setPage((current) => current + 1);
  }, [isAssigning, isFetching, pagination?.hasNext]);

  const onContinue = useCallback(() => {
    if (isAssigning) {
      return;
    }

    if (!selectedAgentId) {
      toast.error(t("selectAgentRequiredTitle"), {
        description: t("selectAgentRequiredDescription"),
      });
      return;
    }

    onAssign(selectedAgentId);
  }, [isAssigning, onAssign, selectedAgentId, t, toast]);

  useEffect(() => {
    if (!open) {
      setPage(DEFAULT_AGENT_LIST_PAGE);
      setAgents([]);
      setPagination(null);
      setSelectedAgentId(null);
      setSearchQuery("");
    }
  }, [open]);

  useEffect(() => {
    if (!agentListPage) {
      return;
    }

    setPagination(agentListPage.pagination);
    const pageAgents = filterActiveAgents(agentListPage.agents);

    setAgents((previous) => {
      if (page === DEFAULT_AGENT_LIST_PAGE) {
        return pageAgents;
      }

      const existingIds = new Set(previous.map((agent) => agent.id));
      const nextAgents = pageAgents.filter((agent) => !existingIds.has(agent.id));

      return [...previous, ...nextAgents];
    });
  }, [agentListPage, page]);

  useEffect(() => {
    if (!isError) {
      return;
    }

    const apiError = error as unknown as ApiError;
    toast.error(t("fetchErrorTitle"), {
      description: apiError.message,
    });
  }, [error, isError, t, toast]);

  const isLoading = open && page === DEFAULT_AGENT_LIST_PAGE && isPending;
  const isLoadingMore = open && page > DEFAULT_AGENT_LIST_PAGE && isFetching;
  const isEmpty = !isLoading && !isError && agents.length === 0;
  const isSearchEmpty =
    !isLoading && !isError && agents.length > 0 && filteredAgents.length === 0;

  const isReassign = mode === "reassign";

  return {
    mode,
    title: t(isReassign ? "reassignTitle" : "title"),
    description: t(isReassign ? "reassignDescription" : "description", {
      title: listingTitle,
    }),
    agents: filteredAgents,
    totalAgentCount: agents.length,
    selectedAgentId,
    selectedAgent,
    searchQuery,
    isLoading,
    isLoadingMore,
    isAssigning,
    isEmpty,
    isSearchEmpty,
    isError,
    hasMore: Boolean(pagination?.hasNext),
    closeModal,
    onSelectAgent,
    onSearchChange,
    onClearSearch,
    onLoadMore,
    onContinue,
    continueLabel: t(isReassign ? "reassignAgent" : "assignAgent"),
    continueLoadingLabel: t(isReassign ? "reassigningLabel" : "assigningLabel"),
    loadMoreLabel: t("loadMore"),
    emptyTitle: t("emptyTitle"),
    emptyDescription: t("emptyDescription"),
    noSearchResultsTitle: t("noSearchResultsTitle"),
    noSearchResultsDescription: t("noSearchResultsDescription"),
    agentListAriaLabel: t("agentListAriaLabel"),
    searchPlaceholder: t("searchPlaceholder"),
    clearSearchLabel: tCommon("clearSearch"),
    agentCountLabel: t("agentCount", { count: agents.length }),
    selectHint: t("selectHint"),
    buildAgentAriaLabel: (agent: AgentListItem) =>
      t("agentOptionAriaLabel", {
        name: agent.fullName || agent.email,
      }),
  };
}

export type { UseAssignAgentModalParams };
export type { AssignAgentModalMode } from "../types/assignAgentModal.types";
