# File Overview

Raw browser upload helper for S3-compatible **presigned** URLs. Used after MLS returns `upload_url` from `POST /uploads/presigned-url` (or agency/profile/agent identity presign endpoints).

**Source:** `src/lib/upload.ts`

# Responsibilities

- Upload file bytes to a storage `upload_url` with **POST** (XHR when progress is needed, otherwise `fetch`).
- Never attach app `Authorization` headers to the storage request.
- Map CORS / 403 failures to a clear error message for callers.

# Exports

| Export | Description |
| --- | --- |
| `putFileToPresignedUrl(uploadUrl, file, contentType, onProgress?)` | POSTs `file` to `uploadUrl` with `Content-Type`; optional `onProgress(0–100)` via XHR |

# API Usage

Does **not** call MLS APIs. Callers obtain `upload_url` first, then:

1. `putFileToPresignedUrl(uploadUrl, file, contentType)` — **POST** body = raw file bytes
2. Persist returned readable URI via `resolveUploadedFileUrl` (prefers `signed_read_url`)

# Dependencies

- Callers: `upload.service.ts`, `agentUpload.service.ts`, `profile.service.ts`
- Related: `resolveUploadedFileUrl.ts`

# Notes

- Function name still starts with `put` for historical call-site stability; HTTP method is **POST**.
- Storage CORS must allow POST from the app origin.
