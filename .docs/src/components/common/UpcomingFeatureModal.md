# File Overview

Modal dialog for upcoming / not-yet-shipped features. Uses the same title and description as `ComingSoonCard`.

**Source:** `src/components/common/UpcomingFeatureModal.tsx` (Client Component)

# Responsibilities

- Inform users a feature is under development when they trigger a placeholder action.
- Show consistent **Coming Soon** copy regardless of which control opened the modal.

# Imports

- `Modal` primitives from `@/src/components/ui/modal`
- `Button` from `@/src/components/ui/button`
- `Hammer`, `Clock` from `lucide-react`

# Exports

- `UpcomingFeatureModal`
- `UpcomingFeatureModalProps`

# State Management

_Controlled via `open` / `onClose` from parent._

# API Usage

_N/A._

# Navigation

_N/A._

# Props / Parameters

| Prop | Default | Purpose |
| --- | --- | --- |
| `open` | — | Show/hide modal |
| `onClose` | — | Close handler |
| `title` | `"Coming Soon"` | Same as `ComingSoonCard` |
| `subtitle` | `"Under Development"` | Eyebrow label |
| `description` | Coming-soon body copy | Same as `ComingSoonCard` |
| `dismissLabel` | `"Got it"` | Primary button label |
| `icon?` | `Hammer` | Custom icon |
| `size?` | `"sm"` | Modal size |
| `showCloseButton?` | `true` | Corner close control |

# Actions / Inputs

- **Dismiss** — `onClose` via button, close icon, or backdrop

# UI Details

- **Modal panel:** `rounded-xl`, semantic tokens
- **Copy:** matches [ComingSoonCard](./ComingSoonCard.md) defaults
- **Button:** `primary` solid, `rounded-lg`
- **Stacking:** Portals to `document.body` via `createPortal` with `!z-[100]` so the dialog appears above the auth modal and other `z-50` overlays (required when opened from nested auth screens).

# Flow Description

1. Parent sets `open={true}` (any upcoming-feature click).
2. Modal portals to `document.body` and renders above existing modals.
3. Modal always shows **Coming Soon** + shared description.
4. User dismisses → `onClose` (auth modal stays open underneath).

# Dependencies

- [PropertyListScreen](../../features/property/screens/PropertyListScreen.md) — Advance/Save Search, Email, Call, WhatsApp
- [PropertyDetailsScreen](../../features/property/screens/PropertyDetailsScreen.md)
- [SocialRegistrationScreen](../../features/auth/screens/SocialRegistrationScreen.md), [SocialSignInScreen](../../features/auth/screens/SocialSignInScreen.md) — social OAuth placeholders
- UI [Modal](../ui/modal/index.tsx)

# Notes

- Optional props override title/description; defaults stay aligned with `ComingSoonCard`.
