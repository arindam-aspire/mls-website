# Dashboard utils

Helpers that normalize dashboard API values before they reach presentational components.

`normalizeDashboardAlertSeverity` is used by `dashboard.service.ts` so health-alert cards always receive `warning`, `info`, `error`, or `success`.
