"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "@/src/hooks/useForm";
import { DEFAULT_SEARCH_CRITERIA_PARAMS } from "../constants/searchCriteriaFilter.constants";
import {
  useCreateSavedSearch,
  useUpdateSavedSearch,
} from "../mutations/saved-search.mutation";
import type {
  SavedSearchRecord,
  SaveSearchFormValues,
  SearchCriteriaParams,
} from "../types/savedSearch.types";
import { buildSaveSearchCriteria } from "../utils/buildSaveSearchCriteria";
import { parseSavedSearchCriteriaToParams } from "../utils/parseSavedSearchCriteriaToParams";
import { useSearchCriteriaFilters } from "./useSearchCriteriaFilters";

type UseSearchCriteriaFormParams = {
  onCancel?: () => void;
  record?: SavedSearchRecord;
};

export function useSearchCriteriaForm({
  onCancel,
  record,
}: UseSearchCriteriaFormParams) {
  const t = useTranslations("savedSearches");
  const isUpdateMode = Boolean(record?.id);

  const [filterParams, setFilterParams] = useState<SearchCriteriaParams>(() =>
    record
      ? parseSavedSearchCriteriaToParams(record.search_criteria)
      : { ...DEFAULT_SEARCH_CRITERIA_PARAMS },
  );

  const updateFilterParams = useCallback(
    (partial: Partial<SearchCriteriaParams>) => {
      setFilterParams((previous) => ({
        ...previous,
        ...partial,
      }));
    },
    [],
  );

  const onResetCriteria = useCallback(() => {
    if (record) {
      setFilterParams(parseSavedSearchCriteriaToParams(record.search_criteria));
      return;
    }

    setFilterParams({ ...DEFAULT_SEARCH_CRITERIA_PARAMS });
  }, [record]);

  const criteriaFields = useSearchCriteriaFilters({
    filterParams,
    updateFilterParams,
  });

  const { mutate: createSavedSearch, isPending: isCreating } =
    useCreateSavedSearch();
  const { mutate: updateSavedSearch, isPending: isUpdating } =
    useUpdateSavedSearch();

  const isSaving = isCreating || isUpdating;

  const { values, errors, handleChange, handleBlur, handleSubmit } =
    useForm<SaveSearchFormValues>({
      initialValues: { name: record?.name ?? "" },
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
      const searchCriteria = buildSaveSearchCriteria({
        status: criteriaFields.status,
        statusOptions: criteriaFields.statusOptions,
        category: criteriaFields.category,
        categoryOptions: criteriaFields.categoryOptions,
        type: criteriaFields.type,
        typeOptions: criteriaFields.typeOptions,
        location: criteriaFields.location,
        locationValue: criteriaFields.locationValue,
        locationOptions: criteriaFields.locationOptions,
        budgetMin: criteriaFields.budgetMin,
        budgetMax: criteriaFields.budgetMax,
        bedrooms: criteriaFields.bedrooms,
        rooms: criteriaFields.rooms,
        bathrooms: criteriaFields.bathrooms,
        parking: criteriaFields.parking,
        propertyAge: criteriaFields.propertyAge,
        floorLevel: criteriaFields.floorLevel,
        furnitureStatus: criteriaFields.furnitureStatus,
        minArea: criteriaFields.minArea,
        maxArea: criteriaFields.maxArea,
        minPlotArea: criteriaFields.minPlotArea,
        maxPlotArea: criteriaFields.maxPlotArea,
        governorate: criteriaFields.governorate,
        directorate: criteriaFields.directorate,
        village: criteriaFields.village,
        parcelName: criteriaFields.parcelName,
        selectedAmenities: criteriaFields.selectedAmenities,
      });

      const payload = {
        name: formValues.name.trim(),
        search_criteria: searchCriteria,
      };

      if (record?.id) {
        updateSavedSearch(
          { id: record.id, ...payload },
          {
            onSuccess: () => {
              onCancel?.();
            },
          },
        );
        return;
      }

      createSavedSearch(
        {
          ...payload,
          notification_enabled: true,
        },
        {
          onSuccess: () => {
            onCancel?.();
          },
        },
      );
    },
    [createSavedSearch, criteriaFields, onCancel, record?.id, updateSavedSearch],
  );

  return {
    criteriaFields,
    values,
    errors,
    handleChange,
    handleBlur,
    handleFormSubmit: handleSubmit(onFormSubmit),
    nameLabel: t("nameLabel"),
    namePlaceholder: t("namePlaceholder"),
    cancelLabel: t("cancel"),
    resetCriteriaLabel: t("criteria.resetCriteria"),
    saveLabel: isUpdateMode ? t("update") : t("save"),
    savingLabel: isUpdateMode ? t("updating") : t("saving"),
    isSaving,
    onCancel,
    onResetCriteria,
  };
}
