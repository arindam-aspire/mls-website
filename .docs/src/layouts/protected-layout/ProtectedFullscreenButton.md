# File Overview

Desktop fullscreen toggle for the protected header toolbar. Uses the browser Fullscreen API on `document.documentElement`.

**Source:** `src/layouts/protected-layout/ProtectedFullscreenButton.tsx`

# Responsibilities

- Render a flat ghost `IconButton` with `Maximize` / `Minimize` (lucide) matching other header utilities.
- Toggle fullscreen on click; sync pressed state from `fullscreenchange` events.

# Imports

- `useProtectedFullscreen`, `protectedHeaderIconButtonClass`, `IconButton`, `next-intl`

# Exports

- `ProtectedFullscreenButton`, `ProtectedFullscreenButtonProps`

# Actions / Inputs

| Action | Behavior |
| --- | --- |
| Click | `requestFullscreen()` on `<html>` or `exitFullscreen()` when already fullscreen |

# UI Details

- `sm` rounded outline icon button; muted icon; `aria-pressed` reflects fullscreen state.
- Labels: `common.enterFullscreen` / `common.exitFullscreen`.

# Dependencies

- [hooks/useProtectedFullscreen.md](./hooks/useProtectedFullscreen.md)
- [ProtectedHeader.md](./ProtectedHeader.md)

# Notes

- Shown on `md+` desktop header row only (not mobile bar).
- Available signed in or out; does not require auth.
