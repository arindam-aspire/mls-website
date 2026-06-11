# File Overview

Hook for property media step uploads on the property create form. Uses the active draft `submission_id` for presign requests.

**Source:** `src/features/property/hooks/usePropertyMediaUpload.ts`

# Responsibilities

- Require `submissionId` before upload (save draft first on new properties).
- Validate media images (JPEG, PNG, WebP, GIF; max 10 MB) and documents (PDF, DOC, DOCX; max 10 MB).
- Delegate uploads to `uploadPropertyMediaImage` / `uploadPropertyDocument` (presign + PUT).
- Toast localized errors on validation, missing submission, or upload failure.

# API Usage

| Input | Context | Form key | Presign key |
| --- | --- | --- | --- |
| `onUploadPropertyMedia` | `property_media_image` | `media_files` | `submission_id` |
| `onUploadPropertyDocument` | `property_document` | `documents` | `submission_id` |

Per file: **POST** `/uploads/presigned-url` → **PUT** presigned URL.

# Props / Parameters

- `usePropertyMediaUpload(submissionId)` — `submissionId` from `usePropertyCreateScreen` (URL query after first draft save or resume).

# Exports

- `usePropertyMediaUpload(submissionId)` → `{ onUploadPropertyMedia, onUploadPropertyDocument }`

# Dependencies

- [upload.service.md](../services/upload.service.md)
- [usePropertyCreateScreen.md](./usePropertyCreateScreen.md)
