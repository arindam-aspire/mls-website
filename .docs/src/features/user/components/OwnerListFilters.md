# File Overview

Filter toolbar for the admin **Owners** list, structurally identical to `AgentListFilters`.

**Source:** `src/features/user/components/OwnerListFilters.tsx`

# Responsibilities

- Render search input, status filter (`active` / `suspended`), and column visibility popover.
- Receive filter state and callbacks from `useOwnersScreen` via `OwnerList`.

# UI Details

- Same layout, controls, and responsive behavior as `AgentListFilters`.
- Copy from `user.owners.list` and `user.owners.list.statusFilter`.
