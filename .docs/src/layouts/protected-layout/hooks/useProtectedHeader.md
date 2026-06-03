# File Overview

Client hook powering `ProtectedHeader` actions and state.

**Source:** `src/layouts/protected-layout/hooks/useProtectedHeader.ts`

# Responsibilities

- Locale switching on current pathname.
- Notifications upcoming-feature modal open/close.
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
| `isUpcomingFeatureModalOpen` | `boolean` | Notifications modal visibility |
| `openNotifications` | `() => void` | Opens notifications upcoming-feature modal |
| `closeUpcomingFeatureModal` | `() => void` | Closes modal |
| `isMobileMenuOpen` | `boolean` | Mobile drawer visibility |
| `openMobileMenu` | `() => void` | Opens `ProtectedMobileMenu` |
| `closeMobileMenu` | `() => void` | Closes mobile drawer |

# Dependencies

- `useAuthStore`, `@/src/i18n/navigation`, `next-intl`, `ThemeProvider`, MLS logo assets

# Notes

- Search field has no hook state; behavior will be added when product flow is defined.
