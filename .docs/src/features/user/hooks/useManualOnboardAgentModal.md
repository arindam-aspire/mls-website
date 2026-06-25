# `useManualOnboardAgentModal`

**Source:** `src/features/user/hooks/useManualOnboardAgentModal.ts`

State, validation, `POST /agents/manual-onboard`, and success UI for `ManualOnboardAgentModal`.

## Flow

1. User fills full name, email, phone, service areas → **Submit agent**.
2. API creates agent; form locks and **ManualOnboardSuccessPanel** shows temporary password with copy.
3. Footer: **Cancel** | **Done** (closes modal). Agent list/summary invalidate on success.

## API body

`serviceArea` is comma-separated labels from selected taxonomy options.

## Consumers

- `useAgentsScreen` → `AgentsScreen`
