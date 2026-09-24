# File Overview

Maps `GET /property-form-options` payload arrays into `@abdoun/abdoun-library` `PropertyFormOption` lists.

**Source:** `src/features/property/mappers/propertyFormOptions.mapper.ts`

# Responsibilities

- Unwrap nested `data` envelopes (`response`, `response.data`, `response.data.data`).
- Flatten `data.groups.{group}` (including `land_type`, `floor`, `furnishing_status`, …) onto the options object for list matching.
- Unwrap option lists that arrive as arrays or `{ items | data | results }`.
- Normalize `id` / `value` / `slug` / `code` + `label` / `name` items.
- Prefer master-table **IDs** as the select `value` for Furnishing Status and Land Type so draft payloads persist FKs.
- Use slug/value first for other option groups (listing purpose, completion, orientation, nationality), falling back to `id` / `nationality_id` when slug is absent.
- Read nationality lists from `nationalities` or `nationality` (and any key matching `nationality*option*`).
- Read Land Type from `land_type` / `land_types` / `groups.land_type` (Arabic `name` becomes the option label).
- Deduplicate by `value`.
- Drop Completion Status options whose value/label token is **Under Construction**.
- Resolve a saved draft value (id, slug, nested `{ id }`, or label) back to the catalog option `value` for controlled selects.
- When the Master API omits furnishing lists, `withPropertyFormOptionFallbacks` fills the existing search-filter values so Furnishing Status still renders. **Floor** options are always cleared (`floorLevelOptions: []`) — the Floor dropdown is removed from Property Information. Land Type has **no** hardcoded FE fallback.
- Nationality has no host fallback list. If `GET /property-form-options` omits `nationalities`, the host omits `nationalityOptions` so the library can show its compatibility defaults until the master list is returned.
- Export `EMPTY_PROPERTY_FORM_OPTIONS_CATALOG` for 404 / missing-data fallback.

# Exports

- `mapPropertyFormOptionsCatalog(data)`
- `resolvePropertyFormMasterOptionValue(saved, options)`
- `ensureSavedMasterOption(options, saved)`
- `withEnsuredLandTypeOption(catalog, savedLandType)`
- `withoutUnderConstructionCompletionOptions(options)`
- `withPropertyFormOptionFallbacks(catalog, labels)`
- `EMPTY_PROPERTY_FORM_OPTIONS_CATALOG`

# Flow Description

1. Create catalog load calls `getPropertyFormOptions()`.
2. The mapper accepts the full response or `data`, merges `groups`, and unwraps known option-list keys.
3. Furnishing and land-type options use `String(id)` when `id` is present so controlled selects stay aligned with saved FKs. Floor catalog entries from the API are discarded by `withPropertyFormOptionFallbacks`.
4. On draft hydrate, `resolvePropertyFormMasterOptionValue` maps the saved DB id/slug/object onto that catalog `value`; `withEnsuredLandTypeOption` appends a missing saved option when needed.
5. On failure, the empty catalog is used and listing purposes fall back in `buildPropertyFormConfig`.

# Dependencies

- [propertyFormOptions.types.md](../types/propertyFormOptions.types.md)
- [buildPropertyFormConfig.md](../i18n/buildPropertyFormConfig.md)
