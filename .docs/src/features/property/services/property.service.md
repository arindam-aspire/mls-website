# File Overview

API service for listing properties.

**Source:** `src/features/property/services/property.service.ts`

# Responsibilities

- Call `GET /properties` with query params from `PropertyListParams`.

# Imports

- `apiClient` from `@/src/apis/clients/api.client`
- `propertyEndpoints` from `@/src/apis/endpoints/propertyEndpoints`
- `PropertyListParams`, `PropertyListResponse` from `../types/property.types`

# Exports

- `getPropertyList`

# State Management

_N/A — stateless service._

# API Usage

| Function | Method | Path | Auth |
| --- | --- | --- | --- |
| `getPropertyList` | GET | `/properties?…` | yes (`apiClient` default) |

Query string built by `propertyEndpoints.PROPERTY_LIST(params)` (`page`, `pageSize`, `category`, `status`).

# Navigation

_N/A._

# Props / Parameters

| Parameter | Type | Purpose |
| --- | --- | --- |
| `params` | `PropertyListParams` | List filters and pagination |

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
