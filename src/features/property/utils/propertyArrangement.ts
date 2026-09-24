import {
  DEFAULT_PROPERTY_ARRANGEMENT,
  PROPERTY_ARRANGEMENT_CATEGORY_SLUGS,
  type PropertyArrangementId,
} from "../constants/propertyArrangement.constants";

type CategoryLike = {
  slug: string;
};

export function isPropertyArrangementId(
  value: string,
): value is PropertyArrangementId {
  return value === "properties" || value === "land";
}

export function resolvePropertyArrangementFromCategorySlug(
  categorySlug: string | null | undefined,
): PropertyArrangementId {
  const slug = categorySlug?.trim().toLowerCase() ?? "";

  if (
    PROPERTY_ARRANGEMENT_CATEGORY_SLUGS.land.some(
      (landSlug) => landSlug === slug,
    )
  ) {
    return "land";
  }

  return DEFAULT_PROPERTY_ARRANGEMENT;
}

export function filterCategoriesByArrangement<T extends CategoryLike>(
  categories: T[],
  arrangement: PropertyArrangementId,
): T[] {
  const allowed = new Set(PROPERTY_ARRANGEMENT_CATEGORY_SLUGS[arrangement]);
  return categories.filter((category) => allowed.has(category.slug));
}

export function defaultCategorySlugForArrangement<T extends CategoryLike>(
  categories: T[],
  arrangement: PropertyArrangementId,
): string {
  return filterCategoriesByArrangement(categories, arrangement)[0]?.slug ?? "";
}

export function isCategoryInArrangement(
  categorySlug: string,
  arrangement: PropertyArrangementId,
): boolean {
  return PROPERTY_ARRANGEMENT_CATEGORY_SLUGS[arrangement].includes(categorySlug);
}
