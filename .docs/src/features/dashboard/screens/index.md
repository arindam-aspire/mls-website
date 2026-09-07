# File Overview

Role-aware dashboard screen composing summary analytics and existing operational views.

**Source:** `src/features/dashboard/screens/index.tsx`

# Responsibilities

- Render the super-admin dashboard summary widgets.
- Preserve agency/agent operational dashboard content.
- For Agency Admin, show the logged-in agency name in the hero workspace label and Agency Snapshot, plus an **Active Agents** KPI (`activeAgents` from `/agents/summary`).
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

The screen receives server/query state from `useDashboardScreen`. It reads the current user only for the localized welcome name and legacy role presentation. The Agency Admin hero uses the hook's backend-derived `loggedInAgency.agency_name`, falling back to the localized Workspace label when the backend does not provide a non-empty name.

# API Usage

- Super admin: `GET /dashboard/summary` through the hook/service.
- Agency Admin: `GET /agents/summary` for the Active Agents count; agency name from the authenticated user (`/auth/me`) for the hero workspace label and Agency Snapshot. Other operational cards still use property-submission and unread-notification queries.
- Agent: existing agent property and unread-notification queries.

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
6. Agency Admin replaces the generic hero Workspace label with the logged-in agency name, then renders operational KPIs, including Active Agents (`0` when the summary count is zero), and a single Agency Snapshot row for that agency.
7. Agent roles retain the assigned-listings dashboard workflow.

# Dependencies

- `app/[locale]/(main)/dashboard/page.tsx`
- `src/features/dashboard/hooks/useDashboardScreen.ts`
- Dashboard component files documented in the feature README

# Notes

- The route remains `/[locale]/dashboard`.
