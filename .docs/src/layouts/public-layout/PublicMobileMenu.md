# File Overview

Single-file left slide mobile drawer for the public header — same structure as landing [LandingMobileMenu.md](../landing-layout/LandingMobileMenu.md).

**Source:** `src/layouts/public-layout/PublicMobileMenu.tsx`

# Responsibilities

- Headless UI slide drawer (`md:hidden`, RTL-aware).
- Primary header, Account / General / Preferences sections, account footer.
- Inline **Language** row: `SettingField` + compact `SelectDropdown` (`w-14`, labels **En / Ar / Sp / Fr**).
- Inline **Theme** row: `SwitchField` with Sun/Moon icon, “Dark Mode” title + switch-to-dark/light subtitle + pill switch.

# Props / Parameters

| Prop | Type | Purpose |
| --- | --- | --- |
| `open` | `boolean` | Drawer visibility |
| `onClose` | `() => void` | Close handler |
| `onNavigate` | `(path: string) => void` | Route navigation |
| `onLocaleChange` | `(locale: string) => void` | Locale switch |
| `locale` | `AppLocale` | Current locale |
| `closeMenuLabel` | `string` | Close `aria-label` |

# Dependencies

- [PublicHeader.md](./PublicHeader.md)
- `publicMobileHeaderStyles.ts`

# Notes

- Intentionally duplicated from landing drawer (separate layout ownership).
