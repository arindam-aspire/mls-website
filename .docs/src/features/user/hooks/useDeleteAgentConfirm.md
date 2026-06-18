# `useDeleteAgentConfirm`

**Source:** `src/features/user/hooks/useDeleteAgentConfirm.ts`

Confirmation state for **Revoke** and **Remove** workflow actions on the agents list.

## Flow

1. `openConfirm(agent, intent)` where `intent` is `"revoke"` or `"remove"`.
2. Builds `confirmModal` props for `ConfirmModal` with localized copy per intent.
3. `onConfirm` calls `DELETE /agents/{agentId}` via `useDeleteAgent`.
4. On success, closes the modal and shows a success toast from the mutation.

## Consumers

- `useAgentsScreen` → `AgentsScreen` → `ConfirmModal`
