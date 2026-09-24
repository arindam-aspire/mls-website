# Property i18n (`src/features/property/i18n/`)

Helpers that resolve `next-intl` strings into objects consumed by property screens and `@abdoun/abdoun-library`.

## Files

| File | Purpose |
| --- | --- |
| [buildPropertyFormConfig.md](./buildPropertyFormConfig.md) | Host `PropertyFormConfig` from catalog options + `propertyList.propertyCreate.form` copy |
| `propertyCreateOwnerInfo.i18n.ts` | Owner-step validation messages |
| [propertyLocationDls.i18n.md](./propertyLocationDls.i18n.md) | DLS cascading-select labels (`Governent` → `Directorate` → `Village` → `Parcel` → `Section`, loading/empty/error) |
| [propertyLocationMap.i18n.md](./propertyLocationMap.i18n.md) | Google Map overlay labels (`zoomIn`, Map/Satellite, load errors) |

## Conventions

- Screen hooks call `useTranslations` and pass the translator into these builders.
- New keys must exist in `en`, `ar`, `es`, and `fr`.
