# File Overview

Draft listings screen using **`PropertyDraftList`** (per-row actions from API `can_edit` / `can_delete`) fed by `useDraftListingsScreen`.

**Source:** `src/features/property/screens/DraftListingsScreen.tsx`

# Responsibilities

- Page heading from `propertyList.draftListings`.
- **Add Property** primary button in page header (always visible, same layout as My Listings) — uses `onCreateNew` from `useAddPropertyEntry({ restrictForOwnerOnly: true })`.
- Render `PropertyDraftList` with API-backed items, pagination, and per-row actions.

# Imports

- `PropertyDraftList` from property components
- `SelectAgencyModal` from profile modals
- `useDraftListingsScreen`

# Navigation

- Mounted at `/en/draft-listings` (`useAuthorize("DRAFT_LISTINGS")`).
- Resume → `/en/property-create?submission_id=…`

# Dependencies

- [useDraftListingsScreen.md](../hooks/useDraftListingsScreen.md)
- [useAddPropertyEntry.md](../hooks/useAddPropertyEntry.md)
- [SelectAgencyModal.md](../../profile/modals/SelectAgencyModal.md)
