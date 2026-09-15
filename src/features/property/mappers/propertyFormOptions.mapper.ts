import type { PropertyFormOption } from "@abdoun/abdoun-library";
import {
  FLOOR_OPTIONS,
  FURNITURE_STATUS_OPTIONS,
} from "../constants/propertyListAdvancedFilters.constants";
import type {
  PropertyFormOptionItem,
  PropertyFormOptionList,
  PropertyFormOptionsCatalog,
  PropertyFormOptionsData,
  PropertyFormOptionsResponse,
} from "../types/propertyFormOptions.types";

const OPTION_LIST_KEYS = [
  "listing_purposes",
  "listingPurposes",
  "furnishing_statuses",
  "furnishingStatuses",
  "furniture_statuses",
  "furnitureStatuses",
  "furniture_status",
  "furnitureStatus",
  "floor_levels",
  "floorLevels",
  "floors",
  "floor",
  "floor_level",
  "floorLevel",
  "floor_options",
  "floorOptions",
  "completion_statuses",
  "completionStatuses",
  "orientations",
  "nationalities",
  "nationality",
] as const;

export type PropertyFormMasterOptionFallbackLabels = {
  furnished: string;
  unfurnished: string;
  semiFurnished: string;
  ground: string;
  penthouse: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value != null && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return null;
}

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[_-\s]/g, "");
}

function isFurnishingKey(key: string): boolean {
  const normalized = normalizeKey(key);
  return (
    normalized.includes("furnishingstatus") ||
    normalized.includes("furniturestatus") ||
    normalized === "furnishingstatuses" ||
    normalized === "furniturestatuses" ||
    normalized === "furnishings" ||
    normalized === "furniture"
  );
}

function isFloorKey(key: string): boolean {
  const normalized = normalizeKey(key);
  if (normalized.includes("total")) {
    return false;
  }

  return (
    normalized === "floor" ||
    normalized === "floors" ||
    normalized.includes("floorlevel") ||
    normalized.includes("flooroption")
  );
}

function isNationalityKey(key: string): boolean {
  const normalized = normalizeKey(key);
  return (
    normalized === "nationality" ||
    normalized === "nationalities" ||
    normalized.includes("nationalityoption")
  );
}

function hasOptionListKeys(value: Record<string, unknown>): boolean {
  return OPTION_LIST_KEYS.some((key) => value[key] != null) ||
    Object.keys(value).some(
      (key) => isFurnishingKey(key) || isFloorKey(key) || isNationalityKey(key),
    );
}

function unwrapFormOptionsData(
  input: PropertyFormOptionsData | PropertyFormOptionsResponse | null | undefined,
): PropertyFormOptionsData | null {
  const root = asRecord(input);
  if (!root) {
    return null;
  }

  const nestedData = asRecord(root.data);
  const nestedNestedData = asRecord(nestedData?.data);
  const candidates = [root, nestedData, nestedNestedData];

  for (const candidate of candidates) {
    if (candidate && hasOptionListKeys(candidate)) {
      return candidate as PropertyFormOptionsData;
    }
  }

  return (nestedData ?? root) as PropertyFormOptionsData;
}

function asOptionItems(value: PropertyFormOptionList | unknown): PropertyFormOptionItem[] {
  if (Array.isArray(value)) {
    return value as PropertyFormOptionItem[];
  }

  if (typeof value === "string" || typeof value === "number") {
    return [value as unknown as PropertyFormOptionItem];
  }

  const record = asRecord(value);
  if (!record) {
    return [];
  }

  if (Array.isArray(record.items)) {
    return record.items as PropertyFormOptionItem[];
  }

  if (Array.isArray(record.data)) {
    return record.data as PropertyFormOptionItem[];
  }

  if (Array.isArray(record.results)) {
    return record.results as PropertyFormOptionItem[];
  }

  const entries = Object.entries(record);
  if (
    entries.length > 0 &&
    entries.every(([, entry]) => typeof entry === "string" || typeof entry === "number")
  ) {
    return entries.map(([id, label]) => ({
      id,
      value: id,
      name: String(label),
      label: String(label),
    }));
  }

  return [];
}

function listsMatching(
  data: PropertyFormOptionsData | null,
  explicitLists: Array<PropertyFormOptionList | undefined>,
  matchKey: (key: string) => boolean,
): Array<PropertyFormOptionList | undefined> {
  const lists = [...explicitLists];
  const record = asRecord(data);
  if (!record) {
    return lists;
  }

  for (const [key, value] of Object.entries(record)) {
    if (!matchKey(key) || value == null) {
      continue;
    }

    lists.push(value as PropertyFormOptionList);
  }

  return lists;
}

function toOptionalTrimmedString(value: string | number | null | undefined): string {
  if (value == null) {
    return "";
  }

  return String(value).trim();
}

