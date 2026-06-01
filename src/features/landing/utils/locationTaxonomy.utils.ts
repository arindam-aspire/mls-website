import type { LocationTaxonomyResponse } from "@/src/features/landing/types/locationTaxonomy.types";
import { getLocationCities } from "@/src/features/landing/types/locationTaxonomy.types";

export const LOCATION_OPTION_SEP = "|";

export type LocationSuggestion = {
  value: string;
  label: string;
  cityId: number;
  cityName: string;
  areaId?: number;
  areaName?: string;
};

export function encodeLocationOptionValue(
  cityName: string,
  locationName?: string,
): string {
  return `${cityName}${LOCATION_OPTION_SEP}${locationName ?? ""}`;
}

export function parseLocationOptionValue(value: string): {
  city: string;
  locations?: string;
} {
  const [city, locations] = value.split(LOCATION_OPTION_SEP);
  return { city, locations: locations || undefined };
}

export function buildLocationSuggestions(
  taxonomy: LocationTaxonomyResponse | undefined,
): LocationSuggestion[] {
  const cities = getLocationCities(taxonomy);
  const suggestions: LocationSuggestion[] = [];

  for (const city of cities) {
    const areas = city.areas ?? [];

    if (areas.length === 0) {
      suggestions.push({
        value: encodeLocationOptionValue(city.name),
        label: city.name,
        cityId: city.id,
        cityName: city.name,
      });
      continue;
    }

    for (const area of areas) {
      suggestions.push({
        value: encodeLocationOptionValue(city.name, area.name),
        label: `${area.name}, ${city.name}`,
        cityId: city.id,
        cityName: city.name,
        areaId: area.id,
        areaName: area.name,
      });
    }
  }

  return suggestions;
}

export function filterLocationSuggestions(
  suggestions: LocationSuggestion[],
  query: string,
  limit = 20,
): LocationSuggestion[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return suggestions.slice(0, limit);
  }

  return suggestions
    .filter((item) => {
      const haystack = [item.label, item.cityName, item.areaName ?? ""]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    })
    .slice(0, limit);
}

function namesMatch(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function getLocationLabelFromParams(
  cityName: string | undefined,
  locationName: string | undefined,
  taxonomy: LocationTaxonomyResponse | undefined,
): string {
  if (!cityName) {
    return "";
  }

  const match = buildLocationSuggestions(taxonomy).find((item) => {
    const parsed = parseLocationOptionValue(item.value);
    return (
      namesMatch(parsed.city, cityName) &&
      namesMatch(parsed.locations ?? "", locationName ?? "")
    );
  });

  if (match) {
    return match.label;
  }

  if (locationName) {
    return `${locationName}, ${cityName}`;
  }

  return cityName;
}

export function findLocationSuggestionByLabel(
  suggestions: LocationSuggestion[],
  label: string,
): LocationSuggestion | undefined {
  const normalized = label.trim().toLowerCase();
  return suggestions.find((item) => item.label.toLowerCase() === normalized);
}
