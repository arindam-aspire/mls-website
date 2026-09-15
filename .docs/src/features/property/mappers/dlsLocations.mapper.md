# File Overview

Maps official DLS API rows and payload aliases into Add Property select options and host location fields.

**Source:** `src/features/property/mappers/dlsLocations.mapper.ts`

# Responsibilities

- Unwrap `GET /dls-locations` `data.items` (or a bare array).
- Map `{ code, name }` to `SelectOption` values/labels. Duplicate names append the code.
- Extract `gov_code` / `gov_name` / `dept_*` / `vill_*` / `hod_*` / `sect_*` from location, property details, or `identification_fields`, including Excel-style aliases (`GOV_CODE`, `governorate`, …).
- Apply a DLS selection onto a location or details object, omitting empty keys so unsaved-change snapshots stay clean.

# Exports

- `getDlsLocationItems(response)`
- `mapDlsLocationItemsToSelectOptions(items, selectedCode?, selectedName?)`
- `extractPropertyLocationDls(...sources)`
- `applyPropertyLocationDls(location, dls)`
- `findDlsLocationName(items, code)`

# Dependencies

- [dls.types.md](../types/dls.types.md)
- [propertyDraftSubmission.mapper.md](./propertyDraftSubmission.mapper.md)
- [usePropertyLocationDls.md](../hooks/usePropertyLocationDls.md)
