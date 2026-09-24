# File Overview

Location identification field catalogs for property create. Host DLS renders free-text keys on Create Property Location; library Location inputs stay hidden via DOM patch. Review uses these keys/labels.

**Source:** `src/features/property/constants/propertyIdentification.constants.ts`

# Responsibilities

- Catalog built-in (`location_insert.*`) and custom (`identification_fields.*`) keys.
- Drive arrangement-specific visible DLS text fields and prune/hydrate.
- Residential/Commercial **Land Type** remains host-owned: `property_details.land_type_id` from `GET /property-form-options`.
- Empty arrangements still pass `PROPERTY_LAND_IDENTIFICATION_PLACEHOLDER_KEY` so the library does not restore Basin Number.

# Field sets

## Properties (Residential / Commercial)

DLS UI order: Governate → Directorate → Village → Parcel Name → Parcel Number → Section → Land Type → Plot Number → Building → Floor → Apartment.

Free-text keys: `parcel_number`, `plot_number`, `building_number`, `floor_number`, `apartment_number`.

## Land

DLS UI order: Governate → Directorate → Village → Parcel Name → Parcel Number → Section (dropdown) → Plot Number.

Free-text keys: `parcel_number`, `plot_number`. No Land Type.

# Dependencies

- [propertyArrangement.constants.md](./propertyArrangement.constants.md)
- [PropertyLocationDlsFields.md](../components/PropertyLocationDlsFields.md)
- [propertyIdentificationFields.utils.md](../utils/propertyIdentificationFields.utils.md)
