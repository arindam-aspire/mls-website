"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";
import {
  useCreateSavedSearch,
  useUpdateSavedSearch,
} from "../mutations/saved-search.mutation";
import type {
  SavedSearchCriteria,
  SaveSearchFormValues,
} from "../types/savedSearch.types";

type UseSaveSearchModalParams = {
  onClose: () => void;
  searchCriteria: SavedSearchCriteria;
  savedSearchId?: string;
};

export function useSaveSearchModal({
  onClose,
  searchCriteria,
  savedSearchId,
}: UseSaveSearchModalParams) {
  const t = useTranslations("savedSearches");
  const isUpdateMode = Boolean(savedSearchId);
  const { mutate: createSavedSearch, isPending: isCreating } =
    useCreateSavedSearch();
  const { mutate: updateSavedSearch, isPending: isUpdating } =
    useUpdateSavedSearch();

  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSave = useCallback(
    (values: SaveSearchFormValues) => {
      if (savedSearchId) {
        updateSavedSearch(
          {
            id: savedSearchId,
            name: values.name,
            search_criteria: searchCriteria,
          },
          {
            onSuccess: () => {
              onClose();
            },
          },
        );
        return;
      }

      createSavedSearch(
        {
          name: values.name,
          search_criteria: searchCriteria,
          notification_enabled: true,
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    },
    [createSavedSearch, onClose, savedSearchId, searchCriteria, updateSavedSearch],
  );

  return {
    title: isUpdateMode ? t("modalUpdateTitle") : t("modalTitle"),
    description: isUpdateMode
      ? t("modalUpdateDescription")
      : t("modalDescription"),
    closeModal,
    handleSave,
    isSaving: isCreating || isUpdating,
    isUpdateMode,
  };
}
