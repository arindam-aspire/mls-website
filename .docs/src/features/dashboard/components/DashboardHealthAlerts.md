# File Overview

**Source:** `src/features/dashboard/components/DashboardHealthAlerts.tsx`

Renders dashboard health alerts as severity-coded cards.

# Responsibilities

- Support `warning`, `info`, `error`, and `success` severities.
- Display icon, title, message, and localized severity badge.
- Use exhaustive typed severity mappings.
- Show a localized healthy-system empty state.

# UI Details

Alert cards use `rounded-xl`; badges use `rounded-lg`. Borders, backgrounds, and text use semantic status tokens and support light/dark themes.

# Exports

- `DashboardHealthAlerts`
