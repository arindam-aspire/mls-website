import type { PropertyOwnerSearchResult } from "@abdoun/abdoun-library";
import type { OwnerListItem } from "@/src/features/user/types/owner.types";
import { parseOwnerPhoneForForm } from "../utils/propertyOwnerPhone.utils";

export function mapOwnerListItemToSearchResult(
  owner: OwnerListItem,
): PropertyOwnerSearchResult {
  const { country_code, phone_number } = parseOwnerPhoneForForm(owner.phone);

  return {
    owner_id: owner.owner_id,
    full_name: owner.full_name,
    email: owner.email,
    country_code,
    phone_number,
    nationality: owner.nationality ?? undefined,
    ssi: owner.ssi ?? undefined,
    duplicate_key: owner.owner_id,
    owner_documents: (owner.documents ?? [])
      .map((document) => {
        if (!document || typeof document !== "object") {
          return null;
        }

        const record = document as { url?: unknown; file_name?: unknown };
        const url = typeof record.url === "string" ? record.url : "";
        if (!url) {
          return null;
        }

        return {
          name: typeof record.file_name === "string" ? record.file_name : "",
          uri: url,
        };
      })
      .filter((document): document is { name: string; uri: string } =>
        Boolean(document),
      ),
  };
}
