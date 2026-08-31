"use client";

import { ContactModal } from "@/src/features/contact/components/ContactModal";
import { Button } from "@/src/components/ui/button";
import { PropertyListingCardList } from "../components/PropertyListingCardList";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingPageClasses } from "@/src/lib/typography";
import { Search } from "lucide-react";
import { useMemo } from "react";
import { useFavouritePropertyList } from "../hooks/useFavouritePropertyList";

export default function FavouritePropertyScreen() {
  const {
    listings,
    pageTitle,
    pageSubtitle,
    isLoading,
    cardButtonSize,
    pagination,
    noDataFound,
    onBrowseProperties,
    onClickProperty,
    toggleFavourite,
    onClickEmail,
    onClickCall,
    onClickWhatsApp,
    contactModal,
  } = useFavouritePropertyList();

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

      <div className="flex w-full min-w-0 flex-col gap-2 md:gap-4 lg:gap-6">
        <div className="min-w-0">
          <h1 className={headingPageClasses}>{pageTitle}</h1>
          <p className={cn("text-muted", bodyLargeTextClasses)}>{pageSubtitle}</p>
        </div>

        <PropertyListingCardList
          data={listings}
          isLoading={isLoading}
          layoutVariant="grid"
          buttonSize={cardButtonSize}
          pagination={pagination}
          noDataFound={emptyState}
          canViewBadges
          onClick={onClickProperty}
          onClickFavourite={toggleFavourite}
          onClickEmail={onClickEmail}
          onClickCall={onClickCall}
          onClickWhatsApp={onClickWhatsApp}
        />
      </div>
    </>
  );
}
