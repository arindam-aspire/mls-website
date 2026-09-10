# File Overview

Builds the host `PropertyFormConfig` for `@abdoun/abdoun-library` `PropertyForm` (v0.1.91): master-data option arrays, pricing/identification field definitions, and translated labels.

**Source:** `src/features/property/i18n/buildPropertyFormConfig.ts`

# Responsibilities

- Merge `GET /property-form-options` catalog arrays into library option lists.
- Fall back listing purposes to existing BE values `sale` / `rent` with i18n labels when the catalog is empty.
- Furnishing Status and Floor use catalog arrays when present. If the Master API omits those lists, the host fills the existing search-filter values (`furnished` / `unfurnished` / `semi-furnished`, Ground–10–Penthouse) so the library still renders both dropdowns. Empty arrays are not passed through (that hides the fields).
- Nationality uses the catalog when `nationalities` is present. There is no host country list; omitting the array lets the library compatibility defaults render until the Master API returns nationalities.
- Define purpose- and furnishing-aware pricing fields (`furnished_sale_price`, `unfurnished_sale_price`, `furnished_rent_price`, `unfurnished_rent_price`, `semi_furnished_rent_price`).
- Define identification fields (apartment, plot, basin, parcel, building).
- Disable DLD (`legacyFields.permit_dld_number: false`). Keep emitting legacy `listing_purpose` and `area_ids` during the deprecation window.

# Imports

- `PropertyFormConfig` and related types from `@abdoun/abdoun-library`
- `PropertyFormOptionsCatalog` from `../types/propertyFormOptions.types`

# Exports

- `buildPropertyFormConfig(t, catalog)`

# Props / Parameters

| Param | Purpose |
| --- | --- |
| `t` | `useTranslations("propertyList.propertyCreate.form")` |
| `catalog` | Mapped option arrays from `mapPropertyFormOptionsCatalog` |

# Flow Description

1. `usePropertyCreateScreen` loads form options (404 → empty catalog).
2. This helper builds `config` passed to `PropertyForm`.
3. Pricing field `furnishingStatus` values are matched from catalog tokens on option **value, label, and id** (`furnished`, `unfurnished`, `semi*`). When the catalog uses numeric IDs, the pricing field still binds to that option’s `value`.

# Dependencies

- [propertyFormOptions.types.md](../types/propertyFormOptions.types.md)
- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
