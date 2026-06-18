# File Overview

KPI summary cards for the admin **Agents** screen.

**Source:** `src/features/user/components/AgentKPICards.tsx`

# Responsibilities

- Render a responsive grid of agent status metrics: Active, Pending Review, Pending Invite, Declined.
- Display localized label, formatted count, and status icon per card.

# Exports

- `AgentKPICards`
- `AgentKPICardsProps`
- `AgentKPIMetric`
- `AgentKPIMetricId`

# Props / Parameters

| Prop | Type | Description |
| --- | --- | --- |
| `metrics` | `AgentKPIMetric[]` | `{ id, label, value }` from `useAgentsScreen` |
| `sectionAriaLabel` | `string` | Localized section label (`user.agents.kpi.ariaLabel`) |
| `className` | `string` | Optional wrapper classes |

# UI Details

- Grid: `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4` with `gap-2 md:gap-4 lg:gap-6`
- Cards: `rounded-xl`, `border-secondary/10`, `bg-surface`
- Label: uppercase `text-muted`; value: bold `text-2xl` / `text-3xl`
- Icon wells: semantic tone per status (`primary`, `info`, `tertiary`, `danger`)
- Icons: `UserCheck` (active), `Clock` (pending review), `MailOpen` (pending invite), `Ban` (declined)

# Dependencies

- [useAgentsScreen.md](../hooks/useAgentsScreen.md)
- [AgentsScreen.md](../screens/AgentsScreen.md)
