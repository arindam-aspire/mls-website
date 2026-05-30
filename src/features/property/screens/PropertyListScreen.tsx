"use client";

import { UpcomingFeatureModal } from "@/src/components/common/UpcomingFeatureModal";
import { PropertyCardList } from "@abdoun/abdoun-library";
import { PropertyListFilters } from "../components/PropertyListFilters";
import { usePropertyList } from "../hooks/usePropertyList";

export default function PropertyListScreen() {
  const {
    listings,
    layoutVariant,
    listTitle,
    isLoading,
    filters,
    toolbar,
    pagination,
    noDataFound,
    onClickProperty,
    toggleFavourite,
    onClickEmail,
    onClickCall,
    onClickWhatsApp,
    upcomingFeatureModal,
  } = usePropertyList();

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PropertyListFilters {...filters} />
      <UpcomingFeatureModal
        open={upcomingFeatureModal.open}
        onClose={upcomingFeatureModal.onClose}
      />
      <PropertyCardList
        data={listings}
        isLoading={isLoading}
        layoutVariant={layoutVariant}
        listTitle={listTitle}
        toolbar={toolbar}
        pagination={pagination}
        noDataFound={noDataFound}
        canViewAgents
        canViewOwners
        canViewBadges
        onClick={onClickProperty}
        onClickFavourite={toggleFavourite}
        onClickEmail={onClickEmail}
        onClickCall={onClickCall}
        onClickWhatsApp={onClickWhatsApp}
      />
    </div>
  );
}
