"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Owner, OwnerWorkflowActionsConfig, SortConfig } from "@abdoun/abdoun-library";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { getAgencyList } from "@/src/features/profile/services/profile.service";
import { useToast } from "@/src/hooks/useToast";
import { UserRole } from "@/src/lib/auth/roles";
import {
  DEFAULT_OWNER_LIST_PAGE,
  DEFAULT_OWNER_LIST_PAGE_SIZE,
} from "../constants/ownerList.constants";
import {
  OWNER_LIST_COLUMN_I18N_KEY,
  OWNER_LIST_TOGGLEABLE_COLUMN_IDS,
  DEFAULT_OWNER_LIST_COLUMN_VISIBILITY,
  resolveOwnerListColumnVisibility,
  type OwnerListColumnVisibility,
  type OwnerListToggleableColumnId,
} from "../constants/ownerListTableColumns.constants";
import { buildOwnerListColumnLabels } from "../i18n/buildOwnerListColumnLabels";
import type { OwnerListRow } from "../mappers/mapOwnerListItemToLibraryOwner";
import { mapOwnerListItemsToLibraryOwners } from "../mappers/mapOwnerListItemToLibraryOwner";
import { assignOwnerAgency, getOwnerList, getPlatformOwnerList } from "../services/owner.service";
import {
  buildOwnerListGridHiddenColumnIds,
  buildOwnerListRequestParams,
  buildOwnerListTableColumns,
  resolveOwnerListPinnedColumns,
} from "../utils";
import { useOwnerEditModal } from "./useOwnerEditModal";
import { useOwnerLinkedResourcesModal } from "./useOwnerLinkedResourcesModal";
import { useOwnerStatusConfirm } from "./useOwnerStatusConfirm";
import { useOwnerViewModal } from "./useOwnerViewModal";

