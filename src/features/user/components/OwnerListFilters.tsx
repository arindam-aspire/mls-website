"use client";

import { CheckboxField, SearchInput, SelectDropdown } from "@/src/components/ui";
import { iconButtonSizeClasses } from "@/src/components/ui/responsiveSizes";
import { Popover, PopoverButton, PopoverPanel } from "@/src/components/ui/popover";
import {
  OWNER_LIST_STATUS_FILTER_VALUES,
  type OwnerListStatusFilterValue,
} from "@/src/features/user/constants/ownerListStatusFilters.constants";
import type { OwnerListToggleableColumnId } from "@/src/features/user/constants/ownerListTableColumns.constants";
import { buildOwnerListStatusFilterLabels } from "@/src/features/user/i18n/buildOwnerListStatusFilterLabels";
import { cn } from "@/src/lib/cn";
import { TableProperties } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

const searchFieldClassName = "w-full sm:max-w-sm md:max-w-md";
const statusFieldClassName =
  "w-full min-w-0 flex-1 sm:w-auto sm:min-w-[11.5rem] md:min-w-[13rem] lg:min-w-[14.5rem]";

export type OwnerListColumnOption = {
  id: OwnerListToggleableColumnId;
  label: string;
  visible: boolean;
};

export type OwnerListFiltersProps = {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  columnOptions: OwnerListColumnOption[];
  onColumnVisibilityChange: (
    columnId: OwnerListToggleableColumnId,
    visible: boolean,
  ) => void;
  showSearch?: boolean;
  statusFilterValues?: readonly string[];
  className?: string;
};

export function OwnerListFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  columnOptions,
  onColumnVisibilityChange,
  showSearch = true,
  statusFilterValues = OWNER_LIST_STATUS_FILTER_VALUES,
  className,
}: OwnerListFiltersProps) {
  const tCommon = useTranslations("common");
  const tList = useTranslations("user.owners.list");
  const tStatus = useTranslations("user.owners.list.statusFilter");

  const statusLabels = useMemo(() => buildOwnerListStatusFilterLabels(tStatus), [tStatus]);

  const statusOptions = useMemo(
    () =>
      statusFilterValues.map((value) => ({
        value,
        label: statusLabels[value as OwnerListStatusFilterValue],
      })),
    [statusFilterValues, statusLabels],
  );

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-2 md:gap-4 lg:gap-6 mb-2 sm:!mb-2 md:!mb-4 lg:!mb-6",
        className,
      )}
    >
      {showSearch ? (
        <SearchInput
          fullWidth={false}
          className={cn(searchFieldClassName)}
          placeholder={tList("searchPlaceholder")}
          aria-label={tList("searchPlaceholder")}
          clearLabel={tCommon("clearSearch")}
          size="md"
          value={search}
          onChange={(event) => {
            onSearchChange(event.target.value);
          }}
          onClear={() => {
            onSearchChange("");
          }}
        />
      ) : (
        <div className="hidden sm:block sm:flex-1" aria-hidden />
      )}

      <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:shrink-0">
        <SelectDropdown
          fullWidth={false}
          className={cn(statusFieldClassName)}
          placeholder={statusLabels.all}
          aria-label={statusLabels.ariaLabel}
          value={status}
          options={statusOptions}
          onChange={onStatusChange}
          variant="outline"
          size="md"
        />

        <Popover className="relative hidden shrink-0 md:block">
          <PopoverButton
            type="button"
            aria-label={tList("columnPickerAriaLabel")}
            className={cn(
              iconButtonSizeClasses.md,
              "shrink-0 rounded-lg border border-secondary/15 bg-surface text-text shadow-none",
              "hover:bg-page data-active:bg-page data-open:bg-page",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
            )}
          >
            <TableProperties className="size-4 shrink-0" aria-hidden />
          </PopoverButton>

          <PopoverPanel
            anchor="bottom end"
            className="w-auto min-w-[17.5rem] max-w-[calc(100vw-2rem)] p-4 sm:min-w-[19rem]"
          >
            <p className="mb-4 text-sm font-semibold text-text">
              {tList("columnPickerTitle")}
            </p>

            <div
              className="grid grid-cols-2 gap-x-6 gap-y-3.5"
              role="group"
              aria-label={tList("columnPickerAriaLabel")}
            >
              {columnOptions.map((column) => (
                <CheckboxField
                  key={column.id}
                  label={column.label}
                  checked={column.visible}
                  onChange={(visible) => {
                    onColumnVisibilityChange(column.id, visible);
                  }}
                />
              ))}
            </div>
          </PopoverPanel>
        </Popover>
      </div>
    </div>
  );
}
