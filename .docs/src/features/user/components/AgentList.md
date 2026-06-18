# File Overview

Card shell for the admin **Agents** list: filters toolbar + `AgentListView` from `@abdoun/abdoun-library@0.1.63`.

**Source:** `src/features/user/components/AgentList.tsx`

# Responsibilities

- Wrap filter toolbar and library agent table/grid in a responsive shell: flush on mobile (`bg-page` shows through), card surface + shadow from `md` up.
- Render `AgentListFilters` and `AgentListView` with data from `useAgentsScreen`.
- Pass optional `workflowActions` to the library for status-based row actions.

# Props

| Prop | Type | Description |
| --- | --- | --- |
| `filters` | `AgentListFiltersProps` | Search/status/column picker state |
| `list` | `AgentListData` | Mapped agents, columns, sort, pagination, loading, optional `workflowActions` |

# UI Details

- Filters on top; `AgentListView` below (`mt-4 sm:mt-6`).
- Outer shell: no padding below `md`; `md:p-4 lg:p-6` from tablet up.
- Mobile (`< md`): transparent wrapper (no card shadow/background). Desktop: `rounded-xl`, `bg-surface`, default card shadow.
- Library handles responsive table (`md+`) and agent mobile cards (`< md`).
- Column visibility from filters maps to hidden table/grid columns.

# Dependencies

- [useAgentsScreen.md](../hooks/useAgentsScreen.md)
- [mapAgentListItemToLibraryAgent.md](../mappers/mapAgentListItemToLibraryAgent.md)
