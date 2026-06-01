# File Overview

Zustand store for property list parameters and fetched list response cache.

**Source:** `src/features/property/store/property.store.ts`

# Responsibilities

- Hold active list filters/pagination in `propertyListParams`.
- Hold fetched list response in `propertyListings`.
- Hold landing taxonomy responses in `propertyTaxonomy` and `locationTaxonomy` for cross-feature reuse.
- Provide update and reset actions for list state.

# Imports

- `create` from `zustand`
- `PropertyTaxonomyResponse` from `src/features/landing/types/propertyTaxonomy.types`
- `LocationTaxonomyResponse` from `src/features/landing/types/locationTaxonomy.types`
- `PropertyListParams`, `PropertyListings` from `../types/property.types`

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
- `setPropertyListings`
- `setPropertyTaxonomy`
- `setLocationTaxonomy`
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
3. Property list fetch result is stored with `setPropertyListings`.
4. Landing taxonomy fetch result is stored with `setPropertyTaxonomy`.
5. `resetPropertyList` clears filters and cached property data.

# Dependencies

- [property.types.md](../types/property.types.md)
- [property.service.md](../services/property.service.md)
- [property.mutation.md](../mutations/property.mutation.md)

# Notes

- Initial params: `page=1`, `pageSize=10`, `category=""`, `status=""`.
- `propertyTaxonomy` is initialized as `null` and populated from `LandingScreen`.
