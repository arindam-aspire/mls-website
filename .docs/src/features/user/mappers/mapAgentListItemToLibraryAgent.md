# `mapAgentListItemToLibraryAgent`

**Source:** `src/features/user/mappers/mapAgentListItemToLibraryAgent.ts`

Maps MLS `AgentListItem` rows to `@abdoun/abdoun-library` `Agent` via `mapAgentApiListingToAgent`, then overrides status when needed.

## Status key override

`PENDING_REVIEW` API status is remapped to library key `pending` so approve/decline row actions appear (the library `AGENT_API_STATUS_KEY_MAP` does not include `PENDING_REVIEW`).

## Activity date rule

`reviewedAt` is passed to the library as `reviewedAt ?? invitedAt`, so activity date shows the invite timestamp when review is null.

## Exports

- `resolveAgentActivityDate`
- `mapAgentListItemToLibraryAgent`
- `mapAgentListItemsToLibraryAgents`

## Consumers

- `useAgentsScreen`
