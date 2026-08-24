# Property components (`src/features/property/components/`)

UI building blocks for property feature screens.

## Files

| File | Role |
| --- | --- |
| [PropertyListFilters.md](./PropertyListFilters.md) | Buy/Rent, category, type filter bar |
| [PropertyListingStatusBadge.md](./PropertyListingStatusBadge.md) | Listing table status pill with MLS color mapping |
| [PropertyCreateAgencyField.md](./PropertyCreateAgencyField.md) | Agency dropdown on property create (Super Admin / Owner) |
| [PropertyCreateUnsavedChangesModal.md](./PropertyCreateUnsavedChangesModal.md) | Unsaved create-property guard modal (Save / Discard / Cancel) |
| [PropertyDraftList.md](./PropertyDraftList.md) | Draft list with per-row Resume/Delete from API flags |
| [MyListingFilters.md](./MyListingFilters.md) | My Listings screen filter placeholder |

## Notes

- Components in this folder should stay presentational and emit changes via callbacks.
- Keep filter/query state ownership in route-level screens or stores.
