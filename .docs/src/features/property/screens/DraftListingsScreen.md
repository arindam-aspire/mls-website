# File Overview

Draft listings screen using **`PropertyDraftList`** (per-row actions from API `can_edit` / `can_delete`) fed by `useDraftListingsScreen`.

**Source:** `src/features/property/screens/DraftListingsScreen.tsx`

# Responsibilities

- Page heading from `propertyList.draftListings`.
- **Add Property** primary button in page header — `onCreateNew` from `useAddPropertyEntry({ restrictForOwnerOnly: true })`.
- Render `PropertyDraftList` with API-backed items, pagination, resume/delete, and per-row delete loading.
- **Delete confirm** via shared `ConfirmModal` (danger) wired from `deleteConfirmModal` in the screen hook.

# Imports

- `ConfirmModal`, `PropertyDraftList`, `SelectAgencyModal`, `useDraftListingsScreen`

# Navigation

- Mounted at `/en/draft-listings` (`useAuthorize("DRAFT_LISTINGS")`).
- Resume → `/en/property-create?submission_id=…`

# Actions / Inputs

- Delete (when `can_delete`): opens confirm → `DELETE /property-submissions/{submission_id}` → toast → refresh.

# Dependencies

- [useDraftListingsScreen.md](../hooks/useDraftListingsScreen.md)
- [useAddPropertyEntry.md](../hooks/useAddPropertyEntry.md)
- [SelectAgencyModal.md](../../profile/modals/SelectAgencyModal.md)
