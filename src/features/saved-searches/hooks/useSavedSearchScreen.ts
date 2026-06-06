"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getPathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import {
  savedSearchListParams,
  useDeleteSavedSearch,
  useGetSavedSearches,
} from "../mutations/saved-search.mutation";
import type { SavedSearchRecord } from "../types/savedSearch.types";
import { buildSavedSearchPropertyListHref } from "../utils/buildSavedSearchPropertyListHref";

const PROPERTY_LIST_PATH = "/property-list";

export function useSavedSearchScreen() {
  const t = useTranslations("savedSearches");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SavedSearchRecord | null>(
    null,
  );

  const { data, isPending, isFetching, isError } = useGetSavedSearches(
    savedSearchListParams,
  );

  const { mutate: deleteSavedSearch } = useDeleteSavedSearch();

  const items = useMemo(() => data?.data?.items ?? [], [data?.data?.items]);

  const isLoading = isPending || isFetching;

  const onRunSearch = useCallback(
    (record: SavedSearchRecord) => {
      const href = buildSavedSearchPropertyListHref(record);
      const url = getPathname({ locale, href });

      window.open(url, "_blank", "noopener,noreferrer");
    },
    [locale],
  );

  const onDeleteSearch = useCallback(
    (record: SavedSearchRecord) => {
      setDeletingId(record.id);

      deleteSavedSearch(record.id, {
        onSettled: () => {
          setDeletingId(null);
        },
      });
    },
    [deleteSavedSearch],
  );

  const onAddSearchCriteria = useCallback(() => {
    router.push(PROPERTY_LIST_PATH);
  }, [router]);

  const openAddModal = useCallback(() => {
    setEditingRecord(null);
    setIsFormModalOpen(true);
  }, []);

  const openEditModal = useCallback((record: SavedSearchRecord) => {
    setEditingRecord(record);
    setIsFormModalOpen(true);
  }, []);

  const closeFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setEditingRecord(null);
  }, []);

  return {
    title: t("pageTitle"),
    subtitle: t("pageSubtitle"),
    items,
    isLoading,
    isError,
    deletingId,
    emptyTitle: t("pageEmptyTitle"),
    emptyDescription: t("pageEmptyDescription"),
    addSearchCriteriaLabel: t("popoverAddSearchCriteria"),
    addNewLabel: t("addNew"),
    addNewModalTitle: t("addNewModalTitle"),
    loadErrorMessage: t("pageLoadError"),
    runLabel: t("runSearch"),
    editLabel: t("editSearch"),
    deleteLabel: t("deleteSearch"),
    formModalTitle: editingRecord
      ? t("modalUpdateTitle")
      : t("addNewModalTitle"),
    addModal: {
      open: isFormModalOpen,
      onOpen: openAddModal,
      onClose: closeFormModal,
      record: editingRecord ?? undefined,
    },
    onRunSearch,
    onEditSearch: openEditModal,
    onDeleteSearch,
    onAddSearchCriteria,
  };
}
