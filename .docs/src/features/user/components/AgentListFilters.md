# File Overview

Filter toolbar for the admin **Agents** list, aligned with `MyListingFilters`.

**Source:** `src/features/user/components/AgentListFilters.tsx`

# Responsibilities

- Render search input, status filter dropdown, and column visibility popover.
- Receive filter state and callbacks from `useAgentsScreen` via `AgentList`.

# Exports

- `AgentListFilters`
- `AgentListFiltersProps`
- `AgentListColumnOption`

# Props / Parameters

| Prop | Type | Description |
| --- | --- | --- |
| `search` | `string` | Current search query |
| `status` | `string` | Selected status filter (`""` = all) |
| `onSearchChange` | `(value: string) => void` | Search input handler |
| `onStatusChange` | `(value: string) => void` | Status dropdown handler |
| `columnOptions` | `AgentListColumnOption[]` | Toggleable column labels + visibility |
| `onColumnVisibilityChange` | `(columnId, visible) => void` | Column checkbox handler |
| `showSearch` | `boolean` | Show search field (default `true`) |
| `statusFilterValues` | `readonly string[]` | Status option keys (default `AGENT_LIST_STATUS_FILTER_VALUES`) |
| `className` | `string` | Optional wrapper classes |

# Actions / Inputs

- **Search** — `SearchInput` with clear; placeholder `user.agents.list.searchPlaceholder`.
- **Status** — `SelectDropdown` with `user.agents.list.statusFilter.*` labels; `useAgentsScreen` maps keys to uppercase API `status` (`ACTIVE`, `PENDING_REVIEW`, …) on `GET /agents`.
- **Columns** — `Popover` + `CheckboxField` grid for toggleable table columns.

# UI Details

- Layout: stacked on mobile; row with search left / controls right from `sm:`.
- Search width: `sm:max-w-sm md:max-w-md`.
- Status select: responsive min-widths matching listing filters.
- Column picker: `TableProperties` icon button, `rounded-lg`; panel `rounded-xl`. Hidden below `md` (`hidden md:block`).
- Light/dark semantic tokens; mobile-first responsive gaps.

# Dependencies

- [AgentList.md](./AgentList.md)
- [agentListStatusFilters.constants.ts](../../constants/agentListStatusFilters.constants.ts)
- [agentListTableColumns.constants.ts](../../constants/agentListTableColumns.constants.ts)
- [useAgentsScreen.md](../hooks/useAgentsScreen.md)
