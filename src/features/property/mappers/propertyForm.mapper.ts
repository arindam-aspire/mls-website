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

type LibraryFeatureItem = PropertyFormFeaturesAndAmenities[number];

function isLibraryFeatureGroup(featureGroup: string): boolean {
  return featureGroup.toUpperCase() === "FEATURE";
}

function featureTaxonomyKey(
  id: number,
  categoryId: number | null,
  propertyTypeId: number | null,
): string {
  return `${id}:${categoryId ?? ""}:${propertyTypeId ?? ""}`;
}

/**
 * `@abdoun/abdoun-library` keeps a FEATURE row only when both
 * `category_id` and `property_type_id` equal the selection. Amenities already
 * keep shared rows (null category or type). Clone category-level and fully
 * shared FEATURE rows onto each matching taxonomy pair so Apartment (and every
 * other type) can select type-specific features and shared features together.
 */
function expandSharedFeaturesForLibraryTaxonomy(
  items: LibraryFeatureItem[],
  categories: PropertyCategory[],
): LibraryFeatureItem[] {
  const pairs = categories.flatMap((category) =>
    category.property_types.map((propertyType) => ({
      categoryId: category.id,
      categoryName: category.name,
      propertyTypeId: propertyType.id,
      propertyTypeName: propertyType.name,
    })),
  );

  if (pairs.length === 0) {
    return items;
  }

  const seen = new Set(
    items.map((item) =>
      featureTaxonomyKey(item.id, item.category_id, item.property_type_id),
    ),
  );
  const expanded = [...items];

  const pushClone = (
    item: LibraryFeatureItem,
    categoryId: number,
    categoryName: string,
    propertyTypeId: number,
    propertyTypeName: string,
  ) => {
    const key = featureTaxonomyKey(item.id, categoryId, propertyTypeId);
    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    expanded.push({
      ...item,
      category: categoryName,
      category_id: categoryId,
      property_type: propertyTypeName,
      property_type_id: propertyTypeId,
    });
  };

  for (const item of items) {
    if (!isLibraryFeatureGroup(item.feature_group)) {
      continue;
    }

    const hasCategory = item.category_id != null;
    const hasType = item.property_type_id != null;

    if (hasCategory && hasType) {
      continue;
    }

    if (hasCategory && !hasType) {
      for (const pair of pairs) {
        if (pair.categoryId !== item.category_id) {
          continue;
        }

        pushClone(
          item,
          pair.categoryId,
          pair.categoryName,
          pair.propertyTypeId,
          pair.propertyTypeName,
        );
      }
      continue;
    }

    if (!hasCategory && hasType) {
      const pair = pairs.find(
        (entry) => entry.propertyTypeId === item.property_type_id,
      );
      if (!pair) {
        continue;
      }

      pushClone(
        item,
        pair.categoryId,
        pair.categoryName,
        pair.propertyTypeId,
        pair.propertyTypeName,
      );
      continue;
    }

    for (const pair of pairs) {
      pushClone(
        item,
        pair.categoryId,
        pair.categoryName,
        pair.propertyTypeId,
        pair.propertyTypeName,
      );
    }
  }

  return expanded;
}

export function mapFeatureCatalogForPropertyForm(
  items: FeatureCatalogItem[],
  categories: PropertyCategory[] = [],
): PropertyFormFeaturesAndAmenities {
  const mapped = items.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    feature_group: toLibraryFeatureGroup(item.feature_group),
    category: item.category?.name ?? null,
    category_id: item.category_id,
    property_type: item.property_type?.name ?? null,
    property_type_id: item.property_type_id,
  }));

  return expandSharedFeaturesForLibraryTaxonomy(mapped, categories);
}
