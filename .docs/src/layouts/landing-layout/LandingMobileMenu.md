# File Overview

Single-file left slide mobile drawer for the landing header — shell, sections, pickers, and account footer.

**Source:** `src/layouts/landing-layout/LandingMobileMenu.tsx`

Rendered from [LandingHeader.md](./LandingHeader.md) with `open` / `onClose` state.

# Responsibilities

- Headless UI `Dialog` slide drawer (`md:hidden`, RTL-aware).
- Primary header: logo (home) + close.
- Scrollable sections: **Account**, **General**, **Preferences** (flat list, no cards).
- Pinned account footer: profile + logout, or sign-in row.
- Nested picker sheets for language and theme.
- Upcoming-feature modals (agency, notifications) and logout confirm.

# Exports

- `LandingMobileMenu`
- `LandingMobileMenuProps`

# Props / Parameters

| Prop | Type | Purpose |
| --- | --- | --- |
| `open` | `boolean` | Drawer visibility |
| `onClose` | `() => void` | Close handler |
| `onNavigate` | `(path: string) => void` | Route navigation |
| `onLocaleChange` | `(locale: string) => void` | Locale switch |
| `locale` | `AppLocale` | Current locale |
| `closeMenuLabel` | `string` | Close button `aria-label` |

# Internal structure (same file)

| Piece | Role |
| --- | --- |
| `useMobileMenuSections` | Auth-gated nav, pickers, theme/locale |
| `useMobileMenuAccountFooter` | Profile footer, logout |
| `MenuRow` / `MenuSection` | Section UI |
| `PickerSheet` | Language / theme dialogs |
| `MenuContent` | Drawer body |

# Actions / Inputs

| Section | Items | Action |
| --- | --- | --- |
| Account | Profile, Agency, Notifications, Change password | Navigate / upcoming feature modal |
| General | Language, Theme | Open picker sheets |
| Preferences | Favourites, Listings, Saved searches, Recently viewed | Navigate |
| Footer | Profile or Sign in, Logout icon | Profile nav / auth; LogOut closes drawer then opens confirm modal |

# UI Details

- Drawer width: `calc(85vw - 1rem)`, max `36rem`; slide `duration-700`.
- Shared header sizing from `landingMobileHeaderStyles.ts`.
- Semantic tokens; `rounded-xl` on picker panels only.

# Dependencies

- [LandingHeader.md](./LandingHeader.md)
- `landingMobileHeaderStyles.ts`, `auth.store`, `ThemeProvider`, `useLogout`

# Notes

- All drawer logic lives in this one file by design.
- Buy/Rent/Sell/Off-Plan remain in `LandingBottomTabBar`.
