"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useForm } from "@/src/hooks/useForm";
import type {
  SaveSearchFilterItem,
  SaveSearchFormValues,
} from "../types/savedSearch.types";

export type { SaveSearchFormValues };

type UseSaveSearchFormParams = {
  filterItems: SaveSearchFilterItem[];
  initialName?: string;
  mode?: "create" | "update";
  onCancel: () => void;
  onSubmit: (values: SaveSearchFormValues) => void;
};

export function useSaveSearchForm({
  filterItems,
  initialName = "",
  mode = "create",
  onCancel,
  onSubmit,
}: UseSaveSearchFormParams) {
  const t = useTranslations("savedSearches");
  const isUpdateMode = mode === "update";

  const { values, errors, handleChange, handleBlur, handleSubmit } =
    useForm<SaveSearchFormValues>({
      initialValues: { name: initialName },
      validate: (formValues) => {
        const nextErrors: Partial<Record<keyof SaveSearchFormValues, string>> =
          {};

        if (!formValues.name.trim()) {
          nextErrors.name = t("nameRequired");
        }

        return nextErrors;
      },
    });

  const onFormSubmit = useCallback(
    (formValues: SaveSearchFormValues) => {
      onSubmit({ name: formValues.name.trim() });
    },
    [onSubmit],
  );

  return {
    values,
    errors,
    handleChange,
    handleBlur,
    handleFormSubmit: handleSubmit(onFormSubmit),
    onCancel,
    nameLabel: t("nameLabel"),
    namePlaceholder: t("namePlaceholder"),
    cancelLabel: t("cancel"),
    saveLabel: isUpdateMode ? t("updateSearch") : t("save"),
    savingLabel: isUpdateMode ? t("updating") : t("saving"),
    filterItems,
    filtersHeading: t("filtersHeading"),
    noFiltersSelected: t("noFiltersSelected"),
  };
}
