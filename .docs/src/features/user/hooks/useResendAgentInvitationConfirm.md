# `useResendAgentInvitationConfirm`

**Source:** `src/features/user/hooks/useResendAgentInvitationConfirm.ts`

Confirmation + copy-link state for the **Resend** workflow action on the agents list.

## Flow

1. `openConfirm(agent)` opens `ConfirmModal` with localized copy.
2. `onConfirm` calls `POST /agents/{agentId}/resend-invitation` via `useResendAgentInvitation`.
3. On success:
   - Mutation shows the existing success toast.
   - Confirm modal closes.
   - If the response includes an invitation URL (`invitation_url` / `inviteLink`), `copyLinkModal` opens automatically with `CopyInvitationLinkModal`. The URL host is rewritten onto `window.location.origin` in `parseAgentInviteLink`.
4. User can **Copy to Clipboard** or **Close** the copy-link modal.

## Returns

| Key | Purpose |
| --- | --- |
| `openConfirm` | Start resend confirm for an agent |
| `confirmModal` | Props for `ConfirmModal`, or `null` |
| `copyLinkModal` | Props for `CopyInvitationLinkModal`, or `null` |

## Consumers

- `useAgentsScreen` → `AgentsScreen` → `ConfirmModal` + `CopyInvitationLinkModal`
