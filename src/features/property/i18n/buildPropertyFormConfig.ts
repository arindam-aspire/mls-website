import type {
  PropertyFormConfig,
  PropertyFormOption,
  PropertyIdentificationFieldDefinition,
  PropertyPricingFieldDefinition,
} from "@abdoun/abdoun-library";
import { withoutUnderConstructionCompletionOptions } from "../mappers/propertyFormOptions.mapper";
import type { PropertyFormOptionsCatalog } from "../types/propertyFormOptions.types";

type PropertyFormConfigTranslation = {
  (key: "listingPurposeLabel"): string;
  (key: "listingPurposePlaceholder"): string;
  (key: "areaLabel"): string;
  (key: "areaPlaceholder"): string;
  (key: "yearBuiltLabel"): string;
  (key: "yearBuiltPlaceholder"): string;
  (key: "floorLevelLabel"): string;
  (key: "furnishingStatusLabel"): string;
  (key: "setAsPrimaryImage"): string;
  (key: "listingPurposes.sale"): string;
  (key: "listingPurposes.rent"): string;
  (key: "ownerMode.searchExisting"): string;
  (key: "ownerMode.createNew"): string;
  (key: "ownerMode.searchPlaceholder"): string;
  (key: "ownerMode.searchEmpty"): string;
  (key: "ownerMode.searchLoading"): string;
  (key: "ownerMode.selectOwner"): string;
  (key: "ownerMode.selectedOwner"): string;
  (key: "ownerMode.duplicateDetected"): string;
  (key: "ownerMode.duplicateSelectExisting"): string;
  (key: "pricing.furnishedSalePrice"): string;
  (key: "pricing.unfurnishedSalePrice"): string;
  (key: "pricing.furnishedRentPrice"): string;
  (key: "pricing.unfurnishedRentPrice"): string;
  (key: "pricing.semiFurnishedRentPrice"): string;
  (key: "identification.apartmentNumber"): string;
  (key: "identification.plotNumber"): string;
  (key: "identification.basinNumber"): string;
  (key: "identification.parcelNumber"): string;
  (key: "identification.buildingNumber"): string;
  (key: "completionStatuses.ready"): string;
  (key: "completionStatuses.offPlan"): string;
  (key: "completionStatuses.secondary"): string;
  (key: "map.mapTitle"): string;
  (key: "map.latitude"): string;
  (key: "map.longitude"): string;
  (key: "map.coordinates"): string;
  (key: "map.selectPinHint"): string;
};

function mergeOptions(
  catalogOptions: PropertyFormOption[],
  fallbackOptions: PropertyFormOption[],
): PropertyFormOption[] | undefined {
  if (catalogOptions.length > 0) {
    return catalogOptions;
  }

  if (fallbackOptions.length > 0) {
    return fallbackOptions;
  }

  return undefined;
}

function normalizeOptionToken(value: string): string {
  return value.toLowerCase().replace(/[_-\s]/g, "");
}

function optionSearchToken(option: PropertyFormOption): string {
  return normalizeOptionToken(
    [option.value, option.label, option.id == null ? "" : String(option.id)]
      .filter(Boolean)
      .join(" "),
  );
}

function findFurnishingValue(
  options: PropertyFormOption[],
  kind: "furnished" | "unfurnished" | "semi",
): string {
  const match = options.find((option) => {
    const token = optionSearchToken(option);
    if (kind === "unfurnished") {
      return token.includes("unfurnished");
    }
    if (kind === "semi") {
      return token.includes("semi");
    }
    return (
      token.includes("furnished") &&
      !token.includes("unfurnished") &&
      !token.includes("semi")
    );
  });

  if (match) {
    return match.value;
  }

  if (options.length > 0) {
    return "";
  }

  if (kind === "semi") {
    return "semi_furnished";
  }

  return kind;
}

