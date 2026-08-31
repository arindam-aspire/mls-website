"use client";

import { ContactModal } from "@/src/features/contact/components/ContactModal";
import { SaveSearchModal } from "@/src/features/saved-searches/modals/SaveSearchModal";
import { PropertyListingCardList } from "../components/PropertyListingCardList";
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
    contactModal,
    saveSearchModal,
  } = usePropertyList();

  return (
    <>
      <div className="sticky top-[var(--layout-header-height)] z-30 -mx-6 border-b border-secondary/10 bg-page/95 px-6 py-3 backdrop-blur-md sm:py-4">
        <div className="container mx-auto w-full min-w-0">
          <PropertyListFilters {...filters} />
        </div>
      </div>

      <ContactModal contactModal={contactModal} />

      <SaveSearchModal
        open={saveSearchModal.open}
        onClose={saveSearchModal.onClose}
        filterItems={saveSearchModal.filterItems}
        searchCriteria={saveSearchModal.searchCriteria}
        savedSearchId={saveSearchModal.savedSearchId}
        initialName={saveSearchModal.initialName}
      />

      <div className="container mx-auto mt-4 w-full min-w-0 sm:mt-6">
        <PropertyListingCardList
          data={listings}
          isLoading={isLoading}
          layoutVariant={layoutVariant}
          listTitle={listTitle}
          toolbar={toolbar}
          pagination={pagination}
          noDataFound={noDataFound}
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
