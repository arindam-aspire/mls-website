"use client";

import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { ContactModal } from "@/src/features/contact/components/ContactModal";
import { Button } from "@/src/components/ui/button";
import { PropertyCardList } from "@abdoun/abdoun-library";
import { useRecentlyViewedScreen } from "@/src/features/property/hooks/useRecentlyViewedScreen";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";
import { Eraser, Search, Trash2 } from "lucide-react";
import { useMemo } from "react";

export default function RecentlyViewedScreen() {
  const {
    listings,
    pageTitle,
    pageSubtitle,
    clearRecentViewsLabel,
    onClearRecentViews,
    clearConfirmModal,
    isLoading,
    pagination,
    noDataFound,
    onBrowseProperties,
    onClickProperty,
    canViewDelete,
    onClickDelete,
    deleteConfirmModal,
    toggleFavourite,
    onClickEmail,
    onClickCall,
    onClickWhatsApp,
    contactModal,
  } = useRecentlyViewedScreen();

  const emptyState = useMemo(
    () => ({
      title: noDataFound.title,
      description: noDataFound.description,
      actions: (
        <Button
          type="button"
          color="primary"
          className="w-full rounded-lg sm:w-auto"
          iconStart={<Search className="size-4" aria-hidden />}
          onClick={onBrowseProperties}
        >
          {noDataFound.actionLabel}
        </Button>
      ),
    }),
    [noDataFound, onBrowseProperties],
  );

  return (
    <>
      <ContactModal contactModal={contactModal} />

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

      <ConfirmModal
        open={clearConfirmModal.open}
        onClose={clearConfirmModal.onClose}
        onConfirm={clearConfirmModal.onConfirm}
        onCancel={clearConfirmModal.onClose}
        variant="primary"
        title={clearConfirmModal.title}
        description={clearConfirmModal.description}
        confirmLabel={clearConfirmModal.confirmLabel}
        cancelLabel={clearConfirmModal.cancelLabel}
        cancelColor="inherit"
        icon={<Eraser className="size-6" aria-hidden />}
        iconContainerClassName="bg-tertiary-light text-tertiary-dark"
        confirmColor="tertiary"
        confirmVariant="solid"
        confirmIcon={<Eraser className="size-4" aria-hidden />}
        isLoading={clearConfirmModal.isLoading}
        loadingLabel={clearConfirmModal.clearingLabel}
      />

      <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between md:gap-4 lg:gap-6">
          <div className="min-w-0 flex-1">
            <h1 className={headingPageClasses}>{pageTitle}</h1>
            <p className={cn("text-muted", bodyLargeTextClasses)}>{pageSubtitle}</p>
          </div>

          <Button
            type="button"
            color="tertiary"
            variant="solid"
            size="sm"
            className="w-full shrink-0 rounded-lg sm:w-auto"
            iconStart={<Eraser className="size-4" aria-hidden />}
            disabled={isLoading || clearConfirmModal.isLoading}
            onClick={onClearRecentViews}
          >
            {clearRecentViewsLabel}
          </Button>
        </div>

        <PropertyCardList
          data={listings}
          isLoading={isLoading}
          layoutVariant="grid"
          pagination={pagination}
          noDataFound={emptyState}
          canViewAgents={false}
          canViewOwners
          canViewBadges
          onClick={onClickProperty}
          canViewDelete={canViewDelete}
          onClickDelete={onClickDelete}
          onClickFavourite={toggleFavourite}
          onClickEmail={onClickEmail}
          onClickCall={onClickCall}
          onClickWhatsApp={onClickWhatsApp}
        />
      </div>
    </>
  );
}
