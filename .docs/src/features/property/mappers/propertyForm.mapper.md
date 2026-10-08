# File Overview

Maps MLS catalog API shapes into `@abdoun/abdoun-library` `PropertyForm` prop types.

**Source:** `src/features/property/mappers/propertyForm.mapper.ts`

# Responsibilities

- `mapPropertyCategoriesForPropertyForm` — pass-through `PropertyCategory[]` as `categoryTaxonomy`.
- `mapLocationTaxonomyForPropertyForm` — wrap `LocationCity[]` as `{ data, total }` for the library location picker.
- `mapFeatureCatalogForPropertyForm(items, categories?)` — map the full `GET /features?is_active=true` catalog to `featuresAndAmenities` (all `FEATURE` and `AMENITY` rows; API `AMENITY` → library `AMENITIES`; other groups → `FEATURE`). No client-side `feature_group` filter — `@abdoun/abdoun-library` splits the taxonomy-filtered catalog into Features vs Amenities.
- The library keeps a **FEATURE** row only when both `category_id` and `property_type_id` equal the selection, so category-level and fully shared features never appear. This mapper clones those FEATURE rows onto each matching taxonomy pair (using category/type ids from `GET /property-taxonomy`, not hardcoded names) so Apartment and every other type can select type-specific features and shared features together. Exact type matches are unchanged. Amenities are not cloned; the library already includes shared amenity rows.

# Exports

- `mapPropertyCategoriesForPropertyForm`
- `mapLocationTaxonomyForPropertyForm`
- `mapFeatureCatalogForPropertyForm`

# Dependencies

- [propertyTaxonomy.types.md](../../landing/types/propertyTaxonomy.types.md)
- [locationTaxonomy.types.md](../../landing/types/locationTaxonomy.types.md)
- [property.types.md](../types/property.types.md)
