# File Overview

Circular notifications control for the protected header: surface-filled `IconButton` with bell icon and unread dot indicator.

**Source:** `src/layouts/protected-layout/ProtectedNotificationsButton.tsx` (Client Component)

# Responsibilities

- Render accessible notifications trigger matching protected header visual spec (not `PublicNotificationsButton` / `LandingNotificationsButton`).
- Optional unread dot until notification counts are wired from API.

# Imports

- `IconButton` from `@/src/components/ui/icon-button`
- `Bell` from `lucide-react`
- `useTranslations("common")`

# Exports

- `ProtectedNotificationsButton`
- `ProtectedNotificationsButtonProps`

# State Management

- Stateless; parent owns click and modal state.

# Navigation

- No routing; `onClick` handled by `useProtectedHeader` → `UpcomingFeatureModal`.

# Props / Parameters

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `onClick` | `() => void` | — | Opens notifications flow (upcoming feature modal) |
| `showIndicator` | `boolean` | `true` | Red dot on bell shoulder |
| `className` | `string` | — | Wrapper span classes |

# Actions / Inputs

## Actions

- Click bell → parent `onClick`.

# UI Details

- `IconButton`: `color="inherit"`, `variant="outline"`, `isRounded`, `size="md"` (`bg-surface`, `border-secondary/15` from inherit outline).
- Bell: `size-5`, `strokeWidth={1.75}` (outline style).
- Indicator: `size-2` `rounded-full` `bg-danger`, `ring-2 ring-surface`, `absolute top-2.5 end-2.5` (logical end for RTL).
- `aria-label`: `common.notifications`.

# Flow Description

1. User clicks circular bell in protected header.
2. Parent opens `UpcomingFeatureModal` with bell icon.
3. Profile popover hides duplicate bell via `showNotificationsButton={false}`.

# Dependencies

- [ProtectedHeader.md](./ProtectedHeader.md)
- [hooks/useProtectedHeader.md](./hooks/useProtectedHeader.md)

# Notes

- Replace `showIndicator` default with real unread state when notifications API exists.
