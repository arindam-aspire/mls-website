# File Overview

Hook for owner document uploads on the property create form. Generates a stable `draft_client_id` per screen mount and wires `PropertyForm` `onUploadOwnerDocument`.

**Source:** `src/features/property/hooks/useOwnerDocumentUpload.ts`

# Responsibilities

- Create `draft_client_id` once per mount via `createDraftClientId` (separate UUID from media uploads).
- Validate file type/size (PDF, DOC, DOCX; max 10 MB).
- Delegate upload to `uploadOwnerDocument` (presign + PUT).
- Toast localized errors on validation or upload failure.
- Stable `onUploadOwnerDocument` callback (`toastRef`) — pairs with `@abdoun/abdoun-library` **0.1.57+** upload state fixes (`handleOwnerDocumentUploadingChange`, `DocInput` / `MediaInput` `onUploadingChange`).

# API Usage

| Step | Method | Endpoint | Notes |
| --- | --- | --- | --- |
| A | POST | `/uploads/presigned-url` | `{ draft_client_id, context: "owner_document", file_name, content_type, file_size }` |
| B | PUT | presigned `upload_url` | Raw `putFileToPresignedUrl` — no auth headers |

# Exports

- `useOwnerDocumentUpload()` → `{ onUploadOwnerDocument }`

# Props / Parameters

- `onUploadOwnerDocument(file, { ownerIndex })` — matches `@abdoun/abdoun-library` `PropertyForm`; returns `Promise<string | null>` (remote document URI).

# Dependencies

- [upload.service.md](../services/upload.service.md)
- [usePropertyCreateScreen.md](./usePropertyCreateScreen.md)
