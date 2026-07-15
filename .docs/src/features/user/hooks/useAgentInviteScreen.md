# `useAgentInviteScreen`

**Source:** `src/features/user/hooks/useAgentInviteScreen.ts`

Public agent invitation onboarding screen logic: validate token → profile form → password-setup instruction.

## Flow

1. Load invitation via `GET /agents/invitations/validate?token=`.
2. Hydrate onboarding form (`resolveInvitationFullName` keeps Full Name empty when API seeds email as name).
3. Submit profile via `POST /agents/onboarding`.
4. On success, show password-instruction step with backend `passwordSetupLink`.
5. **Open password setup** calls `window.open(url, "_blank", "noopener,noreferrer")` so the current tab stays on the invitation page.
6. Status shown on the password-instruction step is the formatted backend status (`formatAgentStatusLabel`), not a derived Active/Pending Password label.
7. If the setup URL is missing, the open button is not rendered and an inline error is shown; a toast is also fired if open is attempted without a URL or if the popup is blocked.

## Handlers

| Handler | Behavior |
| --- | --- |
| `onOpenPasswordSetup` | Opens backend `passwordSetupLink` in a new tab |
| `onCopyPasswordSetupLink` | Copies setup URL to clipboard |
| `onSubmitProfile` | Validates + submits onboarding form |
| `onGoToSignIn` | Navigates to `/` (locale-aware) |

## Consumers

- `AgentInviteScreen`
