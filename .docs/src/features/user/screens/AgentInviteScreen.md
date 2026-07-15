# `AgentInviteScreen`

**Source:** `src/features/user/screens/AgentInviteScreen.tsx`

Public landing UI for agent invitation onboarding (`/[locale]/agent-invite`).

## Responsibilities

- Render loading / error / active / password-instruction / form steps from `useAgentInviteScreen`
- Password-instruction step: copy bar + **Open password setup** only when `resolvedPasswordSetupLink` is present
- When the setup URL is missing: hide the open button and show `missingSetupLinkTitle` / `missingSetupLinkDescription`

## UI Details

- Card shell: `rounded-xl`, semantic surfaces (`bg-page`, `bg-surface`)
- Primary CTA opens password setup in a **new tab** (hook-owned `window.open`); this tab is not navigated away

## Dependencies

- `useAgentInviteScreen`, `AgentOnboardingForm`, `CopyLinkBar`, `Button`
