"use client";

import { SearchInput, SelectDropdown } from "@/src/components/ui";
import { IconButton } from "@/src/components/ui/icon-button";
import { MY_LISTING_STATUS_FILTER_VALUES } from "@/src/features/property/constants/myListingStatusFilters.constants";
import { cn } from "@/src/lib/cn";
import { TableProperties } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

const searchFieldClassName = "w-full sm:max-w-sm md:max-w-md";
const statusFieldClassName =
  "w-full min-w-0 flex-1 sm:w-auto sm:min-w-[11.5rem] md:min-w-[13rem] lg:min-w-[14.5rem]";

export type MyListingFiltersProps = {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export function MyListingFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
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

        <IconButton
          type="button"
          icon={<TableProperties className="size-4" aria-hidden />}
          aria-label={t("tableViewAriaLabel")}
          color="inherit"
          variant="outline"
          size="md"
          className="shrink-0 rounded-lg"
        />
      </div>
    </div>
  );
}
