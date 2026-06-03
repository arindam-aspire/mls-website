# File Overview

Circular theme toggle for the protected header: outline `IconButton` toggling light/dark via `ThemeProvider`.

**Source:** `src/layouts/protected-layout/ProtectedThemeButton.tsx` (Client Component)

# Responsibilities

- Toggle between light and dark theme (not `PublicHeaderThemeButton` / `LandingHeaderThemeButton`).
- Show `Moon` when light (switch to dark), `Sun` when dark (switch to light).

# Imports

- `IconButton` from `@/src/components/ui/icon-button`
- `Moon`, `Sun` from `lucide-react`
- `useTheme` from `@/src/providers/ThemeProvider`
- `useTranslations("common")`

# Exports

- `ProtectedThemeButton`
- `ProtectedThemeButtonProps`

# State Management

- `useTheme()` for `theme` and `setTheme`.

# Navigation

- No routing.

# Props / Parameters

| Prop | Type | Default | Purpose |
| --- | --- | --- | --- |
| `className` | `string` | — | Wrapper span classes |

# Actions / Inputs

## Actions

- Click → `setTheme(theme === "light" ? "dark" : "light")`.

# UI Details

- Matches [ProtectedNotificationsButton.md](./ProtectedNotificationsButton.md): `color="inherit"`, `variant="outline"`, `isRounded`, `size="md"`.
- Icons: `size-5`, `strokeWidth={1.75}`.
- `aria-label`: `common.themeSwitchToDark` or `common.themeSwitchToLight`.

# Flow Description

1. User clicks circular theme control in protected header.
2. `ThemeProvider` updates `html` class / preference storage.
3. Icon swaps between moon and sun.

# Dependencies

- [ProtectedHeader.md](./ProtectedHeader.md)
- `src/providers/ThemeProvider`

# Notes

- Rendered whenever header is not in user-loading skeleton state (not gated on `user`).
