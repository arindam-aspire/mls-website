# File Overview

Off-canvas drawer for protected routes below `md`. Public-style shell (primary header + logo) with **system options only** in the scroll body.

**Source:** `src/layouts/protected-layout/ProtectedMobileDrawer.tsx`

# Responsibilities

- Dialog shell, backdrop, RTL panel animation.
- Primary header with MLS dark logo and close button.
- Mount `ProtectedMobileDrawerSystemOptions` (language + theme); no `children` prop.

# Props / Parameters

| Prop | Type | Description |
| --- | --- | --- |
| `open` | `boolean` | Drawer visibility |
| `onClose` | `() => void` | Close handler |
| `closeLabel` | `string` | i18n close `aria-label` |
| `className` | `string` | Optional root `Dialog` classes |

# Dependencies

- [ProtectedMobileDrawerSystemOptions.md](./ProtectedMobileDrawerSystemOptions.md)
- [ProtectedMobileMenu.md](./ProtectedMobileMenu.md)

# Notes

- Nav links and account footer can be added later without changing the shell.
