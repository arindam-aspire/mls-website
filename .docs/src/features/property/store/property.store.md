# File Overview

Zustand store for property list parameters and fetched list response cache.

**Source:** `src/features/property/store/property.store.ts`

# Responsibilities

- Hold active list filters/pagination in `propertyListParams`.
- Hold fetched list response in `propertyListResponse`.
- Provide update and reset actions for list state.

# Imports

- `create` from `zustand`
- `PropertyListParams`, `PropertyListResponse` from `../types/property.types`

# Exports

- `usePropertyStore`

# State Management

- **Zustand** store defined in this file.

# API Usage

_N/A unless extended._

# Navigation

_No direct navigation._

# Props / Parameters

_N/A — non-component module._

# Actions / Inputs

## Inputs

_No explicit inputs detected._

## Actions

- `setPropertyListParams`
- `setPropertyListResponse`
- `resetPropertyList`

## Validations

_No explicit validations detected._

## Show/Hide Controls

_No explicit show/hide controls detected._

# UI Details

_N/A._

# Flow Description

1. Screens/hooks read `propertyListParams`.
2. UI events update params via `setPropertyListParams`.
3. Fetch result is stored with `setPropertyListResponse`.
4. `resetPropertyList` clears filters and cached response.

# Dependencies

- [property.types.md](../types/property.types.md)
- [property.service.md](../services/property.service.md)
- [property.mutation.md](../mutations/property.mutation.md)

# Notes

- Initial params: `page=1`, `pageSize=10`, `category=""`, `status=""`.
