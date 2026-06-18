import type { AgentListStatusFilterValue } from "../constants/agentListStatusFilters.constants";

type AgentListStatusFilterLabelsTranslator = (
  key:
    | "all"
    | "ariaLabel"
    | "active"
    | "inactive"
    | "invited"
    | "pending"
    | "declined",
) => string;

export function buildAgentListStatusFilterLabels(
  t: AgentListStatusFilterLabelsTranslator,
) {
  return {
    all: t("all"),
    ariaLabel: t("ariaLabel"),
    active: t("active"),
    inactive: t("inactive"),
    invited: t("invited"),
    pending: t("pending"),
    declined: t("declined"),
  } as const satisfies Record<
    "all" | "ariaLabel" | AgentListStatusFilterValue,
    string
  >;
}
