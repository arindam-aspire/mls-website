# File Overview

Single-file left slide mobile drawer for the landing header — shell, sections, pickers, and account footer.

**Source:** `src/layouts/landing-layout/LandingMobileMenu.tsx`

Rendered from [LandingHeader.md](./LandingHeader.md) with `open` / `onClose` state.

# Responsibilities

- Headless UI `Dialog` slide drawer (`md:hidden`, RTL-aware).
- Primary header and account footer on `bg-surface`; theme-aware logo; outline `IconButton` close (matches header menu open button).
- Drawer width `w-[90vw]` (max `36rem`).
- Scrollable card sections (title above `Card`): **Account** (logged in), **Preferences**, **My Activity** (logged in).
- Account: profile link, Change Password, Notification Settings (`owner` / `registered_user` only). Preferences: Language, Theme Mode. Activity: Listings, Favourites, Saved Searches, Recently Viewed.
- Pinned account footer: profile + logout, or sign-in row.
- Inline **General → Language**: `SettingField` + compact `SelectDropdown` (En / Ar / Sp / Fr).
- **Theme** row uses `SwitchField` with Sun/Moon icon, title `common.darkMode`, dynamic subtitle, primary pill switch.
- Uses local state `isOpenChangePasswordModal` to control profile password modal visibility.
- On **Change Password** click, opens `ChangePasswordModal` instead of upcoming-feature modal.
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
| `MenuRow` / `MenuSection` / `MenuLanguageRow` / `MenuThemeRow` | Section UI |
| `MenuContent` | Drawer body |

# Actions / Inputs

| Section | Items | Action |
| --- | --- | --- |
| Account | Profile, Agency, Notifications, Change password | Navigate / upcoming feature modal |
| General | Language, Theme | Language: `SettingField` + `SelectDropdown`; Theme: `SwitchField` dark-mode row |
| Preferences | Favourites, Listings, Saved searches, Recently viewed | Navigate |
| Footer | Profile or Sign in, Logout icon | Profile nav / auth; LogOut closes drawer then opens confirm modal |

# UI Details

- Drawer width: `calc(85vw - 1rem)`, max `36rem`; slide `duration-700`.
- Shared header sizing from `landingMobileHeaderStyles.ts`.
- Semantic tokens; `rounded-xl` on picker panels only.

# Dependencies

- [LandingHeader.md](./LandingHeader.md)
- `landingMobileHeaderStyles.ts`, `auth.store`, `ThemeProvider`, `useLogout`
- `src/features/profile/screens/ChangePasswordModal.tsx`

# Notes

- All drawer logic lives in this one file by design.
- Buy/Rent/Sell/Off-Plan remain in `LandingBottomTabBar`.
- `ChangePasswordModal` receives `{ isOpenChangePassword, setIsOpenChangePassword }` props from this layout.
