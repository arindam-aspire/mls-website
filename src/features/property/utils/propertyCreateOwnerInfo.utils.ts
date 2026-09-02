import { getPhoneInputCountryByCode } from "@/src/components/ui/phone-input/countries";
import type { LoggedInUser } from "@/src/features/auth/types/auth.types";
import type { OwnerInfoConfig, PropertyFormValues } from "@abdoun/abdoun-library";

type OwnerInfoItem = NonNullable<
  PropertyFormValues["owner_info"]
>["owners"][number];

export function buildLoggedInOwnerInfoItem(user: LoggedInUser): OwnerInfoItem {
  const jordan = getPhoneInputCountryByCode("JO");
  const rawPhone = user.phone_number?.trim() ?? "";
  const phoneNumber =
    jordan && rawPhone.startsWith(jordan.dialCode)
      ? rawPhone.slice(jordan.dialCode.length).replace(/\D/g, "")
      : rawPhone.replace(/\D/g, "");

  return {
    owner_name: user.full_name ?? "",
    email: user.email ?? "",
    country_code: jordan?.dialCode ?? "+962",
    phone_number: phoneNumber,
    social_security_id: "",
    nationality: "",
    owner_address: "",
    owner_documents: [],
  };
}

export function resolveReadOnlyOwnerIndicesByEmail(
  owners: OwnerInfoItem[] | undefined,
  userEmail: string | undefined,
): number[] {
  const normalizedEmail = userEmail?.trim().toLowerCase();

  if (!normalizedEmail) {
    return [];
  }

  return (owners ?? []).flatMap((owner, index) =>
    owner.email.trim().toLowerCase() === normalizedEmail ? [index] : [],
  );
}

export function resolveReadOnlyOwnerIndicesForLoggedInOwner(
  owners: OwnerInfoItem[] | undefined,
  userEmail: string | undefined,
  isNewCreate: boolean,
): number[] {
  const matchedIndices = resolveReadOnlyOwnerIndicesByEmail(owners, userEmail);

  if (matchedIndices.length > 0) {
    return matchedIndices;
  }

  return isNewCreate ? [0] : [];
}

export function hasOwnerInfoRowContent(owner: OwnerInfoItem): boolean {
  return (
    [
      owner.owner_name,
      owner.email,
      owner.phone_number,
      owner.social_security_id,
      owner.nationality,
      owner.owner_address,
    ].some((value) => value?.trim()) || owner.owner_documents.length > 0
  );
}

export function buildPropertyCreateOwnerInfoConfig(params: {
  requireDocuments: boolean;
  validationMessages: NonNullable<OwnerInfoConfig["validationMessages"]>;
  readOnlyOwnerIndices: number[];
}): OwnerInfoConfig {
  return {
    requireDocuments: params.requireDocuments,
    validationMessages: params.validationMessages,
    readOnlyOwnerIndices: params.readOnlyOwnerIndices,
  };
}
