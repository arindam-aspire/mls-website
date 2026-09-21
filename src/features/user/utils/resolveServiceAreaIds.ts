import type { LocationTaxonomyResponse } from "@/src/features/landing/types/locationTaxonomy.types";
import { buildLocationSuggestions } from "@/src/features/landing/utils/locationTaxonomy.utils";

/**
 * Maps selected service-area option values to numeric taxonomy IDs for
 * `POST /agents/onboarding` (`service_area_ids`).
 */
export function resolveServiceAreaIds(
  values: string[],
  taxonomy: LocationTaxonomyResponse | undefined,
): number[] {
  const suggestions = buildLocationSuggestions(taxonomy);
  const ids = new Set<number>();

  for (const value of values) {
    const match = suggestions.find((suggestion) => suggestion.value === value);
    if (match?.areaId != null) {
      ids.add(match.areaId);
      continue;
    }
    if (match?.cityId != null) {
      ids.add(match.cityId);
    }
  }

  return [...ids];
}
