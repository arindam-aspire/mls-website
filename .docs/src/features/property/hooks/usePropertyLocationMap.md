# File Overview

Logic hook for the Add Property Step 2 Google Map slot: coordinates, zoom, map type, script load state, and camera pan.

**Source:** `src/features/property/hooks/usePropertyLocationMap.ts`

# Responsibilities

- Read `PropertyLocationMapRenderProps` (`latitude`, `longitude`, `onCoordinatesChange`, library `labels`).
- Default null coordinates to Amman (`PROPERTY_LOCATION_MAP_DEFAULT_LATITUDE` / `LONGITUDE`).
- Own zoom (`3`–`20`, default `13`) and map type (`roadmap` | `satellite`).
- Use vector rendering (`PROPERTY_LOCATION_MAP_RENDERING_TYPE`) and `ThemeProvider` light/dark `colorScheme`.
- Trigger a Google Maps `resize` when the map instance is ready so tiles are not stretched/pixelated.
- Emit coordinates at 6 decimal places on map click and marker drag end.
- Skip camera pan for coordinates the user just set; pan when the parent hydrates a new lat/lng (draft resume).
- Build control copy via `buildPropertyLocationMapControlLabels` (`propertyList.propertyCreate.form.map.*`).
- Expose API key presence, load error, and map-ready flags for the presentational overlay.

# Imports

- `PropertyLocationMapRenderProps` from `@abdoun/abdoun-library`
- `@vis.gl/react-google-maps` event/marker types
- `GOOGLE_MAPS_API_KEY` from `environment.config.ts`
- `propertyLocationMap.constants`
- `buildPropertyLocationMapControlLabels`
- `useLocale`, `useTranslations("propertyList.propertyCreate.form")`

# Exports

- `usePropertyLocationMap`

# State Management

- **Local:** `zoom`, `mapTypeId`, `isMapReady`, `hasLoadError`, `mapInstance`
- **Ref:** `skipNextPanRef` so click/drag updates do not fight the user’s pan

# API Usage

- Does not call the MLS backend. Consumes `GOOGLE_MAPS_API_KEY` (`NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`).

# Props / Parameters

| Param | Purpose |
| --- | --- |
| `latitude` / `longitude` | Current form coordinates (nullable) |
| `onCoordinatesChange` | Library callback to write lat/lng into `PropertyForm` |
| `labels` | Library map title, coordinates, and pin-hint strings |

# Actions / Inputs

| Return key | Purpose |
| --- | --- |
| `onMapClick` | Place pin from Google map click |
| `onMarkerDragEnd` | Place pin from marker drag |
| `onZoomIn` / `onZoomOut` | Step zoom by 1 within min/max |
| `onMapTypeChange` | Switch roadmap (Map) vs satellite |
| `onZoomChanged` | Sync zoom after pinch/scroll |
| `onIdle` / `onApiError` | Ready skeleton hide / load failure |
| `setMapInstance` | Receive the Google `Map` from the instance bridge |

# UI Details

_N/A — hook only._

# Flow Description

1. Resolve coordinates, labels, and whether an API key exists.
2. Component mounts `APIProvider` only when `hasApiKey` is true.
3. User click/drag → `applyCoordinates` → form state; camera stays put.
4. Draft hydration changes lat/lng → `map.panTo` the saved point.
5. Zoom buttons and Map / Satellite toggle update controlled Map props.

# Dependencies

- [PropertyLocationMap.md](../components/PropertyLocationMap.md)
- [propertyLocationMap.constants.md](../constants/propertyLocationMap.constants.md)
- [propertyLocationMap.i18n.md](../i18n/propertyLocationMap.i18n.md)
- [environment.config.md](../../../configs/environment.config.md)
