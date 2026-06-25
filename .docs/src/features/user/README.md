# User feature (`src/features/user/`)

User-management API domain: **`/users/*`** and **`/agents`** list flows. Owns services, types, constants, and utils that operate on user/agent resources outside profile UI.

## Architecture

```text
user/
  components/  Agent list UI (filters, KPI cards)
  constants/   Agent list query defaults
  hooks/       Future hooks for user/agent flows
  mutations/   Future TanStack Query mutations
  services/    API calls via `apiClient` / `authClient`
  store/       Optional feature state
  types/       User and agent API request/response types
  utils/       Agent list filters (active status, search)
```

## Current scope

| API | Service | Consumers |
| --- | --- | --- |
| `PATCH /users/agency` | `assignUserAgency`, `assignUserAgencyAndRefreshUser` | `useSelectAgencyModal` (profile), `profile.service` re-export |
| `GET /agents` | `getAgentList` | `useAssignAgentModal` (property manage-listings) |
| `/owners` screen | `OwnersScreen` (placeholder) | Admin sidebar + drawer |
| `/agents` screen | `AgentsScreen` (placeholder) | Admin sidebar + drawer |

Future candidates (endpoints already in `userEndpoints.ts`):

- `GET /users/recent-views` — may move from `property` feature when consolidated.

## Files and folders

| Path | Role |
| --- | --- |
| [components/AgentListFilters.md](./components/AgentListFilters.md) | Agent list search/filter toolbar |
| [components/AgentKPICards.md](./components/AgentKPICards.md) | Agent summary KPI cards |
| [components/README.md](./components/README.md) | Components index |
| [services/user.service.md](./services/user.service.md) | Agency assignment + auth refresh |
| [services/agent.service.md](./services/agent.service.md) | Paginated agent list for assignment |
| [types/user.types.md](./types/user.types.md) | `AssignUserAgency*` types |
| [types/agent.types.md](./types/agent.types.md) | Agent list item + pagination shapes |
| [constants/agentList.constants.md](./constants/agentList.constants.md) | Default list query + assignable status |
| [utils/filterActiveAgents.md](./utils/filterActiveAgents.md) | Client-side ACTIVE filter |
| [utils/filterAgentsBySearch.md](./utils/filterAgentsBySearch.md) | Client-side search filter |
| [screens/OwnersScreen.md](./screens/OwnersScreen.md) | Admin owners placeholder screen |
| [screens/AgentsScreen.md](./screens/AgentsScreen.md) | Admin agents placeholder screen |
| [services/README.md](./services/README.md) | Services index |
| [types/README.md](./types/README.md) | Types index |
| [hooks/README.md](./hooks/README.md) | Hooks placeholder |
| [mutations/README.md](./mutations/README.md) | Mutations placeholder |
| [store/README.md](./store/README.md) | Store placeholder |
| [utils/README.md](./utils/README.md) | Utils index |

## Related features

- **profile** — UI for agency selection (`SelectAgencyModal`); imports user services directly.
- **property** — `AssignAgentModal` imports agent list service, types, constants, and utils from this feature.
- **auth** — `getLoggedInUser` after agency assign to refresh `has_agency`.

## Conventions

- Import from `@/src/features/user/services` (barrel) or specific modules under `services/`, `types/`, `utils/`.
- `profile.types` re-exports `AssignUserAgency*` for backward compatibility.
