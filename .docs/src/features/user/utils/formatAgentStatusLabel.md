# `formatAgentStatusLabel`

**Source:** `src/features/user/utils/formatAgentStatusLabel.ts`

Humanizes a backend agent status enum for UI display without changing meaning.

## Example

`PENDING_REVIEW` → `Pending Review`

## Consumers

- `mapAgentListItemToLibraryAgent`
- `useAgentInviteScreen` (password-instruction status line)
