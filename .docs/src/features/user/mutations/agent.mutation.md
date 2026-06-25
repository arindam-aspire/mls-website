# `agent.mutation`

**Source:** `src/features/user/mutations/agent.mutation.ts`

React Query mutations for agent admin APIs.

## `useInviteAgentByEmail`

- **Mutation:** `inviteAgentByEmail` → `POST /agents/invite` with `{ email }`.
- **On success:** invalidates `["agents", "summary"]` and `["agents", "list"]`.
- **On error:** error toast (`user.agents.inviteByEmailModal.errorTitle`).

## `useManualOnboardAgent`

- **Mutation:** `manualOnboardAgent` → `POST /agents/manual-onboard`.
- **On success:** invalidates agent summary and list queries.
- **On error:** error toast (`user.agents.manualOnboardModal.errorTitle`).

## `useResendAgentInvitation`

- **Mutation:** `resendAgentInvitation` → `POST /agents/{agentId}/resend-invitation`.
- **On success:** invalidates agent summary and list queries.
- **On error:** error toast (`user.agents.resendConfirm.errorTitle`).
- **On success:** success toast (`user.agents.resendConfirm.successTitle`).

## `useDeleteAgent`

- **Mutation:** `deleteAgent` → `DELETE /agents/{agentId}`.
- **On success:** invalidates agent summary and list queries; success toast (`user.agents.deleteConfirm.successTitle`).
- **On error:** error toast (`user.agents.deleteConfirm.errorTitle`).

## Consumers

- `useInviteAgentByEmailModal`
- `useManualOnboardAgentModal`
- `useResendAgentInvitationConfirm`
- `useDeleteAgentConfirm`
