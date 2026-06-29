import { SELECT_DROPDOWN_EMPTY_VALUE } from "@/src/components/ui";
import type { SearchCriteriaParams } from "../types/savedSearch.types";
import {
  ALL_AMENITY_SLUGS,
  normalizeAmenitySlug,
  parseAmenitiesParam,
  serializeAmenitiesParam,
} from "../constants/searchCriteriaFilter.constants";

const RESIDENTIAL_TYPE = {
  apartment: "apartments",
  villa: "villas",
  building: "buildings",
  farm: "farms",
} as const;

const COMMERCIAL_TYPE = {
  building: "buildings",
  office: "offices",
  business: "businesses",
  shop: "shop",
  showroom: "showrooms",
  warehouse: "warehouse",
  villa: "villas",
} as const;

const LAND_TYPE = {
  residentialLand: "residential-lands",
  commercialLand: "commercial-lands",
  industrialLand: "industrial-lands",
  agriculturalLand: "agricultural-lands",
  mixedUseLand: "mixed-use-lands",
} as const;

const LEGACY_TYPE_SLUGS: Record<string, string> = {
  apartment: RESIDENTIAL_TYPE.apartment,
  villa: RESIDENTIAL_TYPE.villa,
  building: RESIDENTIAL_TYPE.building,
  farm: RESIDENTIAL_TYPE.farm,
  office: COMMERCIAL_TYPE.office,
  business: COMMERCIAL_TYPE.business,
  showroom: COMMERCIAL_TYPE.showroom,
  "residential-land": LAND_TYPE.residentialLand,
  "commercial-land": LAND_TYPE.commercialLand,
  "industrial-land": LAND_TYPE.industrialLand,
  "agricultural-land": LAND_TYPE.agriculturalLand,
  "mixed-use-land": LAND_TYPE.mixedUseLand,
};

const LAND_UTILITIES_TYPES = new Set<string>([
  LAND_TYPE.residentialLand,
  LAND_TYPE.commercialLand,
  LAND_TYPE.industrialLand,
  LAND_TYPE.mixedUseLand,
]);

const LAND_ZONED_USE_TYPES = new Set<string>([
  LAND_TYPE.commercialLand,
  LAND_TYPE.industrialLand,
  LAND_TYPE.mixedUseLand,
]);

const LAND_ELECTRICITY_TYPES = LAND_UTILITIES_TYPES;

function resolveTypeSlug(type: string | undefined) {
  if (!type || type === SELECT_DROPDOWN_EMPTY_VALUE) {
    return undefined;
  }

  return LEGACY_TYPE_SLUGS[type] ?? type;
}

export function showBedrooms(category: string) {
  return category === "residential";
}

export function showRooms(category: string) {
  return category === "commercial";
}

export function showBathrooms(category: string) {
  return category === "residential" || category === "commercial";
}

export function showParking(category: string) {
  return category === "residential" || category === "commercial";
}

export function showMinMaxArea(category: string) {
  return category === "residential" || category === "commercial";
}

export function showPropertyAge(category: string) {
  return category === "residential" || category === "commercial";
}

export function showMinMaxPlotArea(category: string) {
  return category === "land";
}

export function showGovernorate(category: string) {
  return category === "land";
}

export function showDirectorate(category: string) {
  return category === "land";
}

export function showVillage(category: string) {
  return category === "land";
}

export function showFurnitureStatus(category: string, type: string | undefined) {
  const typeSlug = resolveTypeSlug(type);

  if (category !== "residential" || !typeSlug) {
    return false;
  }

  return (
    typeSlug === RESIDENTIAL_TYPE.apartment ||
    typeSlug === RESIDENTIAL_TYPE.villa
  );
}

export function showFloorLevel(category: string, type: string | undefined) {
  const typeSlug = resolveTypeSlug(type);

  if (!typeSlug) {
    return false;
  }

  if (category === "residential") {
    return (
      typeSlug === RESIDENTIAL_TYPE.apartment ||
      typeSlug === RESIDENTIAL_TYPE.building
    );
  }

  if (category === "commercial") {
    return (
      typeSlug === COMMERCIAL_TYPE.building ||
      typeSlug === COMMERCIAL_TYPE.office
    );
  }

  return false;
}

export function showParcelName(category: string, type: string | undefined) {
  return category === "land" && Boolean(resolveTypeSlug(type));
}

