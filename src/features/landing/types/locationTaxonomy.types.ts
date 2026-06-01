export type LocationArea = {
  id: number;
  name: string;
};

export type LocationCity = {
  id: number;
  name: string;
  areas: LocationArea[];
};

export type LocationTaxonomyData =
  | LocationCity[]
  | {
      data: LocationCity[];
      total: number;
    };

export type LocationTaxonomyResponse = {
  success: boolean;
  message: string | null;
  data: LocationTaxonomyData;
  error: unknown;
  meta: Record<string, unknown>;
};

export function getLocationCities(
  taxonomy: LocationTaxonomyResponse | undefined,
): LocationCity[] {
  const payload = taxonomy?.data;

  if (payload == null) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  return payload.data ?? [];
}

/** @deprecated Use getLocationCities */
export function getLocationCategories(
  taxonomy: LocationTaxonomyResponse | undefined,
): LocationCity[] {
  return getLocationCities(taxonomy);
}
