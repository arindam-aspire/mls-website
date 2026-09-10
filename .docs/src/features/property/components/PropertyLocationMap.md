# File Overview

Host map slot for Add Property Step 2. Renders OpenStreetMap tiles and a draggable pin; reports latitude/longitude back to `PropertyForm`.

**Source:** `src/features/property/components/PropertyLocationMap.tsx`

# Responsibilities

- Implement `PropertyLocationMapRenderProps` from `@abdoun/abdoun-library`.
- Default center: Amman (`31.9539`, `35.9106`) when coordinates are null.
- Click the map or drag the pin to update coordinates (6 decimal places).
- Show localized pin hint and coordinate readout from `labels`.

# Imports

- `PropertyLocationMapRenderProps` from `@abdoun/abdoun-library`
- `cn` from `@/src/lib/cn`

# Exports

- `PropertyLocationMap`

# UI Details

- Outer map surface uses `rounded-xl`, `border-secondary/15`, `bg-page`.
- Pin is `rounded-full` with `bg-primary` / `border-white`.
- Heights: `h-56 sm:h-64 md:h-80`.
- Light/dark: semantic tokens only; OSM tiles are vendor imagery.

# Actions / Inputs

- Click map → set pin.
- Drag pin → live coordinate updates.
- Keyboard: pin button has `aria-label` from `labels.coordinates`.

# Flow Description

1. `PropertyCreateScreen` passes `renderLocationMap={(props) => <PropertyLocationMap {...props} />}`.
2. Library supplies current `latitude` / `longitude` and `onCoordinatesChange`.
3. Mapper sends those values on `payload.location`.

# Dependencies

- [PropertyCreateScreen.md](../screens/PropertyCreateScreen.md)
- [propertyDraftSubmission.mapper.md](../mappers/propertyDraftSubmission.mapper.md)
