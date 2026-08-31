# `useManualOnboardAgentModal`

**Source:** `src/features/user/hooks/useManualOnboardAgentModal.ts`

State, validation, `POST /agents/manual-onboard`, and success UI for `ManualOnboardAgentModal`.

## Flow

1. User fills full name, email, phone, service areas → **Submit agent**.
2. API creates agent; form locks and **ManualOnboardSuccessPanel** shows:
   - Temporary password (when `agent.temporaryPassword` is non-empty after service normalization) with copy
   - Password setup link (when `agent.inviteLink` is present) with copy. The link host is rewritten onto `window.location.origin` in `parseAgentInviteLink`.
3. Footer: **Cancel** | **Done** (closes modal). Agent list/summary invalidate on success.

## Success state

- `setOnboardResult(result)` stores the normalized `ManualOnboardAgentResult` from `manualOnboardAgent`.
- `onCopyPassword` copies the trimmed `temporaryPassword` (no-op when blank).
- `onCopySetupLink` copies `inviteLink`.
- Success props pass trimmed password and null setup link when empty so the panel never shows a blank password bar.

## API body

`serviceArea` is comma-separated labels from selected taxonomy options.

## Consumers

- `useAgentsScreen` → `AgentsScreen`
