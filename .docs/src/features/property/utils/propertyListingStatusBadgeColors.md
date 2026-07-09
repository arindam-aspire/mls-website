# File Overview

Maps property listing workflow status keys to soft badge Tailwind classes for **My Listings** and **Manage Listings** status cells.

**Source:** `src/features/property/utils/propertyListingStatusBadgeColors.ts`

# Responsibilities

- Normalize status keys with `.trim().toLowerCase()` and hyphenate underscores/spaces before lookup.
- Return badge color classes only; no business logic or label resolution.

# Exports

| Export | Purpose |
| --- | --- |
| `normalizePropertyListingStatusKeyForBadge` | Lowercase + hyphen normalization for case-insensitive matching |
| `getPropertyListingStatusBadgeClassName` | Tailwind classes for a status key |
| `PropertyListingStatusBadgeColorKey` | Known MLS status keys with explicit colors |

# Status → color mapping

| Status (normalized) | Color |
| --- | --- |
| `draft` | gray |
| `submitted` | blue |
| `agent-assigned` | indigo |
| `pending-approval` | amber |
| `active` | green |
| `rejected` | red |
| `deal-closure-requested` | orange |
| `deal-closed` | teal |
| `sold` | purple |
| `rented` | cyan |

Unknown keys fall back to muted outline-style classes.

# Dependencies

- [PropertyListingStatusBadge.md](../components/PropertyListingStatusBadge.md)
