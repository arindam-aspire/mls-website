import type {
  FeatureCatalogItem,
  PropertyFeatureDefinition,
} from "../types/property.types";

function toLibraryFeatureGroup(
  featureGroup: FeatureCatalogItem["feature_group"],
): PropertyFeatureDefinition["feature_group"] {
  return featureGroup === "AMENITY" ? "AMENITIES" : "FEATURE";
}

export function mapFeatureCatalogItems(
  items: FeatureCatalogItem[],
): PropertyFeatureDefinition[] {
  return items.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    feature_group: toLibraryFeatureGroup(item.feature_group),
  }));
}
