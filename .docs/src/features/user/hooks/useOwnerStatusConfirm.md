# useOwnerStatusConfirm

**Source:** `src/features/user/hooks/useOwnerStatusConfirm.ts`

Confirmation flow for activate / deactivate owner status changes.

## Flow

1. `openConfirm(owner, "activate" \| "deactivate")`
2. Screen renders `ConfirmModal` from `confirmModal`
3. Confirm → `useUpdateOwnerStatus` with `ACTIVE` or `SUSPENDED`
4. On success: modal closes; list invalidated + toast from mutation

## i18n

`user.owners.statusConfirm.*`

## Related

- [owner.mutation.md](../mutations/owner.mutation.md)
- [OwnersScreen.md](../screens/OwnersScreen.md)
