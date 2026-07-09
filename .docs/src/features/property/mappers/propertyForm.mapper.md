# File Overview

Maps MLS catalog API shapes into `@abdoun/abdoun-library` `PropertyForm` prop types.

**Source:** `src/features/property/mappers/propertyForm.mapper.ts`

# Responsibilities

- `mapPropertyCategoriesForPropertyForm` — pass-through `PropertyCategory[]` as `categoryTaxonomy`.
- `mapLocationTaxonomyForPropertyForm` — wrap `LocationCity[]` as `{ data, total }` for the library location picker.
- `mapFeatureCatalogForPropertyForm` — map the full `GET /features?is_active=true` catalog to `featuresAndAmenities` (all `FEATURE` and `AMENITY` rows; API `AMENITY` → library `AMENITIES`; other groups → `FEATURE`). No client-side `feature_group` filter — `@abdoun/abdoun-library` `FeatureAndAminitiesSelectionForm` splits the taxonomy-filtered catalog into Features vs Amenities sections.

# Exports

- `mapPropertyCategoriesForPropertyForm`
- `mapLocationTaxonomyForPropertyForm`
- `mapFeatureCatalogForPropertyForm`

# Dependencies

- [propertyTaxonomy.types.md](../../landing/types/propertyTaxonomy.types.md)
- [locationTaxonomy.types.md](../../landing/types/locationTaxonomy.types.md)
- [property.types.md](../types/property.types.md)
