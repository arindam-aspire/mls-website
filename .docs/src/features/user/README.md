# User feature (`src/features/user/`)

User-management domain for **owners**, **agents**, and thin **`/users/*`** helpers. Owns screens, hooks, services, types, and modals for admin User Management.

## Architecture

```text
user/
  components/  OwnerList / AgentList filters, KPI cards, onboarding forms
  constants/   List query defaults, status filters, column visibility
  hooks/       Screen + modal + confirm hooks
  i18n/        Column / status filter label builders
  mappers/     API → library row mappers
  mutations/   TanStack Query mutations (agents + owners)
  modals/      Invite/onboard (agents) + view/edit/linked (owners)
  screens/     OwnersScreen, AgentsScreen, invite/password setup
  services/    API calls via `apiClient`
  types/       Owner / agent / user API shapes
  utils/       Request params, column builders, filters
```

## Current scope

| Area | Route / API | Screen / consumers |
| --- | --- | --- |
| Owners | `/owners`; `GET/PATCH /agency/owners…` | `OwnersScreen` + `useOwnersScreen` (Admin / Super Admin) |
| Agents | `/agents`; `/agents/*` | `AgentsScreen` + invite/onboard flows |
| Agency assign (user) | `PATCH /users/agency` | `useSelectAgencyModal` (profile) |
| Agent pick list | `GET /agents` | `useAssignAgentModal` (property) |

## Owner Management

- Sidebar: User Management → Owners (`OWNERS` = Super Admin + Agency Admin)
- Table: name, phone, email, linked properties, linked leads, status, actions
- Actions: View, Edit, Activate, Deactivate (confirm + toast + list refresh)
- Linked counts open paginated modals fetching properties/leads APIs
- Route guard: `useAuthorize("OWNERS")` → `/unauthorized` for Agent / Owner / Normal User

## Related features

- **profile** — agency selection imports user services
- **property** — assign-agent modal imports agent list helpers
- **auth** — role permissions in `src/lib/auth/permissions.ts`
