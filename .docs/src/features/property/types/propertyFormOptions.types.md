# File Overview

TypeScript shapes for `GET /property-form-options` and the mapped catalog used by Add Property.

**Source:** `src/features/property/types/propertyFormOptions.types.ts`

# Responsibilities

- Accept either snake_case or camelCase arrays from the backend (`listing_purposes` / `listingPurposes`, furnishing, floors, completion, orientations, `nationalities` / `nationality`).
- Accept wrapped lists (`items` / `data` / `results`) and nested `data` envelopes.
- Describe option items with `id`, `value`/`slug`/`code`, and `label`/`name`.
- Describe `PropertyFormOptionsResponse` (`success`, `message`, `data`, `error`, `meta`).
- Describe `PropertyFormOptionsCatalog` as library `PropertyFormOption[]` groups.

# Exports

- `PropertyFormOptionItem`
- `PropertyFormOptionList`
- `PropertyFormOptionsData`
- `PropertyFormOptionsResponse`
- `PropertyFormOptionsCatalog`

# API Usage

Consumed by `getPropertyFormOptions()` → `mapPropertyFormOptionsCatalog()`. Furnishing and floor catalog values are master-table IDs when the API provides them.

# Dependencies

- [propertyFormOptions.mapper.md](../mappers/propertyFormOptions.mapper.md)
- [propertyEndpoints.md](../../../apis/endpoints/propertyEndpoints.md)
