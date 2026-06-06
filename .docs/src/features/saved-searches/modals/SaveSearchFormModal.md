# File Overview

Modal for creating or editing a saved search from the saved searches page. Body renders [SearchCriteriaForm.md](../components/SearchCriteriaForm.md).

**Source:** `src/features/saved-searches/modals/SaveSearchFormModal.tsx`

# Responsibilities

- Render modal shell (`size="xl"`) with title and close control.
- Host scrollable `SearchCriteriaForm` (name + criteria + footer actions).
- Remount form via `key={record?.id ?? "create"}` when switching create vs edit.

# Props / Parameters

| Prop | Type | Notes |
| --- | --- | --- |
| `open` | `boolean` | Modal visibility |
| `onClose` | `() => void` | Close via backdrop, Escape, or close button |
| `title` | `string` | Create or update title from screen hook |
| `record` | `SavedSearchRecord?` | When set, form pre-fills and saves via update API |

# Navigation

Opened from [SavedSearchScreen.md](../screens/SavedSearchScreen.md):

- **New Search Criteria** → create mode
- **Edit** on [SearchCard.md](../components/SearchCard.md) → update mode

# Dependencies

- `@/src/components/ui/modal`
- [SearchCriteriaForm.md](../components/SearchCriteriaForm.md)
- [useSavedSearchScreen.md](../hooks/useSavedSearchScreen.md)

# Notes

- Property list save flow still uses [SaveSearchModal.md](./SaveSearchModal.md) when saving from `/property-list`.
