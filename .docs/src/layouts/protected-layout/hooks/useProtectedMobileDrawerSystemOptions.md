# File Overview

Client hook for protected mobile drawer system settings (locale + theme).

**Source:** `src/layouts/protected-layout/hooks/useProtectedMobileDrawerSystemOptions.ts`

# Exports

- `useProtectedMobileDrawerSystemOptions`
- `PROTECTED_DRAWER_LOCALE_OPTIONS`

# Return value

| Key | Description |
| --- | --- |
| `locale` | Active `AppLocale` |
| `theme` | `ThemeMode` from `ThemeProvider` |
| `localeOptions` | Short-label locale list for drawer select |
| `handleLocaleChange` | `router.replace` with new locale |
| `handleThemeChange` | `setTheme` |

# Dependencies

- `@/src/i18n/navigation`, `ThemeProvider`
