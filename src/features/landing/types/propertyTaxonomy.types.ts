export type PropertyTypeItem = {
  id: number;
  category_id: number;
  name: string;
  slug: string;
};

export type PropertyCategory = {
  id: number;
  name: string;
  slug: string;
  property_types: PropertyTypeItem[];
};

export type PropertyTaxonomyResponse = {
  success: boolean;
  message: string | null;
  data: {
    data: PropertyCategory[];
    total: number;
  };
  error: unknown;
  meta: Record<string, unknown>;
};

export function getPropertyCategories(
  taxonomy: PropertyTaxonomyResponse | undefined,
): PropertyCategory[] {
  return taxonomy?.data?.data ?? [];
}
