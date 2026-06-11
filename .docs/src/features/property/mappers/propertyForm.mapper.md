# File Overview

Maps MLS catalog API shapes into `@abdoun/abdoun-library` `PropertyForm` prop types.

**Source:** `src/features/property/mappers/propertyForm.mapper.ts`

# Responsibilities

- `mapPropertyCategoriesForPropertyForm` — pass-through `PropertyCategory[]` as `categoryTaxonomy`.
- `mapLocationTaxonomyForPropertyForm` — wrap `LocationCity[]` as `{ data, total }` for the library location picker.
- `mapFeatureCatalogForPropertyForm` — map `FeatureCatalogItem[]` to `featuresAndAmenities` (including `AMENITY` → `AMENITIES` group label).

# Exports

- `mapPropertyCategoriesForPropertyForm`
- `mapLocationTaxonomyForPropertyForm`
- `mapFeatureCatalogForPropertyForm`

# Dependencies

- [propertyTaxonomy.types.md](../../landing/types/propertyTaxonomy.types.md)
- [locationTaxonomy.types.md](../../landing/types/locationTaxonomy.types.md)
- [property.types.md](../types/property.types.md)
