# File Overview

Host map slot for Add Property Step 2. Renders Google Maps with a draggable pin, zoom controls, and Map / Satellite view; reports latitude/longitude back to `PropertyForm`. Uses vector rendering (`renderingType: VECTOR`, weekly Maps JS channel) and light/dark `colorScheme` so map imagery stays sharp instead of pixelated.

**Source:** `src/features/property/components/PropertyLocationMap.tsx`

# Responsibilities

- Implement `PropertyLocationMapRenderProps` from `@abdoun/abdoun-library`.
- Load the Google Maps JavaScript API via `@vis.gl/react-google-maps` (`APIProvider`, `Map`, `Marker`).
- Default center: Amman (`31.9539`, `35.9106`) when coordinates are null.
- Click the map or drag the pin to update coordinates (6 decimal places).
- Overlay Map / Satellite toggle and zoom in / zoom out controls.
- Pass vector rendering, fractional zoom, and theme `colorScheme` into `@vis.gl/react-google-maps` `Map`.
- Load the Maps script on the `weekly` channel so vector tiles are available.
- Show a layout-matched skeleton until the map is idle; show a localized unavailable panel when the API key is missing or the script fails.
- Show localized pin hint and coordinate readout from library `labels`.

# Imports

- `PropertyLocationMapRenderProps` from `@abdoun/abdoun-library`
- `APIProvider`, `Map`, `Marker`, `useMap` from `@vis.gl/react-google-maps`
- `IconButton`, `Skeleton`, `ToggleButton` from `@/src/components/ui`
- `usePropertyLocationMap`
- Map constants (`PROPERTY_LOCATION_MAP_*`)

# Exports

- `PropertyLocationMap`

# State Management

- All map state lives in [usePropertyLocationMap.md](../hooks/usePropertyLocationMap.md). The instance bridge is a presentational child that forwards the Google `Map` instance into that hook.

# API Usage

- Google Maps JavaScript API, keyed by `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (`GOOGLE_MAPS_API_KEY` in `environment.config.ts`).
- Language follows the active next-intl locale; region is `JO`.

# Actions / Inputs

- Click map → set pin.
- Drag pin → coordinate updates on drag end.
- Zoom in / zoom out buttons; pinch and scroll zoom (`gestureHandling: greedy`).
- Map / Satellite toggle.
- Keyboard: zoom and map-type controls use localized `aria-label`s; pin `title` uses `labels.coordinates`.

# UI Details

- Outer map surface uses `rounded-xl`, `border-secondary/15`, `bg-page`.
- Heights: `h-56 sm:h-64 md:h-80`.
- Map / Satellite `ToggleButton` (primary, solid) at `end-3 top-3`.
- Zoom cluster is a `rounded-xl` overlay at `end-3 bottom-12` (clears Google attribution) with `IconButton` `min-h-11 min-w-11` tap targets.
- Loading skeleton uses `Skeleton` `variant="block"` covering the map frame (`rounded-none` flush with the card).
- Light/dark: overlay chrome uses semantic tokens (`bg-surface`, `text-muted`); Google tiles are vendor imagery.
- Controls wrap on small widths (`max-w-[calc(100%-1.5rem)]`).

# Flow Description

1. `PropertyCreateScreen` passes `renderLocationMap={(props) => <PropertyLocationMap {...props} />}`.
2. Library supplies current `latitude` / `longitude` and `onCoordinatesChange`.
3. Hook resolves Amman defaults, zoom, and map type; Google Map renders when an API key is present.
4. Click or drag updates form coordinates; draft hydration pans the camera to saved coordinates.
5. Mapper sends those values on `payload.location`.

# Dependencies

- [usePropertyLocationMap.md](../hooks/usePropertyLocationMap.md)
- [propertyLocationMap.constants.md](../constants/propertyLocationMap.constants.md)
- [propertyLocationMap.i18n.md](../i18n/propertyLocationMap.i18n.md)
- [PropertyCreateScreen.md](../screens/PropertyCreateScreen.md)
- [propertyDraftSubmission.mapper.md](../mappers/propertyDraftSubmission.mapper.md)
- [environment.config.md](../../../configs/environment.config.md)

# Notes

- Native Google UI (street view, default zoom, default map-type control) is disabled in favor of host-styled controls.
- Without `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, the slot stays in the unavailable state and does not load the Maps script.
