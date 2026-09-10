import {
  encodeLocationOptionValue,
  parseLocationOptionValue,
} from "@/src/features/landing/utils/locationTaxonomy.utils";

export function parseSearchLocationValues(
  city: string | undefined,
  locations: string | undefined,
): string[] {
  const rawLocations = locations?.trim() ?? "";
  const rawCity = city?.trim() ?? "";

  if (!rawLocations && !rawCity) {
    return [];
  }

  if (rawLocations.includes("|")) {
    return Array.from(
      new Set(
        rawLocations
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    );
  }

  if (rawLocations.includes(",") && rawCity) {
    return Array.from(
      new Set(
        rawLocations
          .split(",")
          .map((area) => area.trim())
          .filter(Boolean)
          .map((area) => encodeLocationOptionValue(rawCity, area)),
      ),
    );
  }

  if (rawCity) {
    return [encodeLocationOptionValue(rawCity, rawLocations || undefined)];
  }

  return [];
}

export function serializeSearchLocationValues(values: string[]): {
  city: string;
  locations: string;
} {
  const uniqueValues = Array.from(
    new Set(values.map((value) => value.trim()).filter(Boolean)),
  );

  if (uniqueValues.length === 0) {
    return { city: "", locations: "" };
  }

  if (uniqueValues.length === 1) {
    const parsed = parseLocationOptionValue(uniqueValues[0] ?? "");
    return {
      city: parsed.city,
      locations: parsed.locations ?? "",
    };
  }

  const cities = Array.from(
    new Set(
      uniqueValues
        .map((value) => parseLocationOptionValue(value).city.trim())
        .filter(Boolean),
    ),
  );

  return {
    city: cities.length === 1 ? (cities[0] ?? "") : "",
    locations: uniqueValues.join(","),
  };
}
