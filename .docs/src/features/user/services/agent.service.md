# `agent.service`

**Source:** `src/features/user/services/agent.service.ts`

API helpers for agent list, summary, invitation onboarding, and admin onboarding flows.

## `getAgentList`

`GET /agents` with auth. Returns `{ agents, pagination }`.

Default query: `page=1`, `pageSize=10`, `sortBy=invited_at`, `sortOrder=desc`.

Optional query params when provided on `AgentListParams`:

| Param | Description |
| --- | --- |
| `search` | Name/email search string |
| `status` | Uppercase agent status (`ACTIVE`, `INACTIVE`, `INVITED`, `PENDING_PASSWORD`, `PENDING_REVIEW`, `DECLINED`) |

## `getAgentSummary`

`GET /agents/summary` with auth. Returns `AgentSummaryData` (counts + `lastFiveAgents`).

Falls back to zeroed summary when `data` is null.

## `inviteAgentByEmail`

`POST /agents/invite` with auth. Body: `{ email?: string; phone?: string }` (one contact required).

Returns `{ invite: AgentInviteData, message: string }`. Resolves the invitation URL via `resolveAgentInviteLinkFromPayload` (`invitation_url`, `inviteLink`, snake_case aliases) then `parseAgentInviteLink`.

## `validateAgentInvitation`

`GET /agents/invitations/validate?token=` without auth.

Returns `AgentInvitationPreview` including `status`, `formSubmittedAt`, and normalized `passwordSetupLink`.

`fullName` is passed through `resolveInvitationFullName` so an email-seeded backend name never populates the Full Name field.

## `submitAgentInvitation`

`POST /agents/onboarding` without auth (deployed path; local backends may also expose `/agents/invitations/submit` as an alias).

Body: profile payload (`token`, `fullName`, `email`, `phone`, optional `whatsappNumber`, `serviceArea`, optional `position`, optional `identityDocument`).

Returns `{ status, passwordSetupLink, … }` with normalized setup link. Backend ignores client `email` and binds identity to the invitation record.

## `setupAgentPassword`

`POST /agents/password/setup` without auth. Body: `{ token, password }`.

Returns success message string.

## `acceptAgentInvitation`

`POST /agents/invitations/accept` without auth. Body: `{ token, password }`. Legacy compatibility path retained.

## `manualOnboardAgent`

`POST /agents/manual-onboard` with auth. Body: `{ fullName, email, phone, whatsappNumber?, serviceArea, position?, identityDocument? }`.

Returns `{ agent: ManualOnboardAgentData, message: string }`.

Normalizes success payload before returning:

| Field | Sources (first non-empty wins) |
| --- | --- |
| `temporaryPassword` | `temporaryPassword`, `temporary_password` |
| `inviteLink` | `inviteLink`, `passwordSetupLink`, `password_setup_link`, `invite_link` (then `parseAgentInviteLink`) |

Empty temporary passwords are normalized to `""` so the success panel can hide the password `CopyLinkBar` instead of rendering a blank field.

## `resendAgentInvitation`

`POST /agents/{agentId}/resend-invitation` with auth.

Returns `{ invite: AgentInviteData, message: string }`. Resolves invitation URL via `resolveAgentInviteLinkFromPayload` (`invitation_url` preferred).

## `updateAgentStatus`

`PATCH /agents/{agentId}/status` with auth. Body: `{ status, reason? }` (e.g. `ACTIVE`, `DECLINED`).

Returns `{ agent, message }`. Used by admin Approve / Decline; list + summary queries are invalidated by the mutation hook.

## `deleteAgent`

`DELETE /agents/{agentId}` with auth.

Returns `{ message: string }`.

## Related upload service

`src/features/user/services/agentUpload.service.ts` — `uploadAgentIdentityDocument(file, invitationToken?)`:

| Context | Endpoint | Auth |
| --- | --- | --- |
| Invitation onboarding (`invitationToken` set) | `POST /agents/invitations/document-upload` | No — sends `token` |
| Authenticated (manual onboard) | `POST /uploads/presigned-url` | Yes |

Response fields: `upload_url` (PUT/POST to S3), `object_key` (submit reference), `signed_read_url` (preview). Legacy `file_url` still accepted as fallback.

## Consumers

- `useAssignAgentModal` — paginated agent list for assign/reassign modal
- `useAgentsScreen` — KPI metrics from summary counts
- `useInviteAgentByEmailModal` — admin invitation (email or phone)
- `useManualOnboardAgentModal` — manual agent onboarding
- `useAgentInviteScreen` — public invitation validate → profile → password instruction
- `AgentPasswordSetupScreen` — public password activation
- `useResendAgentInvitation` — resend invitation from list workflow
- `useDeleteAgent` — revoke/remove agent from list workflow

## Related

- Endpoint: `src/apis/endpoints/agentEndpoints.ts`
- Types: `src/features/user/types/agent.types.ts`
- Identity document validation: `src/lib/validateIdentityDocumentFile.ts` (5 MB max)
- Full name hygiene: `src/features/user/utils/resolveInvitationFullName.ts`
