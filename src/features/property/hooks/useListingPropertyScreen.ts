"use client";

import type { ComponentProps } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import type { ListTableView, PinnedColumns, SortConfig } from "@abdoun/abdoun-library";
import {
  DEFAULT_MY_LISTING_COLUMN_VISIBILITY,
  isMyListingTableColumnVisible,
  MY_LISTING_COLUMN_I18N_KEY,
  MY_LISTING_TOGGLEABLE_COLUMN_IDS,
  type MyListingColumnVisibility,
  type MyListingToggleableColumnId,
} from "../constants/myListingTableColumns.constants";
import { mapAgentPropertyListItems } from "../mappers/agentPropertiesList.mapper";
import { buildMyListingTableColumns } from "../utils/buildMyListingTableColumns";
import { useGetAgentProperties } from "../mutations/property.mutation";
import type {
  AgentPropertiesListParams,
  AgentPropertyListItem,
  PaginationMeta,
} from "../types/property.types";

type LibraryPropertyListing = ComponentProps<typeof ListTableView>["data"][number];

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [10, 15, 20] as const;

function buildRequestParams(
  search: string,
  status: string,
  page = DEFAULT_PAGE,
  pageSize = DEFAULT_PAGE_SIZE,
): AgentPropertiesListParams {
  const trimmedSearch = search.trim();

  return {
    page,
    pageSize,
    ...(trimmedSearch ? { search: trimmedSearch } : {}),
    ...(status ? { status } : {}),
  };
}

function resolveLibraryLocale(locale: AppLocale): keyof LibraryPropertyListing["title"] {
  if (locale === "es") {
    return "esp";
  }

  return locale;
}

