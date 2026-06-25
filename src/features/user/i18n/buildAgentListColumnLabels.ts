type AgentListColumnLabelsTranslator = (
  key: "agent" | "contact" | "city" | "status" | "activityDate" | "actions",
) => string;

export function buildAgentListColumnLabels(t: AgentListColumnLabelsTranslator) {
  return {
    agent: t("agent"),
    contact: t("contact"),
    city: t("city"),
    status: t("status"),
    activityDate: t("activityDate"),
    actions: t("actions"),
  } as const;
}
