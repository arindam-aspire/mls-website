# Dashboard feature (`src/features/dashboard/`)

Authenticated, role-aware dashboard feature.

## Files

| Path | Role |
| --- | --- |
| `services/dashboard.service.ts` | Typed authenticated `GET /dashboard/summary` service |
| `types/dashboard.types.ts` | Summary, activity, alert, and trend contracts |
| `hooks/useDashboardScreen.ts` | React Query orchestration, role gates, errors, KPI mapping |
| `components/DashboardKpiCards.tsx` | Seven KPI cards and month-over-month trends |
| `components/DashboardTrendChart.tsx` | User/listing/lead growth line charts |
| `components/DashboardLeadSourceChart.tsx` | Lead-source donut chart |
| `components/DashboardRecentActivity.tsx` | Latest activity feed |
| `components/DashboardHealthAlerts.tsx` | Severity-coded health alerts |
| `components/DashboardScreenSkeleton.tsx` | Responsive loading skeleton |
| [screens/index.md](./screens/index.md) | Role-aware dashboard composition |

## Route

- `/en/dashboard` — `app/[locale]/(main)/dashboard/page.tsx`

## Architecture

Super administrators receive one cached dashboard summary request and render KPIs, trends, lead sources, recent activity, and health alerts. Existing agency and agent experiences retain their previous list/submission/notification queries so adding platform analytics does not change routing or break role-specific workflows.

All dashboard UI copy is in `src/messages/{en,ar,es,fr}/dashboard.json`. Charts are lightweight SVG/CSS presentations, so no chart dependency was added.