function toFormOption(
  item: PropertyFormOptionItem | string | number,
  preferId = false,
): PropertyFormOption | null {
  if (typeof item === "string" || typeof item === "number") {
    const value = String(item).trim();
    return value ? { value, label: value } : null;
  }

  const idValue =
    toOptionalTrimmedString(item.id) ||
    toOptionalTrimmedString(item.furniture_status_id) ||
    toOptionalTrimmedString(item.furnishing_status_id) ||
    toOptionalTrimmedString(item.floor_id) ||
    toOptionalTrimmedString(item.floor_level_id) ||
    toOptionalTrimmedString(item.nationality_id);
  const slugValue =
    toOptionalTrimmedString(item.value) ||
    toOptionalTrimmedString(item.slug) ||
    toOptionalTrimmedString(item.code);
  const labelSource = (
    item.label ??
    item.name ??
    item.title ??
    item.text ??
    ""
  ).trim();
  const value = preferId
    ? idValue || slugValue || labelSource
    : slugValue || idValue || labelSource;
  const label = (labelSource || value).trim();

  if (!value || !label) {
    return null;
  }

  return {
    value,
    label,
    id: item.id ?? (idValue || undefined),
  };
}

function mapOptionList(
  lists: Array<PropertyFormOptionList | undefined>,
  preferId = false,
): PropertyFormOption[] {
  const options: PropertyFormOption[] = [];
  const seen = new Set<string>();

  for (const list of lists) {
    for (const item of asOptionItems(list)) {
      const option = toFormOption(item, preferId);
      if (!option || seen.has(option.value)) {
        continue;
      }

      seen.add(option.value);
      options.push(option);
    }
  }

  return options;
}

function normalizeOptionToken(value: string): string {
  return value.toLowerCase().replace(/[_-\s]/g, "");
}

function extractMasterOptionRawValue(saved: unknown): string | null {
  return parseSavedMasterOption(saved)?.value ?? null;
}

function parseSavedMasterOption(
  saved: unknown,
): { value: string; label: string; id?: string | number } | null {
  if (saved == null || saved === "") {
    return null;
  }

  if (typeof saved === "string" || typeof saved === "number" || typeof saved === "boolean") {
    const trimmed = String(saved).trim();
    if (!trimmed) {
      return null;
    }

    return { value: trimmed, label: trimmed };
  }

  const record = asRecord(saved);
  if (!record) {
    return null;
  }

  const nested =
    record.floor ??
    record.floor_level ??
    record.furnishing_status ??
    record.furniture_status;
  if (nested != null && typeof nested === "object") {
    return parseSavedMasterOption(nested);
  }

  const id =
    record.id ??
    record.floor_id ??
    record.floor_level_id ??
    record.furnishing_status_id ??
    record.furniture_status_id;
  const value =
    toOptionalTrimmedString(id as string | number | undefined) ||
    toOptionalTrimmedString(record.value as string | number | undefined) ||
    toOptionalTrimmedString(record.slug as string | number | undefined) ||
    toOptionalTrimmedString(record.code as string | number | undefined) ||
    toOptionalTrimmedString(record.name as string | number | undefined) ||
    toOptionalTrimmedString(record.label as string | number | undefined) ||
    toOptionalTrimmedString(record.title as string | number | undefined);
  const label =
    toOptionalTrimmedString(record.name as string | number | undefined) ||
    toOptionalTrimmedString(record.label as string | number | undefined) ||
    toOptionalTrimmedString(record.title as string | number | undefined) ||
    value;

  if (!value) {
    return nested != null ? parseSavedMasterOption(nested) : null;
  }

  return {
    value,
    label: label || value,
    id: typeof id === "string" || typeof id === "number" ? id : undefined,
  };
}

function isUnderConstructionCompletionOption(option: PropertyFormOption): boolean {
  const token = normalizeOptionToken(
    [option.value, option.label, option.id == null ? "" : String(option.id)]
      .filter(Boolean)
      .join(" "),
  );

  return token.includes("underconstruction");
}

export function withoutUnderConstructionCompletionOptions(
  options: PropertyFormOption[],
): PropertyFormOption[] {
  return options.filter((option) => !isUnderConstructionCompletionOption(option));
}

function optionMatchesSaved(option: PropertyFormOption, raw: string): boolean {
  const rawLower = raw.toLowerCase();
  const rawToken = normalizeOptionToken(raw);
  const parts = [
    option.value,
    option.label,
    option.id == null ? "" : String(option.id),
  ].filter(Boolean);

  for (const part of parts) {
    if (part === raw || part.toLowerCase() === rawLower) {
      return true;
    }

    const partToken = normalizeOptionToken(part);
    if (partToken === rawToken) {
      return true;
    }

    if (!/^\d+$/.test(rawToken) && rawToken.length >= 3) {
      if (partToken.includes(rawToken) || rawToken.includes(partToken)) {
        return true;
      }
    }
  }

  return false;
}

