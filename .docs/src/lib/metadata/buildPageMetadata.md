# File Overview

Builds localized Next.js `Metadata` titles for server route pages via the `metadata` i18n namespace.

**Source:** `src/lib/metadata/buildPageMetadata.ts`

# Exports

- `PageMetadataKey` — union of supported page title keys
- `buildPageMetadata(pageKey)` — async; returns `{ title: "{page} - {suffix}" }` using `getTranslations("metadata")`

# Dependencies

- `src/messages/<locale>/metadata.json` (all four locales)
- Used by `(property)` pages with `generateMetadata` (`property-list`, `propert-details`, `inquiries`)
