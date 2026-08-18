# File Overview

**Source:** `src/apis/endpoints/dashboardEndpoints.ts`

Defines dashboard API paths in one place so services do not duplicate URL strings.

# Exports

- `dashboardEndpoints.SUMMARY` — `GET /dashboard/summary`.

# API Usage

The summary endpoint is authenticated. `dashboard.service.ts` calls it through `apiClient` with `auth: true`; the shared Axios interceptor attaches the stored Bearer token and handles refresh/401 behavior.

# Dependencies

- `src/features/dashboard/services/dashboard.service.ts`
- `src/apis/clients/api.client.ts`

# Notes

Do not place request logic or tokens in this module.
