# File Overview

App wrapper around `@abdoun/abdoun-library` draft list primitives. Renders per-row **Resume** and **Delete** actions based on `canEdit` / `canDelete` from the drafts API (`can_edit` / `can_delete`).

**Source:** `src/features/property/components/PropertyDraftList.tsx`

# Responsibilities

- Mirror `DraftList` layout: skeleton, empty state, card list, pagination.
- Pass `onResume` / `onDelete` to `DraftListCard` only when the mapped item allows the action.

# Imports

- `DraftListCard`, `DraftListEmpty`, `DraftListSkeleton`, `TablePaginition` from `@abdoun/abdoun-library`
- `MappedDraftListItem` from [agentPropertyDraftsList.mapper.md](../mappers/agentPropertyDraftsList.mapper.md)

# Exports

- `PropertyDraftList`
- `PropertyDraftListProps`

# Why not `DraftList`?

Library `DraftList` passes the same `onResume` / `onDelete` to every card, so action buttons cannot be hidden per row. This component uses `DraftListCard` per item instead.

# UI Details

- Same spacing and pagination as library `DraftList` (`TablePaginition`, `buttonSize="sm"`).
- Semantic tokens via library cards; `rounded-xl` card shells.

# Dependencies

- [DraftListingsScreen.md](../screens/DraftListingsScreen.md)
- [agentPropertyDraftsList.mapper.md](../mappers/agentPropertyDraftsList.mapper.md)

# Notes

- Upstream option: add `canEdit` / `canDelete` on `DraftListItem` in `@abdoun/abdoun-library` and teach `DraftList` to respect them.
