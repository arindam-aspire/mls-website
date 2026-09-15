# File Overview

Localized labels for Add Property DLS cascading selects.

**Source:** `src/features/property/i18n/propertyLocationDls.i18n.ts`

# Responsibilities

- Map `propertyList.propertyCreate.dls.*` keys into a labels object for `usePropertyLocationDls`.
- Keys: section title, Government / Department / Village / HOD / Section labels and placeholders, parent-first hints, loading, empty, load error, retry.

# Exports

- `buildPropertyLocationDlsLabels(t)`
- `PropertyLocationDlsLabels`

# Dependencies

- [usePropertyLocationDls.md](../hooks/usePropertyLocationDls.md)
- Locale files: `src/messages/{en,ar,es,fr}/propertyList.json`
