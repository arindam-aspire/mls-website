# File Overview

Hook powering [SearchCriteriaForm.md](../components/SearchCriteriaForm.md): local filter state, name validation, and create/update saved search mutations.

**Source:** `src/features/saved-searches/hooks/useSearchCriteriaForm.ts`

# Responsibilities

- Hold `SearchCriteriaParams` in React state (defaults or pre-filled from `record` via `parseSavedSearchCriteriaToParams`).
- Delegate filter UI props to `useSearchCriteriaFilters`.
- Validate name with `useForm`; on submit call `buildSaveSearchCriteria` + `useCreateSavedSearch` or `useUpdateSavedSearch` when `record.id` is set.
- Reset criteria restores saved record values in edit mode, or defaults in create mode.

# Parameters

| Param | Type | Notes |
| --- | --- | --- |
| `onCancel` | `() => void?` | Called after successful save/update |
| `record` | `SavedSearchRecord?` | When set, form runs in update mode |

# Return values

| Key | Purpose |
| --- | --- |
| `criteriaFields` | Spread into criteria section |
| `values`, `errors`, `handleChange`, `handleBlur`, `handleFormSubmit` | Name field |
| `nameLabel`, `namePlaceholder`, `cancelLabel`, `resetCriteriaLabel`, `saveLabel`, `savingLabel` | i18n |
| `isSaving` | Create or update mutation pending |
| `onCancel`, `onResetCriteria` | Callbacks |

# API Usage

- `useCreateSavedSearch` → `POST /saved-searches`
- `useUpdateSavedSearch` → `PUT /saved-searches/:id`

# Dependencies

- [useSearchCriteriaFilters.md](./useSearchCriteriaFilters.md)
- [buildSaveSearchCriteria.md](../utils/buildSaveSearchCriteria.md)
- [parseSavedSearchCriteriaToParams.md](../utils/parseSavedSearchCriteriaToParams.md)
