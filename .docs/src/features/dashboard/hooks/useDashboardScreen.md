# File Overview

**Source:** `src/features/dashboard/hooks/useDashboardScreen.ts`

Owns dashboard data fetching, role selection, error reporting, and memoized KPI mapping.

# Responsibilities

- Read the authenticated user and role set from `auth.store`.
- For super administrators, query `getDashboardSummary` with key `["dashboard", "summary"]`.
- For Agency Admin (`admin`), query `getAgentSummary` with key `["agents", "summary"]` and resolve the logged-in agency from `/auth/me` (`user.agency` / `user.agencies`).
- Preserve the previous agent dashboard queries (assigned listings, notifications) for non-super-admin roles.
- Memoize the seven localized dashboard KPI metrics and attach the four available month-over-month deltas.
- Aggregate loading/error state with TanStack Query `isLoading` (`isPending && isFetching`) so disabled queries cannot keep the skeleton up, and report summary failures through the existing toast/error system.

# State Management

TanStack Query caches server data. Zustand supplies the authenticated user. `useMemo` prevents repeated role-set and KPI mapping work.

# API Usage

- Super-admin summary: authenticated `GET /dashboard/summary`.
- Agency Admin: authenticated `GET /agents/summary` for `activeAgents` (missing or non-numeric values become `0`). Agency name/contact come from the authenticated user payload, not the agency list.
- Agent and remaining fallbacks: property submission, agent property, and unread notification services.

# Flow Description

1. Resolve roles.
2. Enable only the role-appropriate queries.
3. Build localized KPI presentation data from the summary.
4. For Agency Admin, expose `activeAgentCount` from `/agents/summary` and `loggedInAgency` from `/auth/me`.
5. Expose summary series, activities, health alerts, remaining operational data, and status flags to the screen.
6. On summary error, show a localized toast while the screen renders its localized error/empty states.

# Exports

- `useDashboardScreen`

# Dependencies

- `dashboard.service.ts`
- `DashboardKpiCards.tsx` metric contract
- Auth store, React Query, next-intl, and `useToast`
