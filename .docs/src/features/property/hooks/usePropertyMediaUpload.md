# File Overview

Hook for property media step uploads on the property create form.

**Source:** `src/features/property/hooks/usePropertyMediaUpload.ts`

# Responsibilities

- Prefer `submission_id` for presign targets.
- When `submission_id` is missing, call host `ensureSubmissionIdRef` (save draft via `onDraft`) and retry with the returned id.
- If draft save fails or returns no id, fall back to a stable `draft_client_id` from `createDraftClientId()`.
- Validate property media before upload via `validatePropertyMediaImageFile`:
  - images: `JPEG`, `PNG`, `WebP`, `GIF` up to `10 MB`
  - videos: `MP4`, `MOV` up to `50 MB`
- Validate documents via `validateOwnerDocumentFile` (`PDF`, `DOC`, `DOCX`; max `10 MB`).
- Delegate uploads to `uploadPropertyMediaImage` / `uploadPropertyDocument` (presign + PUT/POST).
- Return a **preview** remote URI (`signed_read_url` when present) or `null` on failure; toast localized errors (no hardcoded English fallbacks). Draft save remaps that URI to the persist key.

# API Usage

| Input | Context | Form key | Presign key |
| --- | --- | --- | --- |
| `onUploadPropertyMedia` | `property_media_image` | `media_files` | `submission_id` (preferred) or `draft_client_id` |
| `onUploadPropertyDocument` | `property_document` | `documents` | same |

Per file: **POST** `/uploads/presigned-url` → **PUT** or **POST** to `upload_url` (per `upload_http_method`).

# Props / Parameters

- `usePropertyMediaUpload(submissionId, options?)`
  - `submissionId` — from `usePropertyCreateScreen` (URL query after first draft save or resume)
  - `options.ensureSubmissionIdRef` — ref to `() => Promise<string | null>` that saves draft when id is missing

# Exports

- `usePropertyMediaUpload(submissionId, options?)` → `{ onUploadPropertyMedia, onUploadPropertyDocument }`

# Dependencies

- [upload.service.md](../services/upload.service.md)
- [usePropertyCreateScreen.md](./usePropertyCreateScreen.md)
- [validatePropertyMediaImageFile.md](../../../lib/validatePropertyMediaImageFile.md)
- [validateOwnerDocumentFile.md](../../../lib/validateOwnerDocumentFile.md)
