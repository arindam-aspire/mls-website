# File Overview

Card shell for the admin **Owners** list: filters toolbar + `OwnerListView` from `@abdoun/abdoun-library`.

**Source:** `src/features/user/components/OwnerList.tsx`

# Responsibilities

- Wrap filter toolbar and library owner table/grid in a responsive shell matching `AgentList`.
- Render `OwnerListFilters` and `OwnerListView` with paginated data from `GET /agency/{agency_id}/owners`.

# Dependencies

- [OwnerListFilters.md](./OwnerListFilters.md)
- [useOwnersScreen.md](../hooks/useOwnersScreen.md)
