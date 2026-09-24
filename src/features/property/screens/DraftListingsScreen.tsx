"use client";

import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { Button } from "@/src/components/ui";
import { SelectAgencyModal } from "@/src/features/profile/modals/SelectAgencyModal";
import { PropertyDraftList } from "@/src/features/property/components/PropertyDraftList";
import { useDraftListingsScreen } from "@/src/features/property/hooks/useDraftListingsScreen";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DraftListingsScreen() {
  const t = useTranslations("propertyList.draftListings");
  const {
    draftListItems,
    isLoading,
    pagination,
    onCreateNew,
    onDelete,
    getDeleteLoading,
    deleteConfirmModal,
    onResume,
    resumeLabel,
    createLabel,
    addPropertyLabel,
    emptyStateContent,
    isSelectAgencyOpen,
    setIsSelectAgencyOpen,
  } = useDraftListingsScreen();

  return (
    <>
      <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:gap-4 lg:gap-6">
          <div className="min-w-0 flex-1">
            <h1 className={headingPageClasses}>{t("pageTitle")}</h1>
            <p className={cn("text-muted", bodyLargeTextClasses)}>{t("pageSubtitle")}</p>
          </div>

          <Button
            type="button"
            color="primary"
            variant="solid"
            size="md"
            className="w-full shrink-0 rounded-lg sm:w-auto"
            iconStart={<Plus className="size-4" aria-hidden />}
            onClick={onCreateNew}
          >
            {addPropertyLabel}
          </Button>
        </div>

        <PropertyDraftList
          items={draftListItems}
          isLoading={isLoading}
          onCreateNew={onCreateNew}
          onDelete={onDelete}
          getDeleteLoading={getDeleteLoading}
          onResume={onResume}
          pagination={pagination}
          resumeLabel={resumeLabel}
          createLabel={createLabel}
          emptyStateContent={emptyStateContent}
          size="md"
        />
      </div>

      <SelectAgencyModal isOpen={isSelectAgencyOpen} setIsOpen={setIsSelectAgencyOpen} />

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
