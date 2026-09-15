type PropertyLocationDlsTranslation = (
  key:
    | "dls.sectionTitle"
    | "dls.government"
    | "dls.department"
    | "dls.village"
    | "dls.hod"
    | "dls.section"
    | "dls.governmentPlaceholder"
    | "dls.departmentPlaceholder"
    | "dls.villagePlaceholder"
    | "dls.hodPlaceholder"
    | "dls.sectionPlaceholder"
    | "dls.selectGovernmentFirst"
    | "dls.selectDepartmentFirst"
    | "dls.selectVillageFirst"
    | "dls.selectHodFirst"
    | "dls.loading"
    | "dls.empty"
    | "dls.loadError"
    | "dls.retry",
) => string;

export type PropertyLocationDlsLabels = {
  sectionTitle: string;
  government: string;
  department: string;
  village: string;
  hod: string;
  section: string;
  governmentPlaceholder: string;
  departmentPlaceholder: string;
  villagePlaceholder: string;
  hodPlaceholder: string;
  sectionPlaceholder: string;
  selectGovernmentFirst: string;
  selectDepartmentFirst: string;
  selectVillageFirst: string;
  selectHodFirst: string;
  loading: string;
  empty: string;
  loadError: string;
  retry: string;
};

export function buildPropertyLocationDlsLabels(
  t: PropertyLocationDlsTranslation,
): PropertyLocationDlsLabels {
  return {
    sectionTitle: t("dls.sectionTitle"),
    government: t("dls.government"),
    department: t("dls.department"),
    village: t("dls.village"),
    hod: t("dls.hod"),
    section: t("dls.section"),
    governmentPlaceholder: t("dls.governmentPlaceholder"),
    departmentPlaceholder: t("dls.departmentPlaceholder"),
    villagePlaceholder: t("dls.villagePlaceholder"),
    hodPlaceholder: t("dls.hodPlaceholder"),
    sectionPlaceholder: t("dls.sectionPlaceholder"),
    selectGovernmentFirst: t("dls.selectGovernmentFirst"),
    selectDepartmentFirst: t("dls.selectDepartmentFirst"),
    selectVillageFirst: t("dls.selectVillageFirst"),
    selectHodFirst: t("dls.selectHodFirst"),
    loading: t("dls.loading"),
    empty: t("dls.empty"),
    loadError: t("dls.loadError"),
    retry: t("dls.retry"),
  };
}
