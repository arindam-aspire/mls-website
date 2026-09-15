# File Overview

Localized control copy for the create-property Google Map overlay (zoom, Map / Satellite, load errors).

**Source:** `src/features/property/i18n/propertyLocationMap.i18n.ts`

# Responsibilities

- Map `propertyList.propertyCreate.form.map.*` keys into a labels object for `usePropertyLocationMap`.
- Keys: `zoomIn`, `zoomOut`, `mapView`, `satelliteView`, `mapTypeGroup`, `missingApiKey`, `loadError`, `loading`.

# Exports

- `buildPropertyLocationMapControlLabels(t)`
- `PropertyLocationMapControlLabels`

# Dependencies

- [usePropertyLocationMap.md](../hooks/usePropertyLocationMap.md)
- Locale files: `src/messages/{en,ar,es,fr}/propertyList.json`
