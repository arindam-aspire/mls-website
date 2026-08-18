# LeadListFilters

### File Overview

Toolbar for the leads list: search + status only, laid out like `AgentListFilters`.

### Responsibilities

- Search input (clearable).
- Status `SelectDropdown` (outline, same sizing/spacing as agents).

### Props / Parameters

| Prop | Role |
| --- | --- |
| `search` / `onSearchChange` | Debounced upstream in `useLeadsScreen` |
| `status` / `onStatusChange` | Lead status filter (`""` = all) |
| `statusOptions` | `{ value, label }[]` including “all” |
| `labels` | `searchPlaceholder`, `clearSearch`, `filterStatus`, `statusAll` |

### UI Details

Row: search left, status right; gaps/margins match agents (`mb-2` → `md:mb-4` → `lg:mb-6`). Controls use `rounded-lg` via shared UI.

### Notes

Agent/property/date filters were removed to match the Agents page filter set.
