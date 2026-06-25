# File Overview

Client hook powering `ProtectedHeader` actions and state.

**Source:** `src/layouts/protected-layout/hooks/useProtectedHeader.ts`

# Responsibilities

- Locale switching on current pathname.
- Mobile menu open/close state.
- Theme-aware header logo source for mobile bar and desktop when sidebar is hidden.
- `showHeaderLogo` when user has no protected sidebar (`registered_user`, `owner`) via `hasProtectedSidebarAccess`.
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
| `hasUnreadNotifications` | `boolean` | From `GET /notifications/unread-count` when user is ready |
| `showHeaderLogo` | `boolean` | Desktop left logo for user/owner (no sidebar) |
| `headerLogoSrc` | `StaticImageData` | `MLS_Light_Logo` or `MLS_Dark_Logo` from `useTheme` |
| `handleLocaleChange` | `(locale: AppLocale) => void` | `router.replace` with new locale |
| `isMobileMenuOpen` | `boolean` | Mobile drawer visibility |
| `openMobileMenu` | `() => void` | Opens `ProtectedMobileMenu` |
| `closeMobileMenu` | `() => void` | Closes mobile drawer |

# Dependencies

- `useAuthStore`, `@/src/i18n/navigation`, `next-intl`, `ThemeProvider`, MLS logo assets

# Notes

- Notifications and saved-search popovers are self-contained feature components mounted in `ProtectedHeader`.
