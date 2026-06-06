# SearchCard

## File Overview

List item card for a saved search on `SavedSearchScreen`. Shows name, filter chips, Run / Edit / Remove actions, and a delete confirmation modal.

## Responsibilities

- Render one `SavedSearchRecord` with bookmark icon, title, and `SavedSearchFilterChips` (`variant="chips"`).
- Run navigates via parent `onRun`; Edit opens the criteria modal via `onEdit`; Remove opens `ConfirmModal` then calls `onDelete`.
- Export `searchCardShellClassName` so loading skeletons match the same `Card` shell.

## Imports

- `@/src/components/ui` — `Button`, `Card`, `CardContent`
- `@/src/components/common/ConfirmModal`
- `buildSavedSearchCriteriaFilterItems`, `SavedSearchFilterChips`
- `next-intl` — `savedSearches`, `propertyList.advanced.amenities`

## Exports

- `SearchCard` — presentational card component
- `searchCardShellClassName` — shared Tailwind shell for `Card` (bordered, `rounded-xl`, no shadow)

## State Management

- Local `showDeleteConfirm` boolean for the remove confirmation modal.

## Navigation

- None directly; `onRun` is provided by `useSavedSearchScreen`.

## Props / Parameters

| Prop | Type | Description |
| --- | --- | --- |
| `record` | `SavedSearchRecord` | Saved search row data |
| `runLabel` / `editLabel` / `deleteLabel` | `string` | Resolved i18n labels from screen hook |
| `onRun` / `onEdit` / `onDelete` | callbacks | Parent handlers |
| `isDeleting` | `boolean?` | Disables confirm while delete mutation runs |
| `className` | `string?` | Extra classes on `Card` |

## Actions / Inputs

- **Run** — primary button, calls `onRun(record)`.
- **Edit** — inherit outline button with pencil icon, calls `onEdit(record)`.
- **Remove** — danger ghost button, opens confirm modal; confirm calls `onDelete(record)`.
- **Cancel** (modal) — closes confirm without deleting.

## UI Details

- Uses shared `Card` + `CardContent` with `searchCardShellClassName`: `rounded-xl`, `border-secondary/15`, `shadow-none`, hover border emphasis.
- Title remains `<h2>` inside content (list semantics); not `CardTitle` (which renders `h3`).
- Responsive action placement: inline on `md+`, stacked footer on small screens.
- Light/dark via semantic tokens (`bg-surface`, `text-text`, `text-muted`).

## Flow Description

1. Parent maps `items` to `SearchCard` inside a list.
2. Filter items are built from `record.search_criteria` and shown as chips.
3. Edit → parent opens `SaveSearchFormModal` in update mode with pre-filled criteria.
4. Remove → `ConfirmModal` → delete mutation via parent.

## Dependencies

- `SavedSearchScreen`, `useSavedSearchScreen`
- `SavedSearchFilterChips`, `buildSavedSearchCriteriaFilterItems`

## Notes

- Previously used a raw `<article>` with duplicate card classes; aligned with project `Card` pattern (see profile / mobile menu cards).
