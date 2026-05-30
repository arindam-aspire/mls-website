# File Overview

Client hook that subscribes to a CSS media query and returns whether it currently matches.

**Source:** `src/hooks/useMatchMedia.ts` (Client Component)

# Responsibilities

- Initialize from `window.matchMedia(query).matches` on the client.
- Listen for `change` events and update React state.

# Exports

- `useMatchMedia(query: string): boolean`

# Dependencies

- Used by [PropertyListAdvancedFilters.md](../features/property/components/PropertyListAdvancedFilters.md) for `(max-width: 767px)` bottom-sheet vs inline layout.
