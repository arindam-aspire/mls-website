# File Overview

Drawer body content for protected mobile menu: **system settings only** (language + dark mode), styled like public `PublicMobileMenu` General/Settings rows.

**Source:** `src/layouts/protected-layout/ProtectedMobileDrawerSystemOptions.tsx`

# Responsibilities

- Render `mobileMenuSettings` section with language `SelectDropdown` and theme `SwitchField`.
- Delegate locale/theme changes to `useProtectedMobileDrawerSystemOptions`.

# Exports

- `ProtectedMobileDrawerSystemOptions`

# Actions / Inputs

| Control | Behavior |
| --- | --- |
| Language select | `router.replace` same pathname, new locale |
| Dark mode switch | `ThemeProvider.setTheme` light/dark |

# UI Details

- `SettingField` / `SwitchField` with `bg-surface` icon tiles, row dividers `border-secondary/10`.
- Short locale labels: En, Ar, Sp, Fr (drawer compact select).

# Dependencies

- [hooks/useProtectedMobileDrawerSystemOptions.md](./hooks/useProtectedMobileDrawerSystemOptions.md)
- [ProtectedMobileDrawer.md](./ProtectedMobileDrawer.md)

# Notes

- Sidebar nav and account footer deferred; drawer shows system options only for now.
