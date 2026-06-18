# File Overview

Admin **Agents** screen with page header, KPI summary cards, and onboard action. Rendered at `/agents`.

**Source:** `src/features/user/screens/AgentsScreen.tsx`

# Responsibilities

- Render page title, subtitle, and two onboarding actions: **Invite by email** and **Manual onboarding**.
- Show KPI summary cards from `GET /agents/summary` (skeleton while loading).
- Compose `AgentList` card below the KPI row (`AgentListFilters` inside; table pending).

# Imports

- `useAgentsScreen` from `@/src/features/user/hooks/useAgentsScreen`
- `AgentKPICards`, `AgentKPICardsSkeleton`, `AgentList` from `@/src/features/user/components`
- `Button` from `@/src/components/ui`
- `InviteAgentByEmailModal`, `ManualOnboardAgentModal` from `@/src/features/user/modals`
- `ConfirmModal` from `@/src/components/common/ConfirmModal`
- `Mail`, `UserRoundPen` from `lucide-react`

# Modals

- **Invite by email** → `InviteAgentByEmailModal` (email field)
- **Manual onboarding** → `ManualOnboardAgentModal` (full name, email, phone, service areas)
- **Resend invitation** → `ConfirmModal` via `useResendAgentInvitationConfirm` (`POST /agents/{id}/resend-invitation`)
- **Revoke / Remove** → `ConfirmModal` via `useDeleteAgentConfirm` (`DELETE /agents/{id}`)

# Exports

- `AgentsScreen`

# Actions / Inputs

- **Invite by email** button → opens `InviteAgentByEmailModal`.
- **Manual onboarding** button → opens `ManualOnboardAgentModal`.

# UI Details

- Mobile-first toolbar: stacked on small screens, title left / button right from `sm:`.
- `headingPageClasses` + `bodyLargeTextClasses` for title/subtitle; `text-muted` subtitle.
- Two onboarding buttons (`Mail` outline invite, `UserRoundPen` primary manual), `rounded-lg`, full width on mobile; button group gap `gap-2 sm:gap-2 md:gap-4 lg:gap-6`.
- `AgentKPICardsSkeleton` while `isKpiLoading`; then `AgentKPICards` grid (`1` / `2` / `4` columns, `gap-2 md:gap-4 lg:gap-6`).
- `AgentList` card below KPI section with nested `AgentListFilters`; receives `list` data from `getAgentList` (table UI pending).

# Flow Description

1. `useAgentsScreen` fetches agent summary and builds KPI metrics.
2. Screen renders header row; KPI section shows skeleton until summary loads.
3. `AgentList` card renders below KPI cards with filter props from `listFilters`.
4. Each onboarding button opens its own modal directly (no method picker).
5. On fetch error, hook shows toast (`user.agents.summary.fetchErrorTitle`); KPI row shows zero counts after load settles.

# Dependencies

- [useAgentsScreen.md](../hooks/useAgentsScreen.md)
- [AgentKPICards.md](../components/AgentKPICards.md)
- [AgentKPICardsSkeleton.md](../components/AgentKPICardsSkeleton.md)
- [AgentList.md](../components/AgentList.md)
- [InviteAgentByEmailModal.md](../modals/InviteAgentByEmailModal.md)
- [ManualOnboardAgentModal.md](../modals/ManualOnboardAgentModal.md)
