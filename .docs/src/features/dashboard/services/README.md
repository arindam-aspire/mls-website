# Dashboard services

Typed network boundary for dashboard data.

`dashboard.service.ts` is the only dashboard summary service. It uses the shared authenticated API client and endpoint constant, allowing the application-wide interceptor to attach/refresh the Bearer token and normalize failures.
