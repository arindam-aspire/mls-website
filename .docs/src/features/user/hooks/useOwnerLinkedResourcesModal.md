# useOwnerLinkedResourcesModal

**Source:** `src/features/user/hooks/useOwnerLinkedResourcesModal.ts`

Shared modal logic for linked properties and linked leads tables.

## Entry points

- `openProperties(owner)` → `GET /agency/owners/{id}/properties`
- `openLeads(owner)` → `GET /agency/owners/{id}/leads`

## Features

- Paginated fetch (page size 10)
- Loading / empty / error states
- Column labels from `user.owners.linkedPropertiesModal` / `linkedLeadsModal`

## Related

- [OwnerLinkedResourcesModal.md](../modals/OwnerLinkedResourcesModal.md)
- [owner.service.md](../services/owner.service.md)
