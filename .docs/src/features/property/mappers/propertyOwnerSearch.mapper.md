# File Overview

Maps MLS owner list items to `@abdoun/abdoun-library` `PropertyOwnerSearchResult` for Add Property owner search.

**Source:** `src/features/property/mappers/propertyOwnerSearch.mapper.ts`

# Responsibilities

- Copy `owner_id`, name, email, nationality, SSI.
- Split `phone` into `country_code` + `phone_number` via `parseOwnerPhoneForForm`.
- Map document `file_name` / `url` into library `SelectedDocument` `{ name, uri }`.

# Exports

- `mapOwnerListItemToSearchResult(owner)`

# Dependencies

- [propertyOwnerPhone.utils.md](../utils/propertyOwnerPhone.utils.md)
- [usePropertyOwnerSearch.md](../hooks/usePropertyOwnerSearch.md)
- [owner.types.md](../../user/types/owner.types.md)
