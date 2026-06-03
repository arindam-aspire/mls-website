# File Overview

Thin wrapper that opens `ProtectedMobileDrawer` from the protected header menu button.

**Source:** `src/layouts/protected-layout/ProtectedMobileMenu.tsx`

# Responsibilities

- Pass `open`, `onClose`, and `closeMenu` label into the drawer.

# Flow Description

1. User taps menu in `ProtectedHeader`.
2. Drawer opens with system settings (language, theme) only.

# Dependencies

- [ProtectedMobileDrawer.md](./ProtectedMobileDrawer.md)
- [ProtectedHeader.md](./ProtectedHeader.md)

# Notes

- Does not render `ProtectedSidebarNav` in the drawer for now.
