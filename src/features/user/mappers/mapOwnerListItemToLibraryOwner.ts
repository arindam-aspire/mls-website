import { mapOwnerApiStatus, type Owner } from "@abdoun/abdoun-library";
import type { OwnerListItem } from "../types/owner.types";

type OwnerListItemApiShape = OwnerListItem & {
  fullName?: string;
  property_owned?: number;
  joined_at?: string;
};

function resolveOwnerListItemName(owner: OwnerListItemApiShape): string {
  return owner.name?.trim() || owner.fullName?.trim() || "";
}

function resolveOwnerPropertyOwned(owner: OwnerListItemApiShape): number {
  if (Number.isFinite(owner.propertyOwned)) {
    return Math.max(0, owner.propertyOwned);
  }

  if (Number.isFinite(owner.property_owned)) {
    return Math.max(0, owner.property_owned as number);
  }

  return 0;
}

function resolveOwnerJoinedAt(owner: OwnerListItemApiShape): string {
  return owner.joinedAt?.trim() || owner.joined_at?.trim() || "";
}

export function mapOwnerListItemToLibraryOwner(owner: OwnerListItem): Owner {
  const normalized = owner as OwnerListItemApiShape;
  const name = resolveOwnerListItemName(normalized);
  const email = normalized.email?.trim() || undefined;
  const phone = normalized.phone?.trim() || undefined;

  return {
    id: normalized.id,
    name,
    email,
    phone,
    propertyOwned: resolveOwnerPropertyOwned(normalized),
    joinedAt: resolveOwnerJoinedAt(normalized),
    status: mapOwnerApiStatus(normalized.status),
  };
}

export function mapOwnerListItemsToLibraryOwners(owners: OwnerListItem[]): Owner[] {
  return owners.map(mapOwnerListItemToLibraryOwner);
}
