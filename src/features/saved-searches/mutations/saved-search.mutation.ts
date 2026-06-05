"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useToast } from "@/src/hooks/useToast";
import {
  SAVED_SEARCH_LIST_PAGE,
  SAVED_SEARCH_LIST_PAGE_SIZE,
  SAVED_SEARCH_POPOVER_PAGE,
  SAVED_SEARCH_POPOVER_PAGE_SIZE,
  SAVED_SEARCHES_QUERY_KEY,
} from "../constants/savedSearch.constants";
import {
  createSavedSearch,
  deleteSavedSearch,
  getSavedSearchById,
  getSavedSearches,
  updateSavedSearch,
} from "../services/saved-search.service";
import type {
  SavedSearchCriteria,
  SavedSearchListParams,
} from "../types/savedSearch.types";

export function useGetSavedSearches(
  params: SavedSearchListParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [SAVED_SEARCHES_QUERY_KEY, params.page, params.pageSize],
    queryFn: () => getSavedSearches(params),
    enabled: options?.enabled ?? true,
  });
}

export function useGetSavedSearch(
  id: string | undefined,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: [SAVED_SEARCHES_QUERY_KEY, "detail", id],
    queryFn: () => getSavedSearchById(id!),
    enabled: Boolean(id) && (options?.enabled ?? true),
  });
}

export function useCreateSavedSearch() {
  const t = useTranslations("savedSearches");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSavedSearch,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [SAVED_SEARCHES_QUERY_KEY] });
      toast.success(t("saveSuccessTitle"), {
        description: t("saveSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("saveErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useUpdateSavedSearch() {
  const t = useTranslations("savedSearches");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      name,
      search_criteria,
    }: {
      id: string;
      name: string;
      search_criteria: SavedSearchCriteria;
    }) => updateSavedSearch(id, { name, search_criteria }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [SAVED_SEARCHES_QUERY_KEY] });
      toast.success(t("updateSuccessTitle"), {
        description: t("updateSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("updateErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export function useDeleteSavedSearch() {
  const t = useTranslations("savedSearches");
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSavedSearch(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [SAVED_SEARCHES_QUERY_KEY] });
      toast.success(t("deleteSuccessTitle"), {
        description: t("deleteSuccessDescription"),
      });
    },
    onError: (error: ApiError) => {
      toast.error(t("deleteErrorTitle"), {
        description: error.message,
      });
    },
  });
}

export const savedSearchPopoverListParams = {
  page: SAVED_SEARCH_POPOVER_PAGE,
  pageSize: SAVED_SEARCH_POPOVER_PAGE_SIZE,
} as const;

export const savedSearchListParams = {
  page: SAVED_SEARCH_LIST_PAGE,
  pageSize: SAVED_SEARCH_LIST_PAGE_SIZE,
} as const;
