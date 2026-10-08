import type { SelectOption } from "@/src/components/ui/select/types";
import {
  EMPTY_PROPERTY_LOCATION_DLS,
  PROPERTY_LOCATION_DLS_FIELD_KEYS,
} from "@/src/features/property/constants/propertyLocationDls.constants";
import type {
  DlsLocationItem,
  DlsLocationsResponse,
  PropertyLocationDlsSelection,
} from "@/src/features/property/types/dls.types";

const DLS_FIELD_ALIASES: Record<
  keyof PropertyLocationDlsSelection,
  readonly string[]
> = {
  gov_code: [
    "gov_code",
    "GOV_CODE",
    "govCode",
    "governent_code",
    "governentCode",
    "governorate_code",
    "governorateCode",
    "government_code",
    "governmentCode",
  ],
  gov_name: [
    "gov_name",
    "GOV_NAME",
    "govName",
    "governent",
    "governent_name",
    "governorate",
    "governorate_name",
    "government",
    "government_name",
  ],
  dept_code: ["dept_code", "DEPT_CODE", "deptCode", "directorate_code", "directorateCode"],
  dept_name: ["dept_name", "DEPT_NAME", "deptName", "directorate", "directorate_name"],
  vill_code: ["vill_code", "VILL_CODE", "villCode", "village_code", "villageCode"],
  vill_name: ["vill_name", "VILL_NAME", "villName", "village", "village_name"],
  hod_code: [
    "hod_code",
    "HOD_CODE",
    "hodCode",
    "basin_code",
    "parcel_code",
    "parcelCode",
  ],
  hod_name: [
    "hod_name",
    "HOD_NAME",
    "hodName",
    "hod",
    "basin_name",
    "parcel",
    "parcel_name",
  ],
  sect_code: ["sect_code", "SECT_CODE", "sectCode", "section_code", "sectionCode"],
  sect_name: ["sect_name", "SECT_NAME", "sectName", "section", "section_name"],
};

function readAliasedText(
  source: Record<string, unknown> | null | undefined,
  aliases: readonly string[],
): string {
  if (source == null) {
    return "";
  }

  for (const alias of aliases) {
    const value = source[alias];
    if (typeof value === "string" || typeof value === "number") {
      const trimmed = String(value).trim();
      if (trimmed) {
        return trimmed;
      }
    }
  }

  return "";
}

export function getDlsLocationItems(
  response: DlsLocationsResponse | undefined,
): DlsLocationItem[] {
  const data = response?.data;

  if (data == null) {
    return [];
  }

  if (Array.isArray(data)) {
    return data;
  }

  return data.items ?? [];
}

const DLS_PARCEL_NUMBER_KEYS = [
  "dls_parcel_number",
  "dlsParcelNumber",
  "parcel_number",
  "parcelNumber",
  "hod_number",
  "hodNumber",
  "number",
] as const;

function readDlsItemText(
  item: DlsLocationItem,
  keys: readonly string[],
): string {
  const record = item as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" || typeof value === "number") {
      const trimmed = String(value).trim();
      if (trimmed) {
        return trimmed;
      }
    }
  }

  return "";
}

/** DLS parcel identifier from the location row. `code` is the API parcel code. */
export function resolveDlsParcelNumber(item: DlsLocationItem): string {
  return readDlsItemText(item, DLS_PARCEL_NUMBER_KEYS) || String(item.code ?? "").trim();
}

export function formatDlsParcelOptionLabel(
  name: string,
  parcelNumber: string,
): string {
  const trimmedName = name.trim();
  const trimmedNumber = parcelNumber.trim();

  if (trimmedName && trimmedNumber) {
    return `${trimmedName} - ${trimmedNumber}`;
  }

  return trimmedName || trimmedNumber;
}

export type DlsSelectOptionLabelMode = "name" | "parcel";

export function mapDlsLocationItemsToSelectOptions(
  items: DlsLocationItem[],
  selectedCode?: string,
  selectedName?: string,
  labelMode: DlsSelectOptionLabelMode = "name",
): SelectOption[] {
  const nameCounts = new Map<string, number>();

  for (const item of items) {
    const name = item.name?.trim() || String(item.code);
    nameCounts.set(name, (nameCounts.get(name) ?? 0) + 1);
  }

  const options = items.map((item) => {
    const code = String(item.code);
    const name = item.name?.trim() || code;

    if (labelMode === "parcel") {
      return {
        value: code,
        label: formatDlsParcelOptionLabel(name, resolveDlsParcelNumber(item)),
      };
    }

    return {
      value: code,
      label: (nameCounts.get(name) ?? 0) > 1 ? `${name} (${code})` : name,
    };
  });

  const trimmedSelectedCode = selectedCode?.trim();
  if (
    trimmedSelectedCode &&
    !options.some((option) => option.value === trimmedSelectedCode)
  ) {
    const fallbackName = selectedName?.trim() || trimmedSelectedCode;
    options.unshift({
      value: trimmedSelectedCode,
      label:
        labelMode === "parcel"
          ? formatDlsParcelOptionLabel(fallbackName, trimmedSelectedCode)
          : fallbackName,
    });
  }

  return options;
}

export function extractPropertyLocationDls(
  ...sources: Array<Record<string, unknown> | null | undefined>
): PropertyLocationDlsSelection {
  const selection = { ...EMPTY_PROPERTY_LOCATION_DLS };

  for (const key of PROPERTY_LOCATION_DLS_FIELD_KEYS) {
    for (const source of sources) {
      const identificationFields =
        source && typeof source.identification_fields === "object"
          ? (source.identification_fields as Record<string, unknown>)
          : undefined;
      const value =
        readAliasedText(source, DLS_FIELD_ALIASES[key]) ||
        readAliasedText(identificationFields, DLS_FIELD_ALIASES[key]);

      if (value) {
        selection[key] = value;
        break;
      }
    }
  }

  return selection;
}

export function applyPropertyLocationDls<T extends object>(
  location: T,
  dls: PropertyLocationDlsSelection,
): T {
  const next: Record<string, unknown> = { ...(location as Record<string, unknown>) };

  for (const key of PROPERTY_LOCATION_DLS_FIELD_KEYS) {
    const value = dls[key].trim();
    if (value) {
      next[key] = value;
    } else {
      delete next[key];
    }
  }

  return next as T;
}

export function findDlsLocationName(
  items: DlsLocationItem[],
  code: string,
): string {
  const match = items.find((item) => String(item.code) === code);
  return match?.name?.trim() || "";
}
