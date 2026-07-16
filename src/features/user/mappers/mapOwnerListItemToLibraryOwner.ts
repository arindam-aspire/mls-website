import { mapOwnerApiStatus, type Owner } from "@abdoun/abdoun-library";
import type { OwnerListItem } from "../types/owner.types";

const DEFAULT_OWNER_LIST_STATUS = "ACTIVE";

export type OwnerListRow = Owner & {
  leadsLinked: number;
};

function resolveOwnerListItemStatus(status: string | undefined): string {
  return status?.trim() || DEFAULT_OWNER_LIST_STATUS;
}

function resolveOwnerLeadsLinked(owner: OwnerListItem): number {
  const raw = owner.leads_count ?? owner.linked_leads ?? 0;
  return Math.max(0, Number.isFinite(raw) ? Number(raw) : 0);
}

export function mapOwnerListItemToLibraryOwner(owner: OwnerListItem): OwnerListRow {
  const name = owner.full_name?.trim() ?? "";
  const email = owner.email?.trim() || undefined;
  const phone = owner.phone?.trim() || undefined;

  return {
    id: owner.owner_id,
    name,
    email,
    phone,
    propertyOwned: Math.max(0, owner.property_owned ?? 0),
    leadsLinked: resolveOwnerLeadsLinked(owner),
    joinedAt: owner.created_at?.trim() ?? "",
    status: mapOwnerApiStatus(resolveOwnerListItemStatus(owner.status)),
  };
}

export function mapOwnerListItemsToLibraryOwners(owners: OwnerListItem[]): OwnerListRow[] {
  return owners.map(mapOwnerListItemToLibraryOwner);
}
