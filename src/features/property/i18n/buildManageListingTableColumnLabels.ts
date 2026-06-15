type ManageListingsTranslator = (
  key:
    | "columns.property"
    | "columns.status"
    | "columns.submission"
    | "columns.submittedByEmpty"
    | "columns.submittedOnEmpty"
    | "columns.reviewedOn"
    | "columns.reviewedOnEmpty",
) => string;

export function buildManageListingTableColumnLabels(t: ManageListingsTranslator) {
  return {
    property: t("columns.property"),
    status: t("columns.status"),
    submission: t("columns.submission"),
    submittedByEmpty: t("columns.submittedByEmpty"),
    submittedOnEmpty: t("columns.submittedOnEmpty"),
    reviewedOn: t("columns.reviewedOn"),
    reviewedOnEmpty: t("columns.reviewedOnEmpty"),
  };
}
