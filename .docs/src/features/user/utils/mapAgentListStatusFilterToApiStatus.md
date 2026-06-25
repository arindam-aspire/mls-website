# `mapAgentListStatusFilterToApiStatus`

**Source:** `src/features/user/utils/mapAgentListStatusFilterToApiStatus.ts`

Maps `AgentListFilters` dropdown values to uppercase API `status` query params.

| UI value | API `status` |
| --- | --- |
| `active` | `ACTIVE` |
| `inactive` | `INACTIVE` |
| `invited` | `INVITED` |
| `pending` | `PENDING_REVIEW` |
| `declined` | `DECLINED` |

Empty or unknown values return `undefined` (param omitted).

## Consumers

- `buildAgentListRequestParams`
