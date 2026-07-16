# useOwnerViewModal

**Source:** `src/features/user/hooks/useOwnerViewModal.ts`

Read-only owner details modal. Fetches `GET /agency/owners/{id}` when opened; falls back to list-row fields while loading or on partial data.

## States

- Loading skeleton labels
- Error panel (403/API errors)
- Field grid: name, phone, email, status, linked properties count, linked leads count

## Related

- [OwnerViewModal.md](../modals/OwnerViewModal.md)
- [owner.service.md](../services/owner.service.md)
