# User components (`src/features/user/components/`)

Presentational UI for admin **Agents** and **Owners** management screens.

## Files

| File | Role |
| --- | --- |
| [AgentList.md](./AgentList.md) | Agents list/table below KPI cards |
| [AgentListFilters.md](./AgentListFilters.md) | Search and filter toolbar for agent list |
| [OwnerList.md](./OwnerList.md) | Owners list/table shell |
| [OwnerListFilters.md](./OwnerListFilters.md) | Search and filter toolbar for owner list |
| [AgentKPICards.md](./AgentKPICards.md) | Summary KPI cards above agent list |
| [AgentKPICardsSkeleton.md](./AgentKPICardsSkeleton.md) | Loading skeleton for KPI grid |
| [InviteAgentByEmailForm.md](./InviteAgentByEmailForm.md) | Invite email field inside invite modal |
| [InviteAgentByEmailContent.md](./InviteAgentByEmailContent.md) | Email field + generating/ready panels |
| [InviteAgentGeneratingPanel.md](./InviteAgentGeneratingPanel.md) | Loading panel with spinner and skeleton |
| [InviteAgentReadyPanel.md](./InviteAgentReadyPanel.md) | Success card with copy link bar |
| [ManualOnboardAgentForm.md](./ManualOnboardAgentForm.md) | Manual onboard form fields |
| [ManualOnboardAgentContent.md](./ManualOnboardAgentContent.md) | Form + success panel |
| [ManualOnboardSuccessPanel.md](./ManualOnboardSuccessPanel.md) | Temporary password success card |

## Conventions

- Components receive resolved labels from screen hooks (`useAgentsScreen`, etc.).
- No business logic or data fetching in components.
