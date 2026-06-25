# File Overview

Loading skeleton for the agents KPI card grid. Matches `AgentKPICards` layout at all breakpoints.

**Source:** `src/features/user/components/AgentKPICardsSkeleton.tsx`

# Responsibilities

- Render four placeholder cards in the same grid as loaded KPIs (`1` / `2` / `4` columns).
- Decorative only (`aria-hidden`).

# Props

| Prop | Type | Role |
| --- | --- | --- |
| `className` | `string` | Optional wrapper classes |

# UI Details

- `Card` shells with `rounded-xl`, label + value + icon skeleton blocks.
- Uses `Skeleton` from `@/src/components/ui/skeleton`.

# Dependencies

- [AgentsScreen.md](../screens/AgentsScreen.md)
- [AgentKPICards.md](./AgentKPICards.md)
