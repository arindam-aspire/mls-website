import type { LocationTaxonomyResponse } from "@/src/features/landing/types/locationTaxonomy.types";
import { buildLocationSuggestions } from "@/src/features/landing/utils/locationTaxonomy.utils";
import type { MultiSelectDropdownOption } from "@/src/components/ui/multi-select-dropdown";

export function buildServiceAreaSelectOptions(
  taxonomy: LocationTaxonomyResponse | undefined,
): MultiSelectDropdownOption[] {
  return buildLocationSuggestions(taxonomy).map((suggestion) => ({
    value: suggestion.value,
    label: suggestion.label,
  }));
}
