# File Overview

Role-aware dashboard screen composing summary analytics and existing operational views.

**Source:** `src/features/dashboard/screens/index.tsx`

# Responsibilities

- Render the super-admin dashboard summary widgets.
- Preserve agency/agent operational dashboard content.
- Compose responsive KPI, chart, activity, alert, loading, empty, and error states.
- Use the `dashboard` next-intl namespace for all visible copy.

# Imports

- Dashboard components under `../components/`
- `useDashboardScreen`
- Auth store and role constants
- Shared `Card` and `Button` UI primitives

# Exports

- `DashboardScreen`
- `default`

# State Management

The screen receives server/query state from `useDashboardScreen`. It reads the current user only for the localized welcome name and legacy role presentation.

# API Usage

- Super admin: `GET /dashboard/summary` through the hook/service.
- Other roles: existing agency, property submission, agent property, and unread-notification queries.

# Navigation

Existing buttons continue navigating to locale-prefixed `/en/manage-listings` and `/en/property-create`; dashboard routing is unchanged.

# Props / Parameters

- See component/handler props in source (TypeScript interfaces).

# Actions / Inputs

No form fields. Props flow from the dashboard hook into presentational child components.

- Review/view assigned listings.
- Add a property for eligible non-agent workspaces.
- View all pending reviews.

## Validations

_No explicit validations detected._

- Super administrators see summary analytics.
- Agency and agent roles retain their operational dashboard branches.
- Loading returns `DashboardScreenSkeleton`.
- Error and empty content are shown without crashing available sections.

# UI Details

- **Theme:** semantic tokens (`bg-page`, `bg-surface`, `text-text`, `text-muted`, `bg-primary`, `border-secondary/15`).
- **Light/dark:** via `ThemeProvider` / `html.light` | `html.dark`.
- **Radius:** `rounded-lg` controls; `rounded-xl` cards/modals/popovers; `rounded-full` avatars/pills.
- **Responsive:** mobile-first (`sm:`, `md:`, `lg:`).
- **Charts:** responsive SVG/CSS visuals with text alternatives; no added dependency.
- **Skeleton:** mirrors KPI and chart grids.

# Flow Description

1. Resolve localized labels and role-aware hook data.
2. Render the layout-matched skeleton while the enabled query is pending.
3. Super admins render seven KPI cards, three line charts, lead-source donut, activities, and health alerts.
4. Missing arrays render localized empty panels.
5. Summary failures show a localized alert while global API handling/toasts report the normalized error.
6. Non-super-admin roles render the existing dashboard workflow.

# Dependencies

- `app/[locale]/(main)/dashboard/page.tsx`
- `src/features/dashboard/hooks/useDashboardScreen.ts`
- Dashboard component files documented in the feature README

# Notes

- The route remains `/[locale]/dashboard`.