export function isAmenityVisible(
  slug: string,
  category: string,
  type: string | undefined,
) {
  const typeSlug = resolveTypeSlug(type);
  const amenitySlug = normalizeAmenitySlug(slug);

  switch (amenitySlug) {
    case "alarmSystem":
    case "parkingAvailable":
      return category === "residential" || category === "commercial";
    case "balcony":
      return category === "residential" && typeSlug === RESIDENTIAL_TYPE.apartment;
    case "builtInCloset":
      return (
        category === "residential" &&
        (typeSlug === RESIDENTIAL_TYPE.apartment ||
          typeSlug === RESIDENTIAL_TYPE.villa)
      );
    case "garden":
      return (
        category === "residential" &&
        (typeSlug === RESIDENTIAL_TYPE.villa || typeSlug === RESIDENTIAL_TYPE.farm)
      );
    case "homeAutomation":
      return (
        category === "residential" &&
        (typeSlug === RESIDENTIAL_TYPE.apartment ||
          typeSlug === RESIDENTIAL_TYPE.villa)
      );
    case "gymAccess":
      return category === "residential" && typeSlug === RESIDENTIAL_TYPE.apartment;
    case "loadingAccess":
    case "storageArea":
      return category === "commercial" && typeSlug === COMMERCIAL_TYPE.warehouse;
    case "displayFrontage":
      return (
        category === "commercial" &&
        (typeSlug === COMMERCIAL_TYPE.shop ||
          typeSlug === COMMERCIAL_TYPE.showroom)
      );
    case "airConditioning":
      return (
        category === "commercial" &&
        (typeSlug === COMMERCIAL_TYPE.office ||
          typeSlug === COMMERCIAL_TYPE.business ||
          typeSlug === COMMERCIAL_TYPE.shop ||
          typeSlug === COMMERCIAL_TYPE.showroom)
      );
    case "roadAccess":
      return category === "land";
    case "utilitiesAvailable":
      return category === "land" && Boolean(typeSlug && LAND_UTILITIES_TYPES.has(typeSlug));
    case "zonedUse":
      return category === "land" && Boolean(typeSlug && LAND_ZONED_USE_TYPES.has(typeSlug));
    case "waterSource":
      return category === "land" && typeSlug === LAND_TYPE.agriculturalLand;
    case "electricityNearby":
      return category === "land" && Boolean(typeSlug && LAND_ELECTRICITY_TYPES.has(typeSlug));
    default:
      return false;
  }
}

export function getVisibleAmenitySlugs(
  category: string,
  type: string | undefined,
): string[] {
  return ALL_AMENITY_SLUGS.filter((slug) =>
    isAmenityVisible(slug, category, type),
  );
}

function pruneAmenitiesForContext(
  amenities: string | undefined,
  category: string,
  type: string | undefined,
) {
  const visible = new Set(getVisibleAmenitySlugs(category, type));
  const parsed = parseAmenitiesParam(amenities);
  const pruned = new Set<string>();

  for (const slug of parsed) {
    const normalized = normalizeAmenitySlug(slug);

    if (visible.has(normalized)) {
      pruned.add(normalized);
    }
  }

  return serializeAmenitiesParam(pruned) ?? ("" as unknown as string);
}

/** Clears advanced params that do not apply after category or type changes. */
export function pruneAdvancedParamsForContext(
  params: SearchCriteriaParams,
  category: string,
  type: string | undefined,
): Partial<SearchCriteriaParams> {
  const typeSlug = resolveTypeSlug(type);
  const partial: Partial<SearchCriteriaParams> = {};

  if (!showBedrooms(category) && params.bedrooms != null) {
    partial.bedrooms = "" as unknown as number;
  }

  if (!showRooms(category) && params.rooms != null) {
    partial.rooms = "" as unknown as number;
  }

  if (!showBathrooms(category) && params.bathrooms != null) {
    partial.bathrooms = "" as unknown as number;
  }

  if (!showParking(category) && params.parking != null) {
    partial.parking = "" as unknown as number;
  }

  if (!showMinMaxArea(category)) {
    if (params.minArea != null) {
      partial.minArea = "" as unknown as number;
    }

    if (params.maxArea != null) {
      partial.maxArea = "" as unknown as number;
    }
  }

  if (!showPropertyAge(category) && params.propertyAge) {
    partial.propertyAge = "";
  }

  if (!showMinMaxPlotArea(category)) {
    if (params.minPlotArea != null) {
      partial.minPlotArea = "" as unknown as number;
    }

    if (params.maxPlotArea != null) {
      partial.maxPlotArea = "" as unknown as number;
    }
  }

  if (!showGovernorate(category) && params.governorate) {
    partial.governorate = "";
  }

  if (!showDirectorate(category) && params.directorate) {
    partial.directorate = "";
  }

  if (!showVillage(category) && params.village) {
    partial.village = "";
  }

  if (!showFurnitureStatus(category, typeSlug) && params.furnitureStatus) {
    partial.furnitureStatus = "";
  }

  if (!showFloorLevel(category, typeSlug) && params.floorLevel) {
    partial.floorLevel = "";
  }

  if (!showParcelName(category, typeSlug) && params.parcelName) {
    partial.parcelName = "";
  }

  const prunedAmenities = pruneAmenitiesForContext(
    params.amenities,
    category,
    typeSlug,
  );

  if (prunedAmenities !== (params.amenities ?? "")) {
    partial.amenities = prunedAmenities;
  }

  return partial;
}
