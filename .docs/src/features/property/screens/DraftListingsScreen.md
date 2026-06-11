# File Overview

Draft listings screen using `@abdoun/abdoun-library` **`DraftList`** fed by `useDraftListingsScreen`.

**Source:** `src/features/property/screens/DraftListingsScreen.tsx`

# Responsibilities

- Page heading from `propertyList.draftListings`.
- Render `DraftList` with API-backed `items`, pagination, resume/create/delete handlers, and localized empty state.

# Imports

- `DraftList` from `@abdoun/abdoun-library`
- `useDraftListingsScreen`

# Navigation

- Mounted at `/en/draft-listings` (`useAuthorize("DRAFT_LISTINGS")`).
- Resume → `/en/property-create?submission_id=…`

# Dependencies

- [useDraftListingsScreen.md](../hooks/useDraftListingsScreen.md)
