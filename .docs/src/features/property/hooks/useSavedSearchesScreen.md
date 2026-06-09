# File Overview

Screen hook for `SavedSearchesScreen`: localized page title, subtitle, and coming-soon card copy.

**Source:** `src/features/property/hooks/useSavedSearchesScreen.ts`

# Exports

- `useSavedSearchesScreen`

# Return values

| Key | i18n | Purpose |
| --- | --- | --- |
| `pageTitle` | `propertyList.savedSearches.pageTitle` | Page `h1` and `ComingSoonCard` title (`Saved Searches` in `en`) |
| `pageSubtitle` | `propertyList.savedSearches.pageSubtitle` | Muted subtitle under title |
| `comingSoonEyebrow` | `propertyList.savedSearches.comingSoonEyebrow` | `ComingSoonCard` eyebrow |
| `comingSoonDescription` | `propertyList.savedSearches.comingSoonDescription` | `ComingSoonCard` body |

# Dependencies

- `useTranslations("propertyList")` with `savedSearches.*` keys in `en`, `ar`, `es`, `fr`
