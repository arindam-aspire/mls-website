# File Overview

Maps feature catalog API items to `@abdoun/abdoun-library` `PropertyView` feature definitions.

**Source:** `src/features/property/mappers/propertyFeatures.mapper.ts`

# Responsibilities

- Convert `FeatureCatalogItem[]` to `PropertyFeatureDefinition[]`.
- Map API `feature_group` (`FEATURE` \| `AMENITY`) to library `feature_group` (`FEATURE` \| `AMENITIES`).

# Imports

- `FeatureCatalogItem`, `PropertyFeatureDefinition` from `../types/property.types`

# Exports

- `mapFeatureCatalogItems`

# State Management

_N/A — pure mapper._

# API Usage

_N/A._

# Navigation

_N/A._

# Props / Parameters

| Parameter | Type | Purpose |
| --- | --- | --- |
| `items` | `FeatureCatalogItem[]` | Raw catalog from `GET /features` |

# Actions / Inputs

_N/A._

# UI Details

_N/A._

# Flow Description

1. `usePropertyDetails` calls `GET /features?is_active=true`.
2. On success, passes `data.items` through `mapFeatureCatalogItems`.
3. Result is passed to `PropertyView` as `features`.

# Dependencies

- [../types/property.types.md](../types/property.types.md)
- [../hooks/usePropertyDetails.md](../hooks/usePropertyDetails.md)

# Notes

- API `AMENITY` maps to library `AMENITIES`; `name` and `slug` pass through unchanged.
