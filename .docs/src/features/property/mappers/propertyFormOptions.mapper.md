# File Overview

Maps `GET /property-form-options` payload arrays into `@abdoun/abdoun-library` `PropertyFormOption` lists.

**Source:** `src/features/property/mappers/propertyFormOptions.mapper.ts`

# Responsibilities

- Unwrap nested `data` envelopes (`response`, `response.data`, `response.data.data`).
- Unwrap option lists that arrive as arrays or `{ items | data | results }`.
- Normalize `id` / `value` / `slug` / `code` + `label` / `name` items.
- Prefer master-table **IDs** as the select `value` for Furnishing Status and Floor so draft payloads persist FKs.
- Use slug/value first for other option groups (listing purpose, completion, orientation, nationality), falling back to `id` / `nationality_id` when slug is absent.
- Read nationality lists from `nationalities` or `nationality` (and any key matching `nationality*option*`).
- Deduplicate by `value`.
- Drop Completion Status options whose value/label token is **Under Construction**.
- Resolve a saved draft value (id, slug, nested `{ id }`, or label) back to the catalog option `value` for controlled selects.
- When the Master API omits furnishing or floor lists, `withPropertyFormOptionFallbacks` fills the existing search-filter values so both dropdowns still render.
- Nationality has no host fallback list. If `GET /property-form-options` omits `nationalities`, the host omits `nationalityOptions` so the library can show its compatibility defaults until the master list is returned.
- Export `EMPTY_PROPERTY_FORM_OPTIONS_CATALOG` for 404 / missing-data fallback.

# Exports

- `mapPropertyFormOptionsCatalog(data)`
- `resolvePropertyFormMasterOptionValue(saved, options)`
- `ensureSavedMasterOption(options, saved)`
- `withEnsuredFloorOption(catalog, savedFloor)`
- `withoutUnderConstructionCompletionOptions(options)`
- `withPropertyFormOptionFallbacks(catalog, labels)`
- `EMPTY_PROPERTY_FORM_OPTIONS_CATALOG`

# Flow Description

1. Create catalog load calls `getPropertyFormOptions()`.
2. The mapper accepts the full response or `data` and unwraps known option-list keys.
3. Furnishing and floor options use `String(id)` when `id` is present so `PropertyForm` stays controlled by the same value that is saved.
4. On draft hydrate, `resolvePropertyFormMasterOptionValue` maps the saved DB id/slug/object onto that catalog `value`.
5. On failure, the empty catalog is used and listing purposes fall back in `buildPropertyFormConfig`.

# Dependencies

- [propertyFormOptions.types.md](../types/propertyFormOptions.types.md)
- [buildPropertyFormConfig.md](../i18n/buildPropertyFormConfig.md)
