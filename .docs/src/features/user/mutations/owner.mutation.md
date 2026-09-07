# owner.mutation

**Source:** `src/features/user/mutations/owner.mutation.ts`

React Query mutations for owner edit and status changes.

## Exports

### `useUpdateOwnerStatus`

- Calls `updateOwnerStatus(ownerId, body)`
- Before a `SUSPENDED` request, checks `OWNER_DEACTIVATE`; unauthorized roles are rejected in the frontend before the API call
- Activation and other existing status behavior are unchanged
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
