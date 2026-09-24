type PropertyLocationDlsTranslation = (
  key:
    | "dls.sectionTitle"
    | "dls.governent"
    | "dls.directorate"
    | "dls.village"
    | "dls.parcel"
    | "dls.section"
    | "dls.landType"
    | "dls.governentPlaceholder"
    | "dls.directoratePlaceholder"
    | "dls.villagePlaceholder"
    | "dls.parcelPlaceholder"
    | "dls.sectionPlaceholder"
    | "dls.landTypePlaceholder"
    | "dls.selectGovernentFirst"
    | "dls.selectDirectorateFirst"
    | "dls.selectVillageFirst"
    | "dls.selectParcelFirst"
    | "dls.loading"
    | "dls.empty"
    | "dls.loadError"
    | "dls.retry",
) => string;

export type PropertyLocationDlsLabels = {
  sectionTitle: string;
  governent: string;
  directorate: string;
  village: string;
  parcel: string;
  section: string;
  landType: string;
  governentPlaceholder: string;
  directoratePlaceholder: string;
  villagePlaceholder: string;
  parcelPlaceholder: string;
  sectionPlaceholder: string;
  landTypePlaceholder: string;
  selectGovernentFirst: string;
  selectDirectorateFirst: string;
  selectVillageFirst: string;
  selectParcelFirst: string;
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
    governent: t("dls.governent"),
    directorate: t("dls.directorate"),
    village: t("dls.village"),
    parcel: t("dls.parcel"),
    section: t("dls.section"),
    landType: t("dls.landType"),
    governentPlaceholder: t("dls.governentPlaceholder"),
    directoratePlaceholder: t("dls.directoratePlaceholder"),
    villagePlaceholder: t("dls.villagePlaceholder"),
    parcelPlaceholder: t("dls.parcelPlaceholder"),
    sectionPlaceholder: t("dls.sectionPlaceholder"),
    landTypePlaceholder: t("dls.landTypePlaceholder"),
    selectGovernentFirst: t("dls.selectGovernentFirst"),
    selectDirectorateFirst: t("dls.selectDirectorateFirst"),
    selectVillageFirst: t("dls.selectVillageFirst"),
    selectParcelFirst: t("dls.selectParcelFirst"),
    loading: t("dls.loading"),
    empty: t("dls.empty"),
    loadError: t("dls.loadError"),
    retry: t("dls.retry"),
  };
}
