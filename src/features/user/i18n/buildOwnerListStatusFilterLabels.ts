import type { OwnerListStatusFilterValue } from "../constants/ownerListStatusFilters.constants";

type OwnerListStatusFilterLabelsTranslator = (
  key: "all" | "ariaLabel" | OwnerListStatusFilterValue,
) => string;

export function buildOwnerListStatusFilterLabels(
  t: OwnerListStatusFilterLabelsTranslator,
) {
  return {
    all: t("all"),
    ariaLabel: t("ariaLabel"),
    active: t("active"),
    suspended: t("suspended"),
  } as const satisfies Record<"all" | "ariaLabel" | OwnerListStatusFilterValue, string>;
}