export function useListingPropertyScreen() {
  // 1. Router & navigation
  const router = useRouter();

  // 2. UI utilities
  const t = useTranslations("propertyList.myListings");
  const locale = useLocale() as AppLocale;

  // 4. Local state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortConfig, setSortConfig] = useState<SortConfig>([]);
  const [columnVisibility, setColumnVisibility] = useState<MyListingColumnVisibility>(
    () => ({ ...DEFAULT_MY_LISTING_COLUMN_VISIBILITY }),
  );
  const [listings, setListings] = useState<AgentPropertyListItem[] | null>(null);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | undefined>();
  const [requestParams, setRequestParams] = useState<AgentPropertiesListParams>(() =>
    buildRequestParams("", "", DEFAULT_PAGE, DEFAULT_PAGE_SIZE),
  );

  // 5. Data fetching / queries
  const { mutate: getAgentProperties, isPending: isLoadingAgentProperties } =
    useGetAgentProperties();

  const fetchAgentProperties = useCallback(
    (params: AgentPropertiesListParams) => {
      setRequestParams(params);
      getAgentProperties(params, {
        onSuccess: (response) => {
          const data = response.data;
          setListings(data?.items ?? []);
          setPaginationMeta(
            response.meta?.pagination ??
              (data
                ? {
                    total: data.total,
                    page: data.page,
                    pageSize: data.pageSize,
                    totalPages: data.totalPages,
                    hasNext: data.hasNext,
                    hasPrevious: data.hasPrevious,
                  }
                : undefined),
          );
        },
      });
    },
    [getAgentProperties],
  );

  // 6. Derived / memoized values
  const tableListings = useMemo(
    () => mapAgentPropertyListItems(listings ?? []),
    [listings],
  );

  const tableLocale = useMemo(() => resolveLibraryLocale(locale), [locale]);

  const pagination = useMemo(
    () => ({
      total: paginationMeta?.total ?? 0,
      page,
      pageSize,
      pageOptions: [...PAGE_SIZE_OPTIONS],
      totalPages: paginationMeta?.totalPages,
      hasNext: paginationMeta?.hasNext,
      hasPrevious: paginationMeta?.hasPrevious,
      maxPageButtons: 5,
      isLoading: isLoadingAgentProperties,
      onPageChange: (nextPage: number) => setPage(nextPage),
      onPageSizeChange: (nextPageSize: number) => {
        setPage(1);
        setPageSize(nextPageSize);
      },
    }),
    [
      isLoadingAgentProperties,
      page,
      pageSize,
      paginationMeta?.hasNext,
      paginationMeta?.hasPrevious,
      paginationMeta?.total,
      paginationMeta?.totalPages,
    ],
  );

  const noDataFound = useMemo(
    () => ({
      title: t("noDataTitle"),
      description: t("noDataDescription"),
    }),
    [t],
  );

  const workflowActions = useMemo(
    () => ({
      view: {
        label: t("workflow.view"),
        onClick: (listing: LibraryPropertyListing) => {
          router.push(`/property-update?property_id=${listing.property_id}`);
        },
      },
      continue: {
        label: t("workflow.continue"),
        onClick: (listing: LibraryPropertyListing) => {
          router.push(`/property-update?property_id=${listing.property_id}`);
        },
      },
    }),
    [router, t],
  );

  const onClickProperty = useCallback(
    (listing: LibraryPropertyListing) => {
      router.push(`/property-update?property_id=${listing.property_id}`);
    },
    [router],
  );

  const allColumns = useMemo(
    () =>
      buildMyListingTableColumns({
        labels: {
          propertyName: t("columns.propertyName"),
          reference: t("columns.reference"),
          status: t("columns.status"),
          submittedOn: t("columns.submittedOn"),
          submittedOnEmpty: t("columns.submittedOnEmpty"),
        },
        tableLocale,
        appLocale: locale,
        onClick: onClickProperty,
        workflowActions,
      }),
    [locale, onClickProperty, t, tableLocale, workflowActions],
  );

  const columns = useMemo(
    () =>
      allColumns.filter((column) =>
        isMyListingTableColumnVisible(column.id, columnVisibility),
      ),
    [allColumns, columnVisibility],
  );

  const activeSortConfig = useMemo(
    () =>
      sortConfig.filter((rule) =>
        isMyListingTableColumnVisible(rule.id, columnVisibility),
      ),
    [columnVisibility, sortConfig],
  );

  const pinnedColumns = useMemo(
    (): PinnedColumns => ({
      left: ["title"],
      right: ["actions"],
    }),
    [],
  );

  const columnOptions = useMemo(
    () =>
      MY_LISTING_TOGGLEABLE_COLUMN_IDS.map((id) => ({
        id,
        label: t(`columns.${MY_LISTING_COLUMN_I18N_KEY[id]}`),
        visible: columnVisibility[id],
      })),
    [columnVisibility, t],
  );

  // 7. Callbacks
  const onSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(DEFAULT_PAGE);
  }, []);

  const onStatusChange = useCallback((value: string) => {
    setStatus(value);
    setPage(DEFAULT_PAGE);
  }, []);

  const onSort = useCallback((next: SortConfig) => {
    setSortConfig(next);
  }, []);

  const onColumnVisibilityChange = useCallback(
    (columnId: MyListingToggleableColumnId, visible: boolean) => {
      setColumnVisibility((previous) => ({ ...previous, [columnId]: visible }));

      if (!visible) {
        setSortConfig((previous) => previous.filter((rule) => rule.id !== columnId));
      }
    },
    [],
  );

  // 9. Effects
  useEffect(() => {
    fetchAgentProperties(buildRequestParams(search, status, page, pageSize));
  }, [fetchAgentProperties, page, pageSize, search, status]);

  // 10. Return values
  return {
    listings,
    tableListings,
    paginationMeta,
    requestParams,
    filters: {
      search,
      status,
      onSearchChange,
      onStatusChange,
      columnOptions,
      onColumnVisibilityChange,
    },
    sortConfig: activeSortConfig,
    onSort,
    tableLocale,
    pagination,
    noDataFound,
    workflowActions,
    onClickProperty,
    columns,
    pinnedColumns,
    listTitle: t("pageTitle"),
    isLoading: listings === null || isLoadingAgentProperties,
    fetchAgentProperties,
  };
}
