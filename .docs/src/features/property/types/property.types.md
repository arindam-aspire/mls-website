# File Overview

TypeScript types for the property list API (`GET /properties`) and the `Property` entity.

**Source:** `src/features/property/types/property.types.ts`

# Responsibilities

- Define query params for listing properties (`PropertyListParams`).
- Define the standard API wrapper (`PropertyListResponse`).

# Imports

_No notable imports._

# Exports

- `PropertyListParams`
- `PropertyListResponse`

# State Management

_N/A — type-only module._

# API Usage

| Type | Endpoint | Method |
| --- | --- | --- |
| `PropertyListResponse` | `/properties` (`propertyEndpoints.PROPERTY_LIST`) | GET (planned) |

Request query shape: `PropertyListParams` (`page`, `pageSize`, `category`, `status`).

# Navigation

_N/A._

# Props / Parameters

| Name | Purpose |
| --- | --- |
| `PropertyListParams.page` | Page number |
| `PropertyListParams.pageSize` | Page size |
| `PropertyListParams.category` | Category filter |
| `PropertyListParams.status` | Status filter |

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
