# File Overview

Maps `GET /agent-properties/drafts` rows to `@abdoun/abdoun-library` `DraftListItemData` for `DraftList`.

**Source:** `src/features/property/mappers/agentPropertyDraftsList.mapper.ts`

# Exports

- `MapAgentPropertyDraftLabels`
- `mapAgentPropertyDraftListItem(item, labels)`
- `mapAgentPropertyDraftListItems(items, labels)`

# Mapping

`GET /agent-properties/drafts` item shape:

| API field | `DraftListItemData` |
| --- | --- |
| `submission_id` | `id` |
| `title` (`null` → empty; library shows Untitled) | `title` |
| `updated_at` + i18n | `updatedAtLabel` |
| — | `thumbnailUrl` → `null` |
| — | `propertyType` / `listingPurposeLabel` → `""` (not in API yet) |
| `current_step` | `currentStep` |
| `propertyFormSteps.length` | `totalSteps` |

Also on each row: `status`, `last_completed_step`, `can_edit`, `can_delete` (reserved for actions).

# Dependencies

- [useDraftListingsScreen.md](../hooks/useDraftListingsScreen.md)
