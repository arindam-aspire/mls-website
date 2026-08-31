# Property components (`src/features/property/components/`)

UI building blocks for property feature screens.

## Files

| File | Role |
| --- | --- |
| [PropertyListFilters.md](./PropertyListFilters.md) | Buy/Rent, category, type filter bar |
| [PropertyListingCardList.md](./PropertyListingCardList.md) | MLS wrapper for library Grid/List property cards (hide owners, show agency/agent) |
| [PropertyListingStatusBadge.md](./PropertyListingStatusBadge.md) | Listing table status pill with MLS color mapping |
| [PropertyCreateAgencyField.md](./PropertyCreateAgencyField.md) | Step 8 Agency Routing checkbox and conditional agency dropdown (Super Admin / Owner) |
| [PropertyLocationVisibilityField.md](./PropertyLocationVisibilityField.md) | Localized Show Location switch integrated into the create-property Location step |
| [PropertyCreateUnsavedChangesModal.md](./PropertyCreateUnsavedChangesModal.md) | Unsaved create-property guard modal (Save / Discard / Cancel) |
| [PropertyDraftList.md](./PropertyDraftList.md) | Draft list with per-row Resume/Delete from API flags |
| [MyListingFilters.md](./MyListingFilters.md) | My Listings screen filter placeholder |

## Notes

- Components in this folder should stay presentational and emit changes via callbacks.
- Keep filter/query state ownership in route-level screens or stores.
