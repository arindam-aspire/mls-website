# `agentUpload.service`

**Source:** `src/features/user/services/agentUpload.service.ts`

## File Overview

Presigned upload helper for agent identity documents. Splits invitation (unauthenticated) and authenticated paths so existing `/uploads/presigned-url` auth flows stay unchanged.

## Responsibilities

- Request a presigned upload URL
- `POST` file bytes to S3 via `putFileToPresignedUrl`
- Return `{ objectKey, signedReadUrl }` for form state / submit

## API Usage

### Invitation onboarding (no auth)

`POST /agents/invitations/document-upload`

```json
{
  "token": "<invitation token>",
  "file_name": "id.pdf",
  "content_type": "application/pdf",
  "file_size": 102400
}
```

### Authenticated (manual onboard)

`POST /uploads/presigned-url` with Bearer auth:

```json
{
  "context": "agent_identity_document",
  "file_name": "id.pdf",
  "content_type": "application/pdf",
  "file_size": 102400
}
```

### Response `data`

| Field | Use |
| --- | --- |
| `upload_url` | Direct S3 upload target |
| `object_key` | Stored / submitted as `identityDocument` |
| `signed_read_url` | Preview/download in UI |
| `file_url` | Legacy fallback only |

## Exports

- `uploadAgentIdentityDocument(file, invitationToken?)` → `AgentIdentityDocumentUploadResult`
- `AgentIdentityDocumentUploadResult`

## Dependencies

- `uploadEndpoints.INVITATION_DOCUMENT_UPLOAD` / `PRESIGNED_URL`
- `resolveUploadedFileUrl`, `putFileToPresignedUrl`
- Consumer: `useAgentOnboardingForm`
