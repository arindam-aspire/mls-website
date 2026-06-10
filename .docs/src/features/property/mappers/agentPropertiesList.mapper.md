# File Overview

Maps `GET /agent-properties` rows (`AgentPropertyListItem`) into `@abdoun/abdoun-library` `ListTableView` row shape.

**Source:** `src/features/property/mappers/agentPropertiesList.mapper.ts`

# Responsibilities

- Convert API list items to library `PropertyListing` rows for `ListTableView`.
- Normalize `status_slug` to `PropertyListingStatusKey` via `PROPERTY_LISTING_STATUS_KEYS`; unknown slugs fall back to `draft`.
- Build `status` with `createListingStatus(key, status_name)`.
- Copy single-string `title` into all localized title fields (`en`, `ar`, `esp`, `fr`).
- Format `price` + `currency`; map `submission_submitted_at` → `validatedDate` for **Submitted on** column.
- Stub empty location/media fields required by the library row shape.

# Exports

- `mapAgentPropertyListItem(item)` — single row
- `mapAgentPropertyListItems(items)` — array (empty-safe)

# Dependencies

- `@abdoun/abdoun-library` — `createListingStatus`, `PROPERTY_LISTING_STATUS_KEYS`, `ListTableView` row type
- `AgentPropertyListItem` in `property.types.ts`
- Used by `useListingPropertyScreen`
