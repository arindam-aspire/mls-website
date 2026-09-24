# File Overview

Presentational DLS Location fields inserted into the library-owned Create Property Location form.

**Source:** `src/features/property/components/PropertyLocationDlsFields.tsx`

# Responsibilities

- Render the host-owned **DLS** block by property category (order assembled in `usePropertyCreateScreen`):
  - **Residential / Commercial:** Governate → Directorate → Village → Parcel Name → Parcel Number → Section → Land Type → Plot Number → Building → Floor → Apartment
  - **Land:** Governate → Directorate → Village → Parcel Name → Parcel Number → Section (dropdown) → Plot Number
- Mount into `PropertyForm` Location via React portal (library has no DLS slot).
- Insert the portal **before** the Show Location switch.
- Remain presentational: options/values/errors/retry from hooks. Selects use `Select`; text fields use `Input`.

# Imports

- `Button`, `Input`, `Select` from `@/src/components/ui`
- `PropertyLocationDlsFieldModel` from `usePropertyLocationDls`
- `Landmark` from `lucide-react`
- `createPortal` from `react-dom`

# Props / Parameters

| Prop | Purpose |
| --- | --- |
| `sectionTitle` | Localized DLS heading |
| `fields` | Cascading selects, Land Type (Properties), and free-text identification models |

# Actions / Inputs

- Cascading DLS selects; child levels disabled until parent is set; Retry re-fetches a failing level.
- Parcel Number / Plot Number / Building / Floor / Apartment (Properties) and Parcel Number / Plot Number (Land) write into `location_insert`.

# UI Details

- Semantic colors, `rounded-lg` selects, Location form 2-column grid via `contents`.
- Library identification inputs stay hidden by DOM patches so this block is the only editor.

# Flow Description

1. Location step renders this before Show Location.
2. Portal hosts DLS heading + fields from `/dls-locations` (Land Type from form-options for Properties).
3. Outbound `payload.location` is lat/lng + DLS codes/names + identification (+ `show_location`); `land_type_id` on `property_details`.

# Dependencies

- [../hooks/usePropertyLocationDls.md](../hooks/usePropertyLocationDls.md)
- [../hooks/usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
- [../constants/propertyIdentification.constants.md](../constants/propertyIdentification.constants.md)

# Notes

- Preferred long-term fix: library Location DLS slot.
