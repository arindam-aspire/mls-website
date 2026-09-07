# Dashboard hooks

Logic and server-state orchestration for dashboard screens.

`useDashboardScreen` selects role-appropriate React Query calls, memoizes translated KPI data, aggregates status, and routes normalized summary errors through the existing toast system. Agency Admin receives `activeAgentCount` from `GET /agents/summary` and the logged-in agency from `/auth/me`. UI components remain presentational.
