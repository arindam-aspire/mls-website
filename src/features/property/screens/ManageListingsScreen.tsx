"use client";

import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { Button, Card, CardContent } from "@/src/components/ui";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { isAgentUser } from "@/src/features/auth/utils/profileMenuRoleAccess";
import { MyListingFilters } from "@/src/features/property/components/MyListingFilters";
import { MyListingRejectedReasonModal } from "@/src/features/property/components/MyListingRejectedReasonModal";
import { useListingPropertyScreen } from "@/src/features/property/hooks/useListingPropertyScreen";
import { useRouter } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";
import { ListTableView } from "@abdoun/abdoun-library";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";

const listingsCardClassName =
  "w-full min-w-0 rounded-xl border border-secondary/15 shadow-none";

export default function ManageListingsScreen() {
  const {
    filters,
    tableListings,
    isLoading,
    sortConfig,
    onSort,
    tableLocale,
    pagination,
    noDataFound,
    columns,
    pinnedColumns,
    listTitle,
    rejectedReasonModal,
    deleteConfirmModal,
    onClickDelete,
    onRowAction,
    workflowActions,
  } = useListingPropertyScreen({ listingsNamespace: "manageListings" });
  const t = useTranslations("propertyList.manageListings");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const showAddProperty = useMemo(() => isAgentUser(user), [user]);

  const onAddProperty = useCallback(() => {
    router.push("/property-create");
  }, [router]);

  return (
    <>
      <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:gap-4 lg:gap-6">
          <div className="min-w-0 flex-1">
            <h1 className={headingPageClasses}>{t("pageTitle")}</h1>
            <p className={cn("text-muted", bodyLargeTextClasses)}>{t("pageSubtitle")}</p>
          </div>

          {showAddProperty ? (
            <Button
              type="button"
              color="primary"
              variant="solid"
              size="md"
              className="w-full shrink-0 rounded-lg sm:w-auto"
              iconStart={<Plus className="size-4" aria-hidden />}
              onClick={onAddProperty}
            >
              {t("addProperty")}
            </Button>
          ) : null}
        </div>

        <Card className={listingsCardClassName}>
          <CardContent className="p-4 sm:p-6">
            <MyListingFilters {...filters} />

            <ListTableView
              className="mt-4 min-w-0 sm:mt-6"
              data={tableListings}
              isLoading={isLoading}
              listTitle={listTitle}
              sortConfig={sortConfig}
              onSort={onSort}
              locale={tableLocale}
              pagination={pagination}
              noDataFound={noDataFound}
              columns={columns}
              pinnedColumns={pinnedColumns}
              workflowActions={workflowActions}
              onRowAction={onRowAction}
              canViewDelete
              onClickDelete={onClickDelete}
            />
          </CardContent>
        </Card>
      </div>

      <MyListingRejectedReasonModal
        open={rejectedReasonModal.open}
        onClose={rejectedReasonModal.onClose}
        title={rejectedReasonModal.title}
        reason={rejectedReasonModal.reason}
        emptyReason={rejectedReasonModal.emptyReason}
        closeLabel={rejectedReasonModal.closeLabel}
      />

      <ConfirmModal
        open={deleteConfirmModal.open}
        onClose={deleteConfirmModal.onClose}
        onConfirm={deleteConfirmModal.onConfirm}
        onCancel={deleteConfirmModal.onClose}
        variant="danger"
        title={deleteConfirmModal.title}
        description={deleteConfirmModal.description}
        confirmLabel={deleteConfirmModal.confirmLabel}
        cancelLabel={deleteConfirmModal.cancelLabel}
        cancelColor="inherit"
        confirmIcon={<Trash2 className="size-4" aria-hidden />}
        isLoading={deleteConfirmModal.isLoading}
        loadingLabel={deleteConfirmModal.deletingLabel}
      />
    </>
  );
}
