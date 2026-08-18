# File Overview

**Source:** `src/features/dashboard/types/dashboard.types.ts`

Type contracts for the authenticated dashboard summary response and all dashboard widgets.

# Exports

- `DashboardSummaryResponse` — API envelope with nullable `data` and `meta: null`.
- `DashboardSummaryData` — KPI counts, month labels, growth series, lead-source values, activities, and health alerts.
- `DashboardRecentActivity` — optional id plus icon, text, relative time, and tone.
- `DashboardHealthAlert` — optional id, title, message, and severity.
- `DashboardActivityTone`, `DashboardAlertSeverity`, `DashboardTrendMetric`.

# API Shape

KPI fields include `totalRegisteredUsers`, `totalAgents`, `totalAdmins`, `pendingApprovals`, `listingsThisMonth`, `leadsThisMonth`, and `closedDeals`. Month-over-month fields are `registerUsersMoMDelta`, `agentsMoMDelta`, `listingsMoMDelta`, and `leadsMoMDelta`.

Chart arrays remain separate to match the backend contract: `monthLabels` pairs with each growth series, while `leadSourceLabels` pairs with `leadSourceValues`.

# Notes

No `any` types are used. Activity tone and alert severity are constrained unions so visual mappings are exhaustive.
