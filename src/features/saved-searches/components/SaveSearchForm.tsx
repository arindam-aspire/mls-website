"use client";

import { Bookmark, Save } from "lucide-react";
import { Button, Input } from "@/src/components/ui";
import { SaveSearchFiltersSummary } from "./SaveSearchFiltersSummary";
import { useSaveSearchForm } from "../hooks/useSaveSearchForm";
import type {
  SaveSearchFilterItem,
  SaveSearchFormValues,
} from "../types/savedSearch.types";

export type { SaveSearchFormValues };

type SaveSearchFormProps = {
  filterItems: SaveSearchFilterItem[];
  initialName?: string;
  mode?: "create" | "update";
  onCancel: () => void;
  onSubmit: (values: SaveSearchFormValues) => void;
  isLoading?: boolean;
};

export function SaveSearchForm({
  filterItems,
  initialName = "",
  mode = "create",
  onCancel,
  onSubmit,
  isLoading = false,
}: SaveSearchFormProps) {
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleFormSubmit,
    onCancel: handleCancel,
    nameLabel,
    namePlaceholder,
    cancelLabel,
    saveLabel,
    savingLabel,
    filtersHeading,
    noFiltersSelected,
  } = useSaveSearchForm({
    filterItems,
    initialName,
    mode,
    onCancel,
    onSubmit,
  });

  return (
    <form
      className="flex w-full min-w-0 flex-col gap-4"
      onSubmit={handleFormSubmit}
      noValidate
    >
      <Input
        name="name"
        type="text"
        autoComplete="off"
        size="lg"
        label={nameLabel}
        placeholder={namePlaceholder}
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        iconStart={<Bookmark className="size-4" aria-hidden />}
        isRequired
      />

      <SaveSearchFiltersSummary
        items={filterItems}
        heading={filtersHeading}
        emptyMessage={noFiltersSelected}
      />

      <div className="flex flex-row flex-wrap justify-end gap-3 pt-2">
        <Button
          type="button"
          color="secondary"
          variant="ghost"
          size="md"
          onClick={handleCancel}
          disabled={isLoading}
        >
          {cancelLabel}
        </Button>
        <Button
          type="submit"
          color="primary"
          variant="solid"
          size="md"
          iconStart={<Save className="size-4" aria-hidden />}
          isLoading={isLoading}
          loadingLabel={savingLabel}
        >
          {saveLabel}
        </Button>
      </div>
    </form>
  );
}
