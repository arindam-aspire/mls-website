# File Overview

**Source:** `src/features/dashboard/utils/normalizeDashboardAlertSeverity.ts`

Maps health-alert severity values from `/dashboard/summary` onto the UI union used by `DashboardHealthAlerts`.

# Responsibilities

- Lowercase and trim incoming severity strings.
- Map known aliases (`danger`, `critical`) to `error`.
- Default unknown or missing values to `info` so the dashboard does not crash on `.icon`.

# Exports

- `normalizeDashboardAlertSeverity(value: unknown): DashboardAlertSeverity`

# Dependencies

- `src/features/dashboard/types/dashboard.types.ts`
