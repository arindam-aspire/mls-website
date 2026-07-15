# `mapAgentListItemToLibraryAgent`

**Source:** `src/features/user/mappers/mapAgentListItemToLibraryAgent.ts`

Maps MLS `AgentListItem` rows to `@abdoun/abdoun-library` `Agent` via `mapAgentApiListingToAgent`, then overrides status so the badge label matches the backend enum.

## Status mapping

| Backend status | Badge key | Label |
| --- | --- | --- |
| `ACTIVE` | `active` | Active |
| `INACTIVE` | `inactive` | Inactive |
| `PENDING_REVIEW` / `PENDING_APPROVAL` / `PENDING_PASSWORD` / `PENDING` | `pending` | Formatted from API enum (e.g. Pending Review) |
| `INVITED` | `invited` | Invited |
| `DECLINED` | `declined` | Declined |

Label is always produced from the raw backend status via `formatAgentStatusLabel` — never forced to Active after password setup.

**Upstream suggestion for `@abdoun/abdoun-library`:** add `PENDING_PASSWORD` and `PENDING_REVIEW` to `AGENT_API_STATUS_KEY_MAP` (both → `pending`).

## Activity date rule

`resolveAgentActivityDate` picks the first non-empty of:

1. `reviewedAt`
2. `passwordSetAt`
3. `formSubmittedAt`
4. `invitedAt`

That value is passed to the library as `reviewedAt` / `activityDate`, so Activity Date stays populated after form submit and password setup (when the invite is marked used and `reviewedAt` is still null).

## Exports

- `resolveAgentActivityDate`
- `mapAgentListStatus`
- `mapAgentListItemToLibraryAgent`
- `mapAgentListItemsToLibraryAgents`

## Consumers

- `useAgentsScreen`
