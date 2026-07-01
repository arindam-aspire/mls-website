"use client";

import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { Button, Card, CardContent } from "@/src/components/ui";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { isAgentUser } from "@/src/features/auth/utils/profileMenuRoleAccess";
import { MyListingFilters } from "@/src/features/property/components/MyListingFilters";
import { MyListingRejectedReasonModal } from "@/src/features/property/components/MyListingRejectedReasonModal";
import { AssignAgentModal } from "@/src/features/property/components/AssignAgentModal";
import { RejectSubmissionModal } from "@/src/features/property/components/RejectSubmissionModal";
import { useManageListingsScreen } from "@/src/features/property/hooks/useManageListingsScreen";
import { useRouter } from "@/src/i18n/navigation";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";
import { ListTableView } from "@abdoun/abdoun-library";
import { Plus, Trash2, CheckCircle2, UserMinus, XCircle } from "lucide-react";
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
    approveConfirmModal,
    assignAgentModal,
    rejectSubmissionModal,
    unassignConfirmModal,
    deactivateConfirmModal,
    onClickDelete,
    onRowAction,
    workflowActions,
    canViewDelete,
  } = useManageListingsScreen();
  const router = useRouter();
  const t = useTranslations("propertyList.manageListings");
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
              canViewDelete={canViewDelete}
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

      {approveConfirmModal ? (
        <ConfirmModal
          open={approveConfirmModal.open}
          onClose={approveConfirmModal.onClose}
          onConfirm={approveConfirmModal.onConfirm}
          onCancel={approveConfirmModal.onClose}
          variant="primary"
          title={approveConfirmModal.title}
          description={approveConfirmModal.description}
          confirmLabel={approveConfirmModal.confirmLabel}
          cancelLabel={approveConfirmModal.cancelLabel}
          cancelColor="inherit"
          confirmIcon={<CheckCircle2 className="size-4" aria-hidden />}
          isLoading={approveConfirmModal.isLoading}
          loadingLabel={approveConfirmModal.approvingLabel}
        />
      ) : null}

      {assignAgentModal ? (
        <AssignAgentModal
          open={assignAgentModal.open}
          listingTitle={assignAgentModal.listingTitle}
          mode={assignAgentModal.mode}
          isAssigning={assignAgentModal.isAssigning}
          onClose={assignAgentModal.onClose}
          onAssign={assignAgentModal.onAssign}
        />
      ) : null}

      {rejectSubmissionModal ? (
        <RejectSubmissionModal
          open={rejectSubmissionModal.open}
          listingTitle={rejectSubmissionModal.listingTitle}
          isSubmitting={rejectSubmissionModal.isSubmitting}
          onClose={rejectSubmissionModal.onClose}
          onSubmit={rejectSubmissionModal.onSubmit}
        />
      ) : null}

      {unassignConfirmModal ? (
        <ConfirmModal
          open={unassignConfirmModal.open}
          onClose={unassignConfirmModal.onClose}
          onConfirm={unassignConfirmModal.onConfirm}
          onCancel={unassignConfirmModal.onClose}
          variant="danger"
          title={unassignConfirmModal.title}
          description={unassignConfirmModal.description}
          confirmLabel={unassignConfirmModal.confirmLabel}
          cancelLabel={unassignConfirmModal.cancelLabel}
          cancelColor="inherit"
          confirmIcon={<UserMinus className="size-4" aria-hidden />}
          isLoading={unassignConfirmModal.isLoading}
          loadingLabel={unassignConfirmModal.unassigningLabel}
        />
      ) : null}

      {deactivateConfirmModal ? (
        <ConfirmModal
          open={deactivateConfirmModal.open}
          onClose={deactivateConfirmModal.onClose}
          onConfirm={deactivateConfirmModal.onConfirm}
          onCancel={deactivateConfirmModal.onClose}
          variant="danger"
          title={deactivateConfirmModal.title}
          description={deactivateConfirmModal.description}
          confirmLabel={deactivateConfirmModal.confirmLabel}
          cancelLabel={deactivateConfirmModal.cancelLabel}
          cancelColor="inherit"
          confirmIcon={<XCircle className="size-4" aria-hidden />}
          isLoading={deactivateConfirmModal.isLoading}
          loadingLabel={deactivateConfirmModal.deactivatingLabel}
        />
      ) : null}

      {deleteConfirmModal ? (
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
      ) : null}
    </>
  );
}
