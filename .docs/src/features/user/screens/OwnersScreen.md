# OwnersScreen

**Source:** `src/features/user/screens/OwnersScreen.tsx`

Admin Owner Management page UI. Composes `OwnerList` with filters/list from `useOwnersScreen`, plus workflow modals.

## Layout

1. Page title + subtitle
2. Super Admin only: agency assignment panel (optional assign table when target agency selected)
3. `OwnerList` — same management table for Agency Admin and Super Admin
4. Modals: status confirm, view, edit, linked resources

## Actions (row menu)

- View → `OwnerViewModal`
- Edit → `OwnerEditModal`
- Activate / Deactivate → `ConfirmModal` + status API
- Linked property/lead counts → `OwnerLinkedResourcesModal`

## Styling

- Semantic tokens (`bg-surface`, `text-muted`, …)
- Cards/panels `rounded-xl`; controls `rounded-lg`
- Mobile-first responsive gaps and tables

## Related

- [useOwnersScreen.md](../hooks/useOwnersScreen.md)
- [OwnerList.md](../components/OwnerList.md)
- [owners/page.md](../../../../app/[locale]/(main)/owners/page.md)
