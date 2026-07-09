import type { OwnerInfoConfig } from "@abdoun/abdoun-library";

type OwnerInfoTranslation = (
  key:
    | "ownerNameRequired"
    | "phoneRequired"
    | "emailRequired"
    | "ownerDocumentRequired",
) => string;

export function buildPropertyCreateOwnerInfoValidationMessages(
  t: OwnerInfoTranslation,
): NonNullable<OwnerInfoConfig["validationMessages"]> {
  return {
    ownerNameRequired: t("ownerNameRequired"),
    phoneRequired: t("phoneRequired"),
    emailRequired: t("emailRequired"),
    ownerDocumentRequired: t("ownerDocumentRequired"),
  };
}
