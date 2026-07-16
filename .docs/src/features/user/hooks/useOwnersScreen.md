# useOwnersScreen

**Source:** `src/features/user/hooks/useOwnersScreen.ts`

Screen hook for the Owners admin page (`/owners`). Owns list filters, sorting, pagination, workflow actions, Super Admin assignment, and modal orchestration.

## Responsibilities

- Fetch agency-scoped list (`getOwnerList`) or platform list (`getPlatformOwnerList`) when Super Admin
- Search, status filter, column visibility, client sort config, pagination (page size 10)
- Build table columns via `buildOwnerListTableColumns` with View / Edit / Activate / Deactivate
- Open confirm modal for activate (`ACTIVE`) / deactivate (`SUSPENDED`)
- Open view, edit, linked-properties, and linked-leads modals
- Super Admin: agency assignment select + assign mutation
- Toast list fetch errors; special title for `FORBIDDEN` (403)

## Query keys

- `["owners", "list", "platform" \| agencyId, listRequestParams]`
- `["agency", "owner-assignment-list"]` (Super Admin only)

## Return highlights

| Key | Purpose |
| --- | --- |
| `listFilters` / `ownerList` | Props for `OwnerList` |
| `assignment` | Localized Super Admin assignment panel state |
| `ownerStatusConfirmModal` | ConfirmModal props or null |
| `ownerViewModal` / `ownerEditModal` / `ownerLinkedResourcesModal` | Modal props |

## Permissions

Consumers must guard with `useAuthorize("OWNERS")` (Super Admin + Agency Admin). Agent / Owner / Normal User are redirected to `/unauthorized`.

## Related

- [OwnersScreen.md](../screens/OwnersScreen.md)
- [OwnerList.md](../components/OwnerList.md)
- [buildOwnerListTableColumns.md](../utils/buildOwnerListTableColumns.md)
