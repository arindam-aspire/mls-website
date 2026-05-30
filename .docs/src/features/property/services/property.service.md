# File Overview

API service for listing and fetching a single property.

**Source:** `src/features/property/services/property.service.ts`

# Responsibilities

- Call `GET /properties` with query params from `PropertyListParams`.
- Call `GET /properties/:id` for a single property record.
- Call `GET /features?is_active=true` for the feature/amenity catalog.

# Imports

- `apiClient` from `@/src/apis/clients/api.client`
- `propertyEndpoints` from `@/src/apis/endpoints/propertyEndpoints`
- `PropertyDetailsResponse`, `PropertyListParams`, `PropertyListResponse` from `../types/property.types`

# Exports

- `getPropertyList`
- `getPropertyDetails`
- `getPropertyFeatureCatalog`

# State Management

_N/A — stateless service._

# API Usage

| Function | Method | Path | Auth |
| --- | --- | --- | --- |
| `getPropertyList` | GET | `/properties?…` | no (`auth: false`) |
| `getPropertyDetails` | GET | `/properties/:id` | no (`auth: false`) |
| `getPropertyFeatureCatalog` | GET | `/features?is_active=true` | no (`auth: false`) |

Query string built by `propertyEndpoints.PROPERTY_LIST(params)` (`page`, `pageSize`, `category`, `status`).

# Navigation

_N/A._

# Props / Parameters

| Parameter | Type | Purpose |
| --- | --- | --- |
| `params` | `PropertyListParams` | List filters and pagination |
| `id` | `string` | Property id for detail fetch |

# Actions / Inputs

_N/A._

# UI Details

_N/A._

# Flow Description

1. Caller (future React Query hook or screen) passes `PropertyListParams`.
2. Service requests `propertyEndpoints.PROPERTY_LIST(params)`.
3. Returns typed `PropertyListResponse`.

# Dependencies

- [propertyEndpoints.ts](../../../apis/endpoints/propertyEndpoints.ts)
- [property.types.ts](../types/property.types.md)

# Notes

- Refine `PropertyListResponse.data` when the backend list schema is confirmed.
