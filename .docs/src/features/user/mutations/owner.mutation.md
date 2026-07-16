# owner.mutation

**Source:** `src/features/user/mutations/owner.mutation.ts`

React Query mutations for owner edit and status changes.

## Exports

### `useUpdateOwnerStatus`

- Calls `updateOwnerStatus(ownerId, body)`
- On success: invalidates `["owners", "list"]`, success toast (`user.owners.statusUpdate`)
- On error: error toast (includes 403 / API message)

### `useUpdateOwner`

- Calls `updateOwner(ownerId, body)`
- On success: invalidates `["owners", "list"]`, success toast (`user.owners.editModal`)
- On error: error toast

## Related

- [owner.service.md](../services/owner.service.md)
- [useOwnerStatusConfirm.md](../hooks/useOwnerStatusConfirm.md)
- [useOwnerEditModal.md](../hooks/useOwnerEditModal.md)
