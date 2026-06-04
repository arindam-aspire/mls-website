import type { LoggedInUser } from "@/src/features/auth/types/auth.types";

/** API `roles[0].name` → auth account type title (Agency, Agent, Owner, User). */
const ROLE_LABEL_KEYS: Record<
  string,
  | "accountTypeAgencyTitle"
  | "accountTypeAgentTitle"
  | "accountTypeOwnerTitle"
  | "accountTypeUserTitle"
> = {
  admin: "accountTypeAgencyTitle",
  agency: "accountTypeAgencyTitle",
  agent: "accountTypeAgentTitle",
  owner: "accountTypeOwnerTitle",
  registered_user: "accountTypeUserTitle",
};

type AuthTranslate = (
  key:
    | "accountTypeAgencyTitle"
    | "accountTypeAgentTitle"
    | "accountTypeOwnerTitle"
    | "accountTypeUserTitle",
) => string;

export function resolveProfileRoleLabel(
  user: LoggedInUser,
  tAuth: AuthTranslate,
): string {
  const roleName = user.roles?.[0]?.name;
  if (roleName == null) return "";

  const labelKey = ROLE_LABEL_KEYS[roleName];
  return labelKey ? tAuth(labelKey) : "";
}
