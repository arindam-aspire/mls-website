# File Overview

Single-file left slide mobile drawer for the public header — same structure as landing [LandingMobileMenu.md](../landing-layout/LandingMobileMenu.md).

**Source:** `src/layouts/public-layout/PublicMobileMenu.tsx`

# Responsibilities

- Headless UI slide drawer (`md:hidden`, RTL-aware).
- Primary header and account footer on `bg-surface`; theme-aware logo; outline `IconButton` close (matches header menu open button).
- Drawer width `w-[90vw]` (max `36rem`).
- Card sections (title above `Card`): **Account** (logged in), **Preferences**, **My Activity** (logged in); account footer.
- Account: profile link, Change Password, Notification Settings (`owner` / `registered_user` only). Preferences: Language, Theme Mode. Activity: Listings, Favourites, Saved Searches; **Recently Viewed** only for `registered_user` and `admin`/`agency` (`shouldShowRecentlyViewedMenuItem`).
- Inline **Language** row: `SettingField` + compact `SelectDropdown` (`w-14`, labels **En / Ar / Sp / Fr**).
- Inline **Theme** row: `SwitchField` with Sun/Moon icon, “Dark Mode” title + switch-to-dark/light subtitle + pill switch.
- Uses local state `isOpenChangePasswordModal` to control profile password modal visibility.
- On **Change Password** click, opens `ChangePasswordModal` instead of the upcoming-feature modal.

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
- `src/features/profile/screens/ChangePasswordModal.tsx`

# Notes

- Intentionally duplicated from landing drawer (separate layout ownership).
- `ChangePasswordModal` receives `{ isOpenChangePassword, setIsOpenChangePassword }` props from this layout.
