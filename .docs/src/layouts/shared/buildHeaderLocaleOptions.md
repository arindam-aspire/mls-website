# File Overview

Builds header language option lists from app locales and `common.localeNames.*` translation keys.

**Source:** `src/layouts/shared/buildHeaderLocaleOptions.ts`

# Responsibilities

- Define `APP_LOCALE_VALUES` (`en`, `ar`, `es`, `fr`).
- Map each locale to `{ value, label }` for `HeaderLanguageSelect`.

# Exports

- `APP_LOCALE_VALUES`
- `HeaderLanguageOption` (type)
- `buildHeaderLocaleOptions(t)`

# Props / Parameters

`buildHeaderLocaleOptions` accepts a `next-intl` translator scoped to `common` (e.g. `useTranslations("common")`).

# Dependencies

- `@/src/i18n/routing` (`AppLocale`)
- [HeaderLanguageSelect.md](./HeaderLanguageSelect.md)

# Notes

- Used by `useProtectedHeader`, `DesktopActions`, and `LandingDesktopActions` to avoid duplicating locale option mapping.
