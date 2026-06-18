# File Overview

Client hook for the protected header fullscreen toggle.

**Source:** `src/layouts/protected-layout/hooks/useProtectedFullscreen.ts`

# Responsibilities

- Track `document.fullscreenElement` via `fullscreenchange`.
- Expose `toggleFullscreen` to enter/exit fullscreen on `document.documentElement`.

# Exports

- `useProtectedFullscreen`

# Return value

| Key | Type | Description |
| --- | --- | --- |
| `isFullscreen` | `boolean` | Whether the document is fullscreen |
| `toggleFullscreen` | `() => Promise<void>` | Enter or exit fullscreen |

# Notes

- Errors from unsupported or blocked fullscreen are swallowed (no toast).
