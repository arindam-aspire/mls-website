# Agent list constants

**Source:** `src/features/user/constants/agentList.constants.ts`

Default pagination and sort for `GET /agents`, plus assignable agent status.

| Constant | Value | Purpose |
| --- | --- | --- |
| `DEFAULT_AGENT_LIST_PAGE` | `1` | Initial page |
| `DEFAULT_AGENT_LIST_PAGE_SIZE` | `10` | Page size |
| `AGENT_LIST_SORT_BY` | `invited_at` | Default sort field |
| `AGENT_LIST_SORT_ORDER` | `desc` | Default sort direction |
| `AGENT_ASSIGNABLE_STATUS` | `ACTIVE` | Only ACTIVE agents shown in assign modal |

## Consumers

- `agent.service.ts`, `filterActiveAgents.ts`, `useAssignAgentModal.ts`
