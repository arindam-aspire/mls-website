# File Overview

Client hook powering `ProtectedHeader` actions and state.

**Source:** `src/layouts/protected-layout/hooks/useProtectedHeader.ts`

# Responsibilities

- Locale switching on current pathname.
- Upcoming-feature modal for notifications and search (`upcomingFeatureModal` source).
- Mobile menu open/close state.
- Theme-aware header logo source for mobile bar.
- Expose auth user and locale option labels.

# Exports

- `useProtectedHeader`

# Return value

| Key | Type | Description |
| --- | --- | --- |
| `t` | `useTranslations("common")` | i18n |
| `locale` | `AppLocale` | Active locale |
| `localeOptions` | `{ value, label }[]` | Labels from `common.localeNames.*` |
| `user` | `LoggedInUser \| null` | From auth store |
| `isLoadingUser` | `boolean` | Profile hydration |
| `headerLogoSrc` | `StaticImageData` | `MLS_Light_Logo` or `MLS_Dark_Logo` from `useTheme` |
| `handleLocaleChange` | `(locale: string) => void` | `router.replace` with new locale |
| `upcomingFeatureModal` | `"notifications" \| "search" \| null` | Which upcoming modal is open |
| `openNotifications` | `() => void` | Opens modal (bell icon) |
| `openSearch` | `() => void` | Opens modal (search icon); no route change |
| `closeUpcomingFeatureModal` | `() => void` | Closes modal |
| `isMobileMenuOpen` | `boolean` | Mobile drawer visibility |
| `openMobileMenu` | `() => void` | Opens `ProtectedMobileMenu` |
| `closeMobileMenu` | `() => void` | Closes mobile drawer |

# Dependencies

- `useAuthStore`, `@/src/i18n/navigation`, `next-intl`, `ThemeProvider`, MLS logo assets

# Notes

- Header search uses `openSearch` until a dedicated search flow ships.
