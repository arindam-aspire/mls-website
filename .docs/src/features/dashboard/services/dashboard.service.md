# File Overview

**Source:** `src/features/dashboard/services/dashboard.service.ts`

Provides the single dashboard summary API service used by the dashboard query hook.

# Responsibilities

- Request `GET /dashboard/summary`.
- Use the shared authenticated `apiClient`; no token is hardcoded.
- Return typed `DashboardSummaryData`.
- Return `EMPTY_DASHBOARD_SUMMARY` when the response has nullable data.
- Normalize `healthAlerts[].severity` through `normalizeDashboardAlertSeverity` so unknown API values do not crash the alerts UI.

# Exports

- `getDashboardSummary(): Promise<DashboardSummaryData>`
- `EMPTY_DASHBOARD_SUMMARY`

# API Usage

| Method | Endpoint | Auth | Response |
| --- | --- | --- | --- |
| GET | `/dashboard/summary` | `auth: true` | `DashboardSummaryResponse` |

Authentication, Bearer-token attachment, token refresh, normalized errors, and failed-auth redirects are handled by the existing API client/interceptors.

# Flow Description

1. `useDashboardScreen` runs the `["dashboard", "summary"]` React Query.
2. This service requests the endpoint through `apiClient`.
3. The response envelope is unwrapped to `data`.
4. Health-alert severities are normalized; the dashboard renders empty arrays/counts if `data` is null.

# Dependencies

- `dashboard.service.ts`
- `src/features/dashboard/types/dashboard.types.ts`
- `src/features/dashboard/utils/normalizeDashboardAlertSeverity.ts`
