"use client";

import { CheckboxField, SearchInput, SelectDropdown } from "@/src/components/ui";
import { iconButtonSizeClasses } from "@/src/components/ui/responsiveSizes";
import { Popover, PopoverButton, PopoverPanel } from "@/src/components/ui/popover";
import { MY_LISTING_STATUS_FILTER_VALUES } from "@/src/features/property/constants/myListingStatusFilters.constants";
import type { MyListingToggleableColumnId } from "@/src/features/property/constants/myListingTableColumns.constants";
import { cn } from "@/src/lib/cn";
import { TableProperties } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

const searchFieldClassName = "w-full sm:max-w-sm md:max-w-md";
const statusFieldClassName =
  "w-full min-w-0 flex-1 sm:w-auto sm:min-w-[11.5rem] md:min-w-[13rem] lg:min-w-[14.5rem]";

export type MyListingColumnOption = {
  id: MyListingToggleableColumnId;
  label: string;
  visible: boolean;
};

export type MyListingFiltersProps = {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  columnOptions: MyListingColumnOption[];
  onColumnVisibilityChange: (
    columnId: MyListingToggleableColumnId,
    visible: boolean,
  ) => void;
};

export function MyListingFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  columnOptions,
  onColumnVisibilityChange,
}: MyListingFiltersProps) {
  const tCommon = useTranslations("common");
  const t = useTranslations("propertyList.myListings");
  const tStatus = useTranslations("propertyList.myListings.statusFilter");

  const statusOptions = useMemo(
    () =>
      MY_LISTING_STATUS_FILTER_VALUES.map((value) => ({
        value,
        label: tStatus(value),
      })),
    [tStatus],
  );

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <SearchInput
        fullWidth={false}
        className={cn(searchFieldClassName)}
        placeholder={tCommon("searchPlaceholder")}
        aria-label={tCommon("searchPlaceholder")}
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

      <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:shrink-0">
        <SelectDropdown
          fullWidth={false}
          className={cn(statusFieldClassName)}
          placeholder={tStatus("all")}
          aria-label={tStatus("ariaLabel")}
          value={status}
          options={statusOptions}
          onChange={onStatusChange}
          variant="outline"
          size="md"
        />

        <Popover className="relative shrink-0">
          <PopoverButton
            type="button"
            aria-label={t("columnPickerAriaLabel")}
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
            <p className="mb-4 text-sm font-semibold text-text">{t("columnPickerTitle")}</p>

            <div
              className="grid grid-cols-2 gap-x-6 gap-y-3.5"
              role="group"
              aria-label={t("columnPickerAriaLabel")}
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
