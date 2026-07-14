# `AgentOnboardingForm`

**Source:** `src/features/user/components/AgentOnboardingForm.tsx`

## File Overview

Shared presentational form for public agent invitation onboarding and admin manual onboard.

## Responsibilities

- Render full name, email, phone, WhatsApp, service areas, position, identity document upload
- Email may be **read-only** when `isEmailReadOnly` (invitation flow — value from validate API)
- Position and identity document are **optional** (no required asterisk / no required validation in parent hook)

## Props

See `AgentOnboardingFormProps`. Notable flags:

| Prop | Behavior |
| --- | --- |
| `isEmailReadOnly` | `readOnly` input; no `onChange`; muted text |
| Position / identity | Not `isRequired` |

## UI Details

- Controls: `rounded-lg` via shared Input / PhoneInput / upload
- Responsive stacked fields (`flex-col gap-4`)
- Semantic tokens (`text-text`, `text-muted`, `text-danger`)

## Dependencies

- Used by `AgentInviteScreen`, `ManualOnboardAgentForm` / `ManualOnboardAgentContent`
- Logic: `useAgentOnboardingForm`
