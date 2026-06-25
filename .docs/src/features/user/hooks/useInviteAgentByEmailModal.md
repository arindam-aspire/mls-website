# `useInviteAgentByEmailModal`

**Source:** `src/features/user/hooks/useInviteAgentByEmailModal.ts`

State, validation, generate API call, and share actions for `InviteAgentByEmailModal`.

## Flow

1. User enters email → **Generate invitation** calls `POST /agents/invite`.
2. Same modal view: email stays visible (disabled); `CopyLinkBar` shows the link.
3. **Copy link** on `CopyLinkBar`; **Send via email** via footer primary button.

## Return highlights

| Key | Description |
| --- | --- |
| `primaryActionLabel` | `generate` or `generated.sendViaEmail` |
| `generatingLabel` | Shown on primary button while API runs |
| `onPrimaryAction` | Generate or send via email |

## Consumers

- `useAgentsScreen` → `AgentsScreen`
