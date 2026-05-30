# File Overview

TypeScript types for property list and detail APIs, aligned with `@abdoun/abdoun-library` `PropertyView` shapes where applicable.

**Source:** `src/features/property/types/property.types.ts`

# Responsibilities

- Define query params for listing properties (`PropertyListParams`).
- Define list and detail API wrappers (`PropertyListResponse`, `PropertyDetailsResponse`).
- Export `PropertyDetails` and `PropertyFeatureDefinition` (inferred from `PropertyView` props).
- Define feature catalog API types (`FeatureCatalogItem`, `FeatureCatalogResponse`).

# Imports

- `PropertyView` from `@abdoun/abdoun-library` (type-only)

# Exports

- `PropertyListParams`
- `PropertyListResponse`
- `PropertyDetails`
- `PropertyFeatureDefinition`
- `PropertyDetailsResponse`
- `PropertySimilarResponse`
- `FeatureCatalogItem`
- `FeatureCatalogResponse`

# State Management

_N/A — type-only module._

# API Usage

| Type | Endpoint | Method |
| --- | --- | --- |
| `PropertyListResponse` | `/properties` | GET |
| `PropertyDetailsResponse` | `/properties/:id` | GET |
| `PropertySimilarResponse` | `/properties/:id/similar` | GET |
| `FeatureCatalogResponse` | `/features?is_active=true` | GET |

Request query shape: `PropertyListParams` — required: `page`, `pageSize`, `category`, `status`; optional: `sort`, `type`, `location`, `budgetMin`, `budgetMax`, `furnitureStatus`, `bedrooms`, `bathrooms`, `parking`, `propertyAge`, `minArea`, `maxArea`, `amenities`.

URL-synced filters: all `PropertyListParams` fields (see [property.types.md](./property.types.md)).

# Navigation

_N/A._

# Props / Parameters

| Name | Purpose |
| --- | --- |
| `PropertyListParams.page` | Page number |
| `PropertyListParams.pageSize` | Page size |
| `PropertyListParams.category` | Category filter |
| `PropertyListParams.status` | Status filter |
| `PropertyListParams.sort?` | Sort key (e.g. `newest`, `price_asc`, `price_desc`) |
| `PropertyListParams.type?` | Property type filter |
| `PropertyListParams.location?` | Location filter |
| `PropertyListParams.budgetMin?` | Minimum budget |
| `PropertyListParams.budgetMax?` | Maximum budget |
| `PropertyListParams.furnitureStatus?` | Furnishing filter |
| `PropertyListParams.bedrooms?` | Bedroom count |
| `PropertyListParams.bathrooms?` | Bathroom count |
| `PropertyListParams.parking?` | Parking count |
| `PropertyListParams.propertyAge?` | Property age filter |
| `PropertyListParams.minArea?` | Minimum area |
| `PropertyListParams.maxArea?` | Maximum area |
| `PropertyListParams.amenities?` | Amenities filter |
| `PropertyListParams.similar_to?` | Similar-to property id (from detail “View More”) |

# Actions / Inputs

_N/A._

# UI Details

_N/A._

# Flow Description

1. [property.service.ts](../services/property.service.ts) calls `apiClient` with `propertyEndpoints.PROPERTY_LIST(params)`.
2. Future React Query hooks will consume `PropertyListResponse`.
3. UI maps `getProperties(data)` to cards or list rows.

# Dependencies

- [propertyEndpoints.ts](../../../../apis/endpoints/propertyEndpoints.ts) — path constant
- [property/README.md](../README.md) — feature overview

# Notes

- `PropertyListResponse.data` is `unknown` until the backend list schema is confirmed.