export function useOwnersScreen() {
  const t = useTranslations("user");
  const tColumns = useTranslations("user.owners.list.columns");
  const tWorkflow = useTranslations("user.owners.list.workflow");
  const tAssignment = useTranslations("user.owners.assignment");
  const toast = useToast();
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);
  const agencyId = user?.agency?.agency_id?.trim() ?? "";
  const isSuperAdmin = Boolean(user?.roles?.some((role) => role.name === UserRole.SUPER_ADMIN));

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [assignmentAgencyId, setAssignmentAgencyId] = useState("");
  const [page, setPage] = useState(DEFAULT_OWNER_LIST_PAGE);
  const [sortConfig, setSortConfig] = useState<SortConfig>([]);
  const [columnVisibility, setColumnVisibility] = useState<OwnerListColumnVisibility>(
    DEFAULT_OWNER_LIST_COLUMN_VISIBILITY,
  );

  const ownerStatusConfirm = useOwnerStatusConfirm();
  const { openConfirm: openOwnerStatusConfirm, confirmModal: ownerStatusConfirmModal } =
    ownerStatusConfirm;
  const ownerViewModal = useOwnerViewModal();
  const { openModal: openOwnerViewModal, ...ownerViewModalProps } = ownerViewModal;
  const ownerEditModal = useOwnerEditModal();
  const { openModal: openOwnerEditModal, modal: ownerEditModalState } = ownerEditModal;
  const ownerLinkedResourcesModal = useOwnerLinkedResourcesModal();
  const {
    openProperties: openOwnerLinkedProperties,
    openLeads: openOwnerLinkedLeads,
    ...ownerLinkedResourcesModalProps
  } = ownerLinkedResourcesModal;

  const listRequestParams = useMemo(
    () =>
      buildOwnerListRequestParams({
        page,
        pageSize: DEFAULT_OWNER_LIST_PAGE_SIZE,
        search,
        statusFilter: status,
      }),
    [page, search, status],
  );

  const {
    data: ownerListData,
    isPending: isOwnerListLoading,
    isFetching: isOwnerListFetching,
    isError: isOwnerListError,
    error: ownerListError,
  } = useQuery({
    queryKey: ["owners", "list", isSuperAdmin ? "platform" : agencyId, listRequestParams],
    queryFn: () =>
      isSuperAdmin
        ? getPlatformOwnerList(listRequestParams)
        : getOwnerList(agencyId, listRequestParams),
    enabled: isSuperAdmin || agencyId.length > 0,
  });

  const { data: agencyListData, isFetching: isAgencyListFetching } = useQuery({
    queryKey: ["agency", "owner-assignment-list"],
    queryFn: () => getAgencyList({ skip: 0, limit: 100 }),
    enabled: isSuperAdmin,
  });

  const agencyOptions = useMemo(
    () =>
      (agencyListData?.items ?? [])
        .filter((agency) => agency.is_active && agency.is_verified)
        .map((agency) => ({
          value: agency.id,
          label: agency.agency_name,
        })),
    [agencyListData?.items],
  );

  const assignOwnerMutation = useMutation({
    mutationFn: (ownerId: string) => assignOwnerAgency(ownerId, assignmentAgencyId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["owners", "list"] });
      toast.success(tAssignment("assignSuccessTitle"), {
        description: tAssignment("assignSuccessDescription"),
      });
    },
    onError: (error: Error) => {
      toast.error(tAssignment("assignErrorTitle"), { description: error.message });
    },
  });

  const onViewOwner = useCallback(
    (owner: OwnerListRow) => {
      openOwnerViewModal(owner);
    },
    [openOwnerViewModal],
  );

  const onEditOwner = useCallback(
    (owner: OwnerListRow) => {
      openOwnerEditModal(owner);
    },
    [openOwnerEditModal],
  );

  const onActivateOwner = useCallback(
    (owner: OwnerListRow) => {
      openOwnerStatusConfirm(owner, "activate");
    },
    [openOwnerStatusConfirm],
  );

  const onDeactivateOwner = useCallback(
    (owner: OwnerListRow) => {
      openOwnerStatusConfirm(owner, "deactivate");
    },
    [openOwnerStatusConfirm],
  );

  const onLinkedPropertiesClick = useCallback(
    (owner: OwnerListRow) => {
      openOwnerLinkedProperties(owner);
    },
    [openOwnerLinkedProperties],
  );

  const onLinkedLeadsClick = useCallback(
    (owner: OwnerListRow) => {
      openOwnerLinkedLeads(owner);
    },
    [openOwnerLinkedLeads],
  );

  const workflowHandlers = useMemo(
    () => ({
      onView: onViewOwner,
      onEdit: onEditOwner,
      onActivate: onActivateOwner,
      onDeactivate: onDeactivateOwner,
      onLinkedPropertiesClick,
      onLinkedLeadsClick,
    }),
    [
      onActivateOwner,
      onDeactivateOwner,
      onEditOwner,
      onLinkedLeadsClick,
      onLinkedPropertiesClick,
      onViewOwner,
    ],
  );

  const actionLabels = useMemo(
    () => ({
      view: tWorkflow("view"),
      edit: tWorkflow("edit"),
      activate: tWorkflow("activate"),
      deactivate: tWorkflow("deactivate"),
      actionsAriaLabel: tWorkflow("actionsAriaLabel"),
    }),
    [tWorkflow],
  );

  /** Library mobile menu only supports activate/suspend/delete ids. */
  const libraryWorkflowActions = useMemo<OwnerWorkflowActionsConfig>(
    () => ({
      activate: (owner: Owner) => onActivateOwner(owner as OwnerListRow),
      suspend: (owner: Owner) => onDeactivateOwner(owner as OwnerListRow),
    }),
    [onActivateOwner, onDeactivateOwner],
  );

  const onSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(DEFAULT_OWNER_LIST_PAGE);
  }, []);

  const onStatusChange = useCallback((value: string) => {
    setStatus(value);
    setPage(DEFAULT_OWNER_LIST_PAGE);
  }, []);

  const onPageChange = useCallback((nextPage: number) => {
    setPage(nextPage);
  }, []);

  const onSort = useCallback((next: SortConfig) => {
    setSortConfig(next);
  }, []);

  const onColumnVisibilityChange = useCallback(
    (columnId: OwnerListToggleableColumnId, visible: boolean) => {
      setColumnVisibility((previous) =>
        resolveOwnerListColumnVisibility({
          ...previous,
          [columnId]: visible,
        }),
      );

      if (!visible) {
        const libraryColumnId =
          columnId === "properties"
            ? "propertyOwned"
            : columnId === "leads"
              ? "leadsLinked"
              : columnId;

        setSortConfig((previous) =>
          previous.filter((rule) => rule.id !== libraryColumnId),
        );
      }
    },
    [],
  );

  const columnLabels = useMemo(() => buildOwnerListColumnLabels(tColumns), [tColumns]);

  const columnOptions = useMemo(() => {
    const visibility = resolveOwnerListColumnVisibility(columnVisibility);

    return OWNER_LIST_TOGGLEABLE_COLUMN_IDS.map((id) => ({
      id,
      label: columnLabels[OWNER_LIST_COLUMN_I18N_KEY[id]],
      visible: visibility[id],
    }));
  }, [columnLabels, columnVisibility]);

  const tableOwners = useMemo(
    () => mapOwnerListItemsToLibraryOwners(ownerListData?.owners ?? []),
    [ownerListData?.owners],
  );

  const columns = useMemo(
    () =>
      buildOwnerListTableColumns({
        labels: columnLabels,
        actionLabels,
        columnVisibility,
        handlers: workflowHandlers,
        emptyValue: t("owners.list.emptyValue"),
      }),
    [actionLabels, columnLabels, columnVisibility, t, workflowHandlers],
  );

  const pinnedColumns = useMemo(
    () => resolveOwnerListPinnedColumns(columns.map((column) => column.id)),
    [columns],
  );

  const activeSortConfig = useMemo(
    () =>
      sortConfig.filter((rule) =>
        columns.some((column) => column.id === rule.id && column.sortable),
      ),
    [columns, sortConfig],
  );

  const pagination = useMemo(() => {
    const meta = ownerListData?.pagination;

    if (!meta) {
      return undefined;
    }

    return {
      total: meta.total,
      page: meta.page,
      pageSize: meta.pageSize,
      totalPages: meta.totalPages,
      hasNext: meta.hasNext,
      hasPrevious: meta.hasPrevious,
      maxPageButtons: 5,
      isLoading: isOwnerListFetching,
      onPageChange,
    };
  }, [ownerListData?.pagination, isOwnerListFetching, onPageChange]);

  const gridHiddenColumnIds = useMemo(
    () => buildOwnerListGridHiddenColumnIds(columnVisibility),
    [columnVisibility],
  );

  const noDataFound = useMemo(
    () => ({
      title: t("owners.list.noDataTitle"),
      description: t("owners.list.noDataDescription"),
    }),
    [t],
  );

  const assignOwnerToSelectedAgency = useCallback(
    (ownerId: string) => {
      if (!assignmentAgencyId) {
        toast.error(tAssignment("selectAgencyErrorTitle"), {
          description: tAssignment("selectAgencyErrorDescription"),
        });
        return;
      }
      assignOwnerMutation.mutate(ownerId);
    },
    [assignOwnerMutation, assignmentAgencyId, tAssignment, toast],
  );

  useEffect(() => {
    if (!isOwnerListError) {
      return;
    }

    const apiError = ownerListError as unknown as ApiError;
    const isForbidden = apiError.code === "FORBIDDEN";

    toast.error(
      isForbidden
        ? t("owners.list.forbiddenErrorTitle")
        : t("owners.list.fetchErrorTitle"),
      {
        description: apiError.message,
      },
    );
  }, [ownerListError, isOwnerListError, t, toast]);

  return {
    pageTitle: t("owners.pageTitle"),
    pageSubtitle: t("owners.pageSubtitle"),
    isSuperAdmin,
    assignment: {
      title: tAssignment("title"),
      description: tAssignment("description"),
      agencyLabel: tAssignment("agencyLabel"),
      agencyPlaceholder: isAgencyListFetching
        ? tAssignment("agencyLoadingPlaceholder")
        : tAssignment("agencyPlaceholder"),
      assignLabel: tAssignment("assign"),
      ownerColumnLabel: tAssignment("ownerColumn"),
      agenciesColumnLabel: tAssignment("agenciesColumn"),
      actionColumnLabel: tAssignment("actionColumn"),
      refreshingLabel: tAssignment("refreshing"),
      ownersOnPageLabel: tAssignment("ownersOnPage", {
        count: ownerListData?.owners.length ?? 0,
      }),
      unassignedLabel: tAssignment("unassigned"),
      noPhoneLabel: tAssignment("noPhone"),
      loadingLabel: tAssignment("loading"),
      emptyLabel: tAssignment("empty"),
      previousLabel: tAssignment("previous"),
      nextLabel: tAssignment("next"),
      pageLabel: ownerListData?.pagination
        ? tAssignment("pageLabel", {
            page: ownerListData.pagination.page,
            totalPages: Math.max(ownerListData.pagination.totalPages, 1),
          })
        : "",
      assignmentAgencyId,
      onAssignmentAgencyChange: setAssignmentAgencyId,
      agencyOptions,
      isAgencyListFetching,
      platformOwners: ownerListData?.owners ?? [],
      assignOwnerToSelectedAgency,
      assigningOwnerId: assignOwnerMutation.variables ?? null,
      isAssigningOwner: assignOwnerMutation.isPending,
    },
    listFilters: {
      search,
      status,
      onSearchChange,
      onStatusChange,
      columnOptions,
      onColumnVisibilityChange,
    },
    ownerList: {
      data: tableOwners,
      columns,
      sortConfig: activeSortConfig,
      onSort,
      pagination,
      noDataFound,
      pinnedColumns,
      gridHiddenColumnIds,
      listTitle: t("owners.list.tableTitle"),
      isLoading: isOwnerListLoading,
      isFetching: isOwnerListFetching,
      workflowActions: libraryWorkflowActions,
      onRowClick: onViewOwner,
      page,
      onPageChange,
    },
    ownerStatusConfirmModal,
    ownerViewModal: ownerViewModalProps,
    ownerEditModal: ownerEditModalState,
    ownerLinkedResourcesModal: ownerLinkedResourcesModalProps,
  };
}