export function resolvePropertyFormMasterOptionValue(
  saved: unknown,
  options: PropertyFormOption[],
): string | null {
  const parsed = parseSavedMasterOption(saved);
  if (parsed == null) {
    return null;
  }

  const match = options.find(
    (option) =>
      optionMatchesSaved(option, parsed.value) ||
      optionMatchesSaved(option, parsed.label),
  );

  return match?.value ?? parsed.value;
}

export function ensureSavedMasterOption(
  options: PropertyFormOption[],
  saved: unknown,
): PropertyFormOption[] {
  const parsed = parseSavedMasterOption(saved);
  if (parsed == null) {
    return options;
  }

  const resolved = resolvePropertyFormMasterOptionValue(saved, options);
  if (resolved && options.some((option) => option.value === resolved)) {
    return options;
  }

  return [
    ...options,
    {
      value: parsed.value,
      label: parsed.label || parsed.value,
      id: parsed.id,
    },
  ];
}

export function withEnsuredFloorOption(
  catalog: PropertyFormOptionsCatalog,
  savedFloor: unknown,
): PropertyFormOptionsCatalog {
  return {
    ...catalog,
    floorLevelOptions: ensureSavedMasterOption(
      catalog.floorLevelOptions,
      savedFloor,
    ),
  };
}

export function withPropertyFormOptionFallbacks(
  catalog: PropertyFormOptionsCatalog,
  labels: PropertyFormMasterOptionFallbackLabels,
): PropertyFormOptionsCatalog {
  const furnitureLabels: Record<string, string> = {
    furnished: labels.furnished,
    unfurnished: labels.unfurnished,
    "semi-furnished": labels.semiFurnished,
    semi_furnished: labels.semiFurnished,
  };

  return {
    ...catalog,
    furnishingStatusOptions:
      catalog.furnishingStatusOptions.length > 0
        ? catalog.furnishingStatusOptions
        : FURNITURE_STATUS_OPTIONS.map((option) => ({
            value: option.value,
            label: furnitureLabels[option.value] ?? option.label,
          })),
    floorLevelOptions:
      catalog.floorLevelOptions.length > 0
        ? catalog.floorLevelOptions
        : FLOOR_OPTIONS.map((option) => {
            if (option.value === "ground") {
              return { value: option.value, label: labels.ground };
            }

            if (option.value === "penthouse") {
              return { value: option.value, label: labels.penthouse };
            }

            return { value: option.value, label: option.label };
          }),
  };
}

export function mapPropertyFormOptionsCatalog(
  data:
    | PropertyFormOptionsData
    | PropertyFormOptionsResponse
    | null
    | undefined,
): PropertyFormOptionsCatalog {
  const optionsData = unwrapFormOptionsData(data);

  return {
    listingPurposeOptions: mapOptionList([
      optionsData?.listing_purposes,
      optionsData?.listingPurposes,
    ]),
    furnishingStatusOptions: mapOptionList(
      listsMatching(
        optionsData,
        [
          optionsData?.furnishing_statuses,
          optionsData?.furnishingStatuses,
          optionsData?.furniture_statuses,
          optionsData?.furnitureStatuses,
          optionsData?.furniture_status,
          optionsData?.furnitureStatus,
        ],
        isFurnishingKey,
      ),
      true,
    ),
    floorLevelOptions: mapOptionList(
      listsMatching(
        optionsData,
        [
          optionsData?.floor_levels,
          optionsData?.floorLevels,
          optionsData?.floors,
          optionsData?.floor,
          optionsData?.floor_level,
          optionsData?.floorLevel,
          optionsData?.floor_options,
          optionsData?.floorOptions,
        ],
        isFloorKey,
      ),
      true,
    ),
    completionStatusOptions: withoutUnderConstructionCompletionOptions(
      mapOptionList([
        optionsData?.completion_statuses,
        optionsData?.completionStatuses,
      ]),
    ),
    orientationOptions: mapOptionList([optionsData?.orientations]),
    nationalityOptions: mapOptionList(
      listsMatching(
        optionsData,
        [optionsData?.nationalities, optionsData?.nationality],
        isNationalityKey,
      ),
    ),
  };
}

export const EMPTY_PROPERTY_FORM_OPTIONS_CATALOG: PropertyFormOptionsCatalog = {
  listingPurposeOptions: [],
  furnishingStatusOptions: [],
  floorLevelOptions: [],
  completionStatusOptions: [],
  orientationOptions: [],
  nationalityOptions: [],
};