export function buildPropertyFormConfig(
  t: PropertyFormConfigTranslation,
  catalog: PropertyFormOptionsCatalog,
): PropertyFormConfig {
  const listingPurposeFallback: PropertyFormOption[] = [
    { value: "sale", label: t("listingPurposes.sale") },
    { value: "rent", label: t("listingPurposes.rent") },
  ];

  const furnishedValue = findFurnishingValue(
    catalog.furnishingStatusOptions,
    "furnished",
  );
  const unfurnishedValue = findFurnishingValue(
    catalog.furnishingStatusOptions,
    "unfurnished",
  );
  const semiFurnishedValue = findFurnishingValue(
    catalog.furnishingStatusOptions,
    "semi",
  );

  const identificationFields: PropertyIdentificationFieldDefinition[] = [
    { key: "apartment_number", label: t("identification.apartmentNumber") },
    { key: "plot_number", label: t("identification.plotNumber") },
    { key: "basin_number", label: t("identification.basinNumber") },
    { key: "parcel_number", label: t("identification.parcelNumber") },
    { key: "building_number", label: t("identification.buildingNumber") },
  ];

  const completionStatusFallback: PropertyFormOption[] = [
    { value: "ready", label: t("completionStatuses.ready") },
    { value: "off-plan", label: t("completionStatuses.offPlan") },
    { value: "secondary", label: t("completionStatuses.secondary") },
  ];

  const pricingFields: PropertyPricingFieldDefinition[] = [
    {
      key: "furnished_sale_price",
      label: t("pricing.furnishedSalePrice"),
      purpose: "sale",
      furnishingStatus: furnishedValue,
    },
    {
      key: "unfurnished_sale_price",
      label: t("pricing.unfurnishedSalePrice"),
      purpose: "sale",
      furnishingStatus: unfurnishedValue,
    },
    {
      key: "furnished_rent_price",
      label: t("pricing.furnishedRentPrice"),
      purpose: "rent",
      furnishingStatus: furnishedValue,
    },
    {
      key: "unfurnished_rent_price",
      label: t("pricing.unfurnishedRentPrice"),
      purpose: "rent",
      furnishingStatus: unfurnishedValue,
    },
    {
      key: "semi_furnished_rent_price",
      label: t("pricing.semiFurnishedRentPrice"),
      purpose: "rent",
      furnishingStatus: semiFurnishedValue,
    },
  ];

  return {
    listingPurposeOptions: mergeOptions(
      catalog.listingPurposeOptions,
      listingPurposeFallback,
    ),
    furnishingStatusOptions: mergeOptions(catalog.furnishingStatusOptions, []),
    floorLevelOptions: mergeOptions(catalog.floorLevelOptions, []),
    completionStatusOptions: mergeOptions(
      withoutUnderConstructionCompletionOptions(catalog.completionStatusOptions),
      completionStatusFallback,
    ),
    orientationOptions: mergeOptions(catalog.orientationOptions, []),
    nationalityOptions: mergeOptions(catalog.nationalityOptions, []),
    ownerModeLabels: {
      searchExisting: t("ownerMode.searchExisting"),
      createNew: t("ownerMode.createNew"),
      searchPlaceholder: t("ownerMode.searchPlaceholder"),
      searchEmpty: t("ownerMode.searchEmpty"),
      searchLoading: t("ownerMode.searchLoading"),
      selectOwner: t("ownerMode.selectOwner"),
      selectedOwner: t("ownerMode.selectedOwner"),
      duplicateDetected: t("ownerMode.duplicateDetected"),
      duplicateSelectExisting: t("ownerMode.duplicateSelectExisting"),
    },
    pricingFieldLabels: {
      furnishedSalePrice: t("pricing.furnishedSalePrice"),
      unfurnishedSalePrice: t("pricing.unfurnishedSalePrice"),
      furnishedRentPrice: t("pricing.furnishedRentPrice"),
      unfurnishedRentPrice: t("pricing.unfurnishedRentPrice"),
      semiFurnishedRentPrice: t("pricing.semiFurnishedRentPrice"),
    },
    pricingFields,
    identificationFieldLabels: {
      apartmentNumber: t("identification.apartmentNumber"),
      plotNumber: t("identification.plotNumber"),
      basinNumber: t("identification.basinNumber"),
      parcelNumber: t("identification.parcelNumber"),
      buildingNumber: t("identification.buildingNumber"),
    },
    identificationFields,
    mapLocationLabels: {
      mapTitle: t("map.mapTitle"),
      latitude: t("map.latitude"),
      longitude: t("map.longitude"),
      coordinates: t("map.coordinates"),
      selectPinHint: t("map.selectPinHint"),
    },
    setAsPrimaryImageLabel: t("setAsPrimaryImage"),
    yearBuiltLabel: t("yearBuiltLabel"),
    yearBuiltPlaceholder: t("yearBuiltPlaceholder"),
    floorLevelLabel: t("floorLevelLabel"),
    furnishingStatusLabel: t("furnishingStatusLabel"),
    listingPurposeLabel: t("listingPurposeLabel"),
    listingPurposePlaceholder: t("listingPurposePlaceholder"),
    areaLabel: t("areaLabel"),
    areaPlaceholder: t("areaPlaceholder"),
    legacyFields: {
      permit_dld_number: false,
      listing_purpose: true,
      area_ids: true,
    },
  };
}
