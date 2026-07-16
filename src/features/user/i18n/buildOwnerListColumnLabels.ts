type OwnerListColumnLabelsTranslator = (
  key:
    | "owner"
    | "phone"
    | "email"
    | "properties"
    | "leads"
    | "status"
    | "actions",
) => string;

export function buildOwnerListColumnLabels(t: OwnerListColumnLabelsTranslator) {
  return {
    owner: t("owner"),
    phone: t("phone"),
    email: t("email"),
    properties: t("properties"),
    leads: t("leads"),
    status: t("status"),
    actions: t("actions"),
  } as const;
}
