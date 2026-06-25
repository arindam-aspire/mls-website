# Manual onboard agent modal

**Source:** `src/features/user/modals/ManualOnboardAgentModal.tsx`

Form modal for manual agent creation via `POST /agents/manual-onboard`.

## Flow

1. **Submit agent** — validates and calls API (`fullName`, `email`, `phone` E.164, `serviceArea`).
2. Success panel shows **temporary password** with `CopyLinkBar`.
3. Footer: **Cancel** | **Done** after success.

## Consumers

- `AgentsScreen` via `useManualOnboardAgentModal`
