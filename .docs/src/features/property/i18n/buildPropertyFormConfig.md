# File Overview

Builds the host `PropertyFormConfig` for `@abdoun/abdoun-library` `PropertyForm` (v0.1.92): master-data option arrays, pricing/identification field definitions, and translated labels.

**Source:** `src/features/property/i18n/buildPropertyFormConfig.ts`

# Responsibilities

- Merge `GET /property-form-options` catalog arrays into library option lists.
- Fall back listing purposes to existing BE values `sale` / `rent` with i18n labels when the catalog is empty.
- Furnishing Status uses catalog arrays when present. If the Master API omits that list, the host fills the existing search-filter values (`furnished` / `unfurnished` / `semi-furnished`) so the library still renders the dropdown. **Floor** is removed from Property Information: `floorLevelOptions` is always `[]` (an explicit empty array — `undefined` would restore the library’s deprecated Ground–Penthouse defaults).
- Nationality uses the catalog when `nationalities` is present. There is no host country list; omitting the array lets the library compatibility defaults render until the Master API returns nationalities.
- Define purpose- and furnishing-aware pricing fields (`furnished_sale_price`, `unfurnished_sale_price`, `furnished_rent_price`, `unfurnished_rent_price`, `semi_furnished_rent_price`). Visible fields follow Listing Purpose + Furnishing Status (Sale+Furnished, Sale+Unfurnished, Rent+Furnished, Rent+Unfurnished, Rent+Semi-Furnished).
- Define **arrangement-aware** identification fields (labels for Review; Location editing is host DLS):
  - **Properties** (Residential / Commercial): Parcel Number, Plot Number, Building, Floor, Apartment (Basin Number removed).
  - **Land:** Parcel Number and Plot Number. Empty arrangements still use a host-only placeholder so the library does not restore default identification fields (including Basin Number).
  - `floor_number` and Land `section` are custom keys stored in `identification_fields`; built-ins map to first-class `location_insert` keys. Legacy free-text `land_type` is not shown (Land Type is a host dropdown on Properties).
- Official DLS hierarchy (Governate → Directorate → Village → Parcel Name → Section) remains host-owned cascading selects, not free-text identification fields. English labels use **Governate** / **Directorate** / **Parcel Name** (form-state label keys use `governent*`, `directorate*`, `parcel*`; API mapping uses `gov_code` / `gov_name`, `dept_*`, and `hod_*`). Arabic DLS display labels live in `src/messages/ar/propertyList.json` (`dls.*` plus Location identification: Plot Number / Building / Floor / Apartment).
- Filter **Under Construction** out of Completion Status. When the catalog is empty, pass Ready / Off-plan / Secondary so the library does not restore its deprecated Under Construction option.
- Disable DLD (`legacyFields.permit_dld_number: false`). Keep emitting legacy `listing_purpose` and `area_ids` during the deprecation window.

# Imports

- `PropertyFormConfig` and related types from `@abdoun/abdoun-library`
- `PropertyFormOptionsCatalog` from `../types/propertyFormOptions.types`
- `PropertyArrangementId` and identification field constants

# Exports

- `buildPropertyFormConfig(t, catalog, arrangement = "properties")`

# Props / Parameters

| Param | Purpose |
| --- | --- |
| `t` | `useTranslations("propertyList.propertyCreate.form")` |
| `catalog` | Mapped option arrays from `mapPropertyFormOptionsCatalog` |
| `arrangement` | `"properties"` \| `"land"` — drives identification field list/order/labels |

# Flow Description

1. `usePropertyCreateScreen` loads form options (404 → empty catalog) and tracks arrangement.
2. This helper builds `config` passed to `PropertyForm`, including the identification field set for the active arrangement.
3. Pricing field `furnishingStatus` values are matched from catalog tokens on option **value, label, and id** (`furnished`, `unfurnished`, `semi*`). When the catalog uses numeric IDs, the pricing field still binds to that option’s `value`.

# Dependencies

- [propertyFormOptions.types.md](../types/propertyFormOptions.types.md)
- [propertyIdentification.constants.md](../constants/propertyIdentification.constants.md)
- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
