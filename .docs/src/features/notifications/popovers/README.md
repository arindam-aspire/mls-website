# Notifications popovers (`src/features/notifications/popovers/`)

Floating notification panels opened from the header bell (public and protected layouts).

## Purpose

- Quick preview of recent notifications without leaving the current page.
- Link to the full notifications screen.
- Mark individual or all items as read (when wired to mutations).

## Conventions

- One popover component per surface if layouts diverge (e.g. `NotificationsPopover.tsx`), or a shared component with props.
- Colocate popover-specific hooks under `../hooks/` (e.g. `useNotificationsPopover.ts`), not inside this folder.
- Reuse list row UI from `../components/` when possible.
- Panel shell: `@/src/components/ui/popover` with `rounded-xl` on `PopoverPanel`.
- All visible copy from `notifications` namespace in `src/messages/`.

## Files

| File | Role |
| --- | --- |
| [NotificationsPopover.md](./NotificationsPopover.md) | Bell-triggered popover for header |
| `../components/NotificationPopoverItem.tsx` | Single notification row in the popover list |

## Related

- [../README.md](../README.md) — notifications feature overview
- [saved-searches/popovers](../../../saved-searches/popovers/) — reference popover pattern (`SaveSearchPopover`)
