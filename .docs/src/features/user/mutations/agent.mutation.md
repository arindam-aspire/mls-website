# `agent.mutation`

**Source:** `src/features/user/mutations/agent.mutation.ts`

React Query mutations for agent admin APIs.

## `useInviteAgentByEmail`

- **Mutation:** `inviteAgentByEmail` → `POST /agents/invite` with `{ email }` or `{ phone }`.
- **On success:** invalidates `["agents", "summary"]` and `["agents", "list"]`.
- **Toasts:** none — `useInviteAgentByEmailModal` owns a single success/error toast per click (avoids duplicate toasts from mutation + hook).

## `useManualOnboardAgent`

- **Mutation:** `manualOnboardAgent` → `POST /agents/manual-onboard`.
- **On success:** invalidates agent summary and list queries.
- **On error:** error toast (`user.agents.manualOnboardModal.errorTitle`).

## `useResendAgentInvitation`

- **Mutation:** `resendAgentInvitation` → `POST /agents/{agentId}/resend-invitation`.
- **On success:** invalidates agent summary and list queries; success toast (`user.agents.resendConfirm.successTitle`).
- **On error:** error toast (`user.agents.resendConfirm.errorTitle`).

## `useUpdateAgentStatus`

- **Mutation:** `updateAgentStatus` → `PATCH /agents/{agentId}/status` with `{ status, reason? }`.
- **On success:** invalidates `["agents", "summary"]` and `["agents", "list"]` so the UI refreshes to the backend status (e.g. Active after admin approve).
- **Toasts:** success/error under `user.agents.statusUpdate`.

## `useDeleteAgent`

- **Mutation:** `deleteAgent` → `DELETE /agents/{agentId}`.
- **On success:** invalidates agent summary and list queries; success toast (`user.agents.deleteConfirm.successTitle`).
- **On error:** error toast (`user.agents.deleteConfirm.errorTitle`).

## Consumers

- `useInviteAgentByEmailModal`
- `useManualOnboardAgentModal`
- `useResendAgentInvitationConfirm`
- `useDeleteAgentConfirm`
