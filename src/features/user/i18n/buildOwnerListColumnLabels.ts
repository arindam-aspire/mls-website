type OwnerListColumnLabelsTranslator = (
  key: "owner" | "contact" | "properties" | "joinedAt" | "status" | "actions",
) => string;

export function buildOwnerListColumnLabels(t: OwnerListColumnLabelsTranslator) {
  return {
    owner: t("owner"),
    contact: t("contact"),
    properties: t("properties"),
    joinedAt: t("joinedAt"),
    status: t("status"),
    actions: t("actions"),
  } as const;
}
