import type {
  DlsLevel,
  PropertyLocationDlsSelection,
} from "@/src/features/property/types/dls.types";

export const PROPERTY_LOCATION_DLS_LEVELS = [
  "gov",
  "dept",
  "vill",
  "hod",
  "sect",
] as const satisfies readonly DlsLevel[];

export const PROPERTY_LOCATION_DLS_CODE_KEYS = [
  "gov_code",
  "dept_code",
  "vill_code",
  "hod_code",
  "sect_code",
] as const;

export const PROPERTY_LOCATION_DLS_NAME_KEYS = [
  "gov_name",
  "dept_name",
  "vill_name",
  "hod_name",
  "sect_name",
] as const;

export const PROPERTY_LOCATION_DLS_FIELD_KEYS = [
  ...PROPERTY_LOCATION_DLS_CODE_KEYS,
  ...PROPERTY_LOCATION_DLS_NAME_KEYS,
] as const;

export const EMPTY_PROPERTY_LOCATION_DLS: PropertyLocationDlsSelection = {
  gov_code: "",
  gov_name: "",
  dept_code: "",
  dept_name: "",
  vill_code: "",
  vill_name: "",
  hod_code: "",
  hod_name: "",
  sect_code: "",
  sect_name: "",
};
