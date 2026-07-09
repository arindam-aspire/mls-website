import type { LocationCity } from "@/src/features/landing/types/locationTaxonomy.types";
import type { PropertyCategory } from "@/src/features/landing/types/propertyTaxonomy.types";
import type { FeatureCatalogItem } from "@/src/features/property/types/property.types";
import type { PropertyFormProps } from "@abdoun/abdoun-library";

type PropertyFormCategoryTaxonomy = PropertyFormProps["categoryTaxonomy"];
type PropertyFormLocationTaxonomy = PropertyFormProps["locationTaxonomy"];
type PropertyFormFeaturesAndAmenities = PropertyFormProps["featuresAndAmenities"];

function toLibraryFeatureGroup(
  featureGroup: FeatureCatalogItem["feature_group"],
): string {
  const normalized = featureGroup.toUpperCase();

  if (normalized === "AMENITY" || normalized === "AMENITIES") {
    return "AMENITIES";
  }

  return "FEATURE";
}

export function mapPropertyCategoriesForPropertyForm(
  categories: PropertyCategory[],
): PropertyFormCategoryTaxonomy {
  return categories;
}

export function mapLocationTaxonomyForPropertyForm(
  cities: LocationCity[],
  total?: number,
): PropertyFormLocationTaxonomy {
  return {
    data: cities,
    total: total ?? cities.length,
  };
}

export function mapFeatureCatalogForPropertyForm(
  items: FeatureCatalogItem[],
): PropertyFormFeaturesAndAmenities {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    feature_group: toLibraryFeatureGroup(item.feature_group),
    category: item.category?.name ?? null,
    category_id: item.category_id,
    property_type: item.property_type?.name ?? null,
    property_type_id: item.property_type_id,
  }));
}
