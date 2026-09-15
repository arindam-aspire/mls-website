export type DlsLevel = "gov" | "dept" | "vill" | "hod" | "sect";

export type DlsLocationItem = {
  code: string;
  name: string;
  level: DlsLevel;
  gov_code?: string;
  dept_code?: string;
  vill_code?: string;
  hod_code?: string;
};

export type DlsLocationsQuery = {
  level: DlsLevel;
  gov_code?: string;
  dept_code?: string;
  vill_code?: string;
  hod_code?: string;
};

export type DlsLocationsData = {
  level: DlsLevel;
  items: DlsLocationItem[];
  total: number;
};

export type DlsLocationsResponse = {
  success: boolean;
  message: string | null;
  data: DlsLocationsData | DlsLocationItem[] | null;
  error: unknown;
  meta?: Record<string, unknown>;
};

export type PropertyLocationDlsSelection = {
  gov_code: string;
  gov_name: string;
  dept_code: string;
  dept_name: string;
  vill_code: string;
  vill_name: string;
  hod_code: string;
  hod_name: string;
  sect_code: string;
  sect_name: string;
};
