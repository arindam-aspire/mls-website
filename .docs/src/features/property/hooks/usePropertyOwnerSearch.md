# File Overview

Owner search callback for Add Property Step 4 (`PropertyForm` `onSearchOwners`).

**Source:** `src/features/property/hooks/usePropertyOwnerSearch.ts`

# Responsibilities

- Debounce is owned by the library; this hook queries when the search string is at least 2 characters.
- Super Admin → `GET` platform owner list.
- Other roles with an agency → `GET /agency/{id}/owners?search=`.
- No agency → platform owner list fallback.
- Map results with `mapOwnerListItemToSearchResult`.

# Exports

- `usePropertyOwnerSearch()` → `{ onSearchOwners }`

# API Usage

| Role | Service |
| --- | --- |
| Super Admin | `getPlatformOwnerList({ page, pageSize, search })` |
| Agency user | `getOwnerList(agencyId, { page, pageSize, search })` |

# Dependencies

- [propertyOwnerSearch.mapper.md](../mappers/propertyOwnerSearch.mapper.md)
- [usePropertyCreateScreen.md](./usePropertyCreateScreen.md)
