# File Overview

Reads, writes, prunes, and validates arrangement-aware Location identification values for Create Property DLS.

**Source:** `src/features/property/utils/propertyIdentificationFields.utils.ts`

# Responsibilities

- Keep arrangement-allowed free-text values (`parcel_number` / plot / building / floor / apartment on Properties; `parcel_number` + `plot_number` on Land).
- Always clear Basin Number, the host placeholder key, and legacy free-text `land_type`.
- Clear `property_details.land_type_id` when arrangement is Land.
- Validate Floor as numeric when it applies.
- `getLocationIdentificationValue` / `withLocationIdentificationValue` map built-ins onto `location_insert` and custom keys onto `identification_fields`.

# Exports

| Export | Purpose |
| --- | --- |
| `isValidNumericIdentificationValue` | Floor (and other numeric ID) format check |
| `extractPropertyFormIdentification` | Snapshot host DLS text fields so library step emissions cannot wipe them |
| `getLocationIdentificationValue` | Read a built-in or custom identification key |
| `withLocationIdentificationValue` | Write a built-in or custom identification key |
| `pruneLocationIdentificationForArrangement` | Keep allowed keys on `location_insert` |
| `prunePropertyFormIdentificationForArrangement` | Prune form values + Land Type on Land |
| `validateLocationIdentificationForArrangement` | Floor format errors keyed by `floor_number` |

# Dependencies

- [propertyIdentification.constants.md](../constants/propertyIdentification.constants.md)
- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
