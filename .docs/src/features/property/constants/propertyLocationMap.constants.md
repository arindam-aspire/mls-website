# File Overview

Zoom, default center, region, and map-type constants for the create-property Google Map slot.

**Source:** `src/features/property/constants/propertyLocationMap.constants.ts`

# Responsibilities

- Default camera: Amman (`31.9539`, `35.9106`) at zoom `13`.
- Clamp zoom between `3` and `20`.
- Google Maps `region` bias `JO`.
- Map type tokens `roadmap` (Map view) and `satellite`.
- Vector rendering token `VECTOR` (`PROPERTY_LOCATION_MAP_RENDERING_TYPE`).

# Exports

- `PROPERTY_LOCATION_MAP_DEFAULT_LATITUDE`
- `PROPERTY_LOCATION_MAP_DEFAULT_LONGITUDE`
- `PROPERTY_LOCATION_MAP_DEFAULT_ZOOM`
- `PROPERTY_LOCATION_MAP_MIN_ZOOM`
- `PROPERTY_LOCATION_MAP_MAX_ZOOM`
- `PROPERTY_LOCATION_MAP_REGION`
- `PROPERTY_LOCATION_MAP_TYPE`
- `PROPERTY_LOCATION_MAP_RENDERING_TYPE`
- `PropertyLocationMapTypeId`

# Dependencies

- [usePropertyLocationMap.md](../hooks/usePropertyLocationMap.md)
- [PropertyLocationMap.md](../components/PropertyLocationMap.md)
