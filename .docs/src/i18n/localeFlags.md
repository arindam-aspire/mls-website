# File Overview

Maps each `AppLocale` to a representative country flag (ISO 3166-1 alpha-2) and builds `flagcdn.com` image URLs for UI language pickers.

**Source:** `src/i18n/localeFlags.ts`

# Responsibilities

- `LOCALE_FLAG_ISO2`: `en→US`, `ar→SA`, `es→ES`, `fr→FR`.
- `localeFlagUrl(locale)`: `https://flagcdn.com/w40/{iso2}.png`
- `localeDisplayCode(locale)`: uppercase locale code for compact triggers (e.g. `EN`).

# Exports

- `LOCALE_FLAG_ISO2`
- `localeFlagUrl`
- `localeDisplayCode`

# Dependencies

- [routing.md](./routing.md) (`AppLocale`)
- Used by [HeaderLanguageSelect.md](../layouts/shared/HeaderLanguageSelect.md) and layout desktop action bars

# Notes

- Same CDN pattern as `src/components/ui/phone-input/countries.ts`; protected language select uses native `<img>`.
