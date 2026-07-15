# `useAgentOnboardingForm`

**Source:** `src/features/user/hooks/useAgentOnboardingForm.ts`

## File Overview

Form state, validation, and identity-document upload for agent onboarding (invite + manual).

## Responsibilities

- Own form state including `identityDocumentObjectKey` + `identityDocumentUrl` (`signed_read_url` for preview)
- Upload via `uploadAgentIdentityDocument(file, invitationToken?)` → invitation uses `POST /agents/invitations/document-upload`
- Validate required fields only: full name, email, phone, service area (position + identity optional)
- When `invitationToken` is set: `isEmailReadOnly` and email changes are blocked; Full Name autofill is disabled
- `buildSubmitPayload` prefers `object_key` for `identityDocument`

## State Management

Local React state + location taxonomy from property store / `useGetLocationTaxonomy`.

## API Usage

Identity upload only (see [agentUpload.service.md](../services/agentUpload.service.md)). Submit is owned by screen/modal hooks.

## Return highlights

| Key | Purpose |
| --- | --- |
| `isEmailReadOnly` | True when invitation token present |
| `validateForm` / `buildSubmitPayload` | Submit helpers |
| `handlers.onIdentityDocumentSelect` | File pick → upload |

## Dependencies

- `AgentInviteScreen`, `useManualOnboardAgentModal`
