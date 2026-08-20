# File Overview

**Source:** `src/features/dashboard/components/DashboardRecentActivity.tsx`

Displays the latest activity items returned by the dashboard summary.

# Responsibilities

- Render each activity icon, text, relative time, and tone.
- Resolve known API icon names to Lucide icons with a safe activity fallback.
- Map activity tones to semantic theme colors, falling back to `default` when the API tone is unknown.
- Render localized empty-state copy when no activities exist.

# Props / Parameters

Localized title/empty copy and a typed `DashboardRecentActivity[]`.

# UI Details

Rows are responsive, use 44px-friendly icon wells, preserve long-text wrapping, and remain readable in light/dark themes.

# Exports

- `DashboardRecentActivity`
