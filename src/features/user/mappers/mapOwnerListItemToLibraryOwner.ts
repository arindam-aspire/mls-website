import { mapOwnerApiStatus, type Owner } from "@abdoun/abdoun-library";
import type { OwnerListItem } from "../types/owner.types";

const DEFAULT_OWNER_LIST_STATUS = "ACTIVE";

function resolveOwnerListItemStatus(status: string | undefined): string {
  return status?.trim() || DEFAULT_OWNER_LIST_STATUS;
}

export function mapOwnerListItemToLibraryOwner(owner: OwnerListItem): Owner {
  const name = owner.full_name?.trim() ?? "";
  const email = owner.email?.trim() || undefined;
  const phone = owner.phone?.trim() || undefined;

  return {
    id: owner.owner_id,
    name,
    email,
    phone,
    propertyOwned: Math.max(0, owner.property_owned ?? 0),
    joinedAt: owner.created_at?.trim() ?? "",
    status: mapOwnerApiStatus(resolveOwnerListItemStatus(owner.status)),
  };
}

export function mapOwnerListItemsToLibraryOwners(owners: OwnerListItem[]): Owner[] {
  return owners.map(mapOwnerListItemToLibraryOwner);
}
