# `useInviteAgentByEmailModal`

**Source:** `src/features/user/hooks/useInviteAgentByEmailModal.ts`

State, validation, generate API call, and share actions for `InviteAgentByEmailModal`.

## Flow

1. User enters email or phone → **Generate invitation** calls `POST /agents/invite` once per click.
2. While pending: primary button is disabled via `isLoading` / `isGenerating`; an in-flight ref blocks duplicate submits.
3. **Success:** one success toast with the backend `message` (fallback: `generated.readyTitle`); modal shows the ready panel with the invitation URL rewritten onto `window.location.origin`.
4. **Failure:** one error toast (`errorTitle` + backend `message`, fallback: `user.agents.errors.generic`); duplicate email/phone also set field errors.
5. **Copy link** on `CopyLinkBar`; **Send via email** via footer primary button.

## Toast ownership

Toasts for generate are owned **only** by this hook (not `useInviteAgentByEmail` mutation callbacks), so re-renders and React Query `onError` cannot double-fire notifications.

## Return highlights

| Key | Description |
| --- | --- |
| `primaryActionLabel` | `generate` or `generated.sendViaEmail` |
| `generatingLabel` | Shown on primary button while API runs |
| `isGenerating` | Disables generate/cancel while the invite request is in flight |
| `onPrimaryAction` | Generate or send via email |

## Consumers

- `useAgentsScreen` → `AgentsScreen`
