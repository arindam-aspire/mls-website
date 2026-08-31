# File Overview

Hook for property media step uploads on the property create form. Uses the active draft `submission_id` for presign requests.

**Source:** `src/features/property/hooks/usePropertyMediaUpload.ts`

# Responsibilities

- Resolve upload context from the active draft: reuse `submission_id` for resumed drafts or a generated `draft_client_id` while the first draft save is pending.
- Validate property media before upload:
  - images: `JPEG`, `PNG`, `WebP`, `GIF` up to `10 MB`
  - videos: `MP4`, `MOV` up to `50 MB`
- Validate documents separately (`PDF`, `DOC`, `DOCX`; max `10 MB`).
- Delegate uploads to `uploadPropertyMediaImage` / `uploadPropertyDocument` (presign + PUT).
- Toast localized errors on validation or upload failure.

# API Usage

| Input | Context | Form key | Presign key |
| --- | --- | --- | --- |
| `onUploadPropertyMedia` | `property_media_image` | `media_files` | `submission_id` or generated `draft_client_id` |
| `onUploadPropertyDocument` | `property_document` | `documents` | `submission_id` |

Per file: **POST** `/uploads/presigned-url` → **PUT** presigned URL.

# Props / Parameters

- `usePropertyMediaUpload(submissionId)` — `submissionId` from `usePropertyCreateScreen` (URL query after first draft save or resume).

# Exports

- `usePropertyMediaUpload(submissionId)` → `{ onUploadPropertyMedia, onUploadPropertyDocument }`

# Dependencies

- [upload.service.md](../services/upload.service.md)
- [usePropertyCreateScreen.md](./usePropertyCreateScreen.md)
- [validatePropertyMediaImageFile.md](../../../lib/validatePropertyMediaImageFile.md)
