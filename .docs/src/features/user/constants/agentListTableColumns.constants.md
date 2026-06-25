# Agent list table columns

**Source:** `src/features/user/constants/agentListTableColumns.constants.ts`

Column ids and default visibility for the future agents table and column picker.

## Exports

| Symbol | Role |
| --- | --- |
| `AGENT_LIST_TABLE_COLUMN_IDS` | All column ids |
| `AGENT_LIST_ALWAYS_VISIBLE_COLUMN_IDS` | `agent`, `actions` |
| `AGENT_LIST_TOGGLEABLE_COLUMN_IDS` | `contact`, `city`, `status`, `activityDate` |
| `DEFAULT_AGENT_LIST_COLUMN_VISIBILITY` | Default toggle state |
| `AGENT_LIST_COLUMN_I18N_KEY` | Maps column id → `user.agents.list.columns.*` key |
| `resolveAgentListColumnVisibility` | Merges partial/stale visibility with defaults |

## Consumers

- `useAgentsScreen` — builds `columnOptions` for `AgentListFilters`
- Future agents table component
