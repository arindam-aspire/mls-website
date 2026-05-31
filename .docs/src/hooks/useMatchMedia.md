# File Overview

Client hook that subscribes to a CSS media query and returns whether it currently matches.

**Source:** `src/hooks/useMatchMedia.ts` (Client Component)

# Responsibilities

- Return `false` on the server and on the first client render so SSR markup matches hydration (avoids branching UI like mobile bottom sheets vs desktop dropdowns).
- After mount, sync from `window.matchMedia(query).matches` and listen for `change` events.

# Exports

- `useMatchMedia(query: string): boolean`

# Dependencies

- Used by [PropertyListAdvancedFilters.md](../features/property/components/PropertyListAdvancedFilters.md) and [BudgetField.md](../components/search/BudgetField.md) for `(max-width: 767px)` bottom-sheet vs inline/dropdown layout.

# Notes

- Consumers that swap layout at `(max-width: 767px)` may briefly render the desktop variant until the effect runs on narrow viewports; this is intentional to prevent hydration mismatches.
