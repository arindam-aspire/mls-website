# File Overview

React Query mutation hooks for landing feature API calls.

**Source:** `src/features/landing/mutations/landing.mutation.ts` (Client Component)

# Responsibilities

- Fetch property taxonomy via `getPropertyTaxonomy`.
- Store taxonomy response into `usePropertyStore` on success.
- Surface API failures with toast feedback.

# Imports

- `useMutation` from `@tanstack/react-query`
- `getPropertyTaxonomy` from `../services/landing.service`
- `usePropertyStore` from `src/features/property/store/property.store`
- `useToast` from `src/hooks/useToast`

# Exports

- `useGetPropertyTaxonomy`

# State Management

- Uses TanStack Mutation state (`data`, `isPending`, `error`).
- Writes taxonomy payload into Zustand property store.

# API Usage

- Calls `GET /property-taxonomy` through `getPropertyTaxonomy`.

# Navigation

_No direct navigation._

# Flow Description

1. `LandingScreen` invokes `useGetPropertyTaxonomy().mutate()`.
2. Mutation calls `landing.service`.
3. On success, response is persisted with `setPropertyTaxonomy`.
4. On error, toast displays failure message.

# Notes

- Keep in sync when `src/features/landing/mutations/landing.mutation.ts` changes.
