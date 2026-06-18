# `useResendAgentInvitationConfirm`

**Source:** `src/features/user/hooks/useResendAgentInvitationConfirm.ts`

Confirmation state for the **Resend** workflow action on the agents list.

## Flow

1. `openConfirm(agent)` opens `ConfirmModal` with localized copy.
2. `onConfirm` calls `POST /agents/{agentId}/resend-invitation` via `useResendAgentInvitation`.
3. On success, closes the modal and shows a success toast from the mutation.

## Consumers

- `useAgentsScreen` → `AgentsScreen` → `ConfirmModal`
