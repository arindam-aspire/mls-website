# File Overview

Raw browser upload helper for S3-compatible **presigned** URLs. Used after MLS returns `upload_url` from `POST /uploads/presigned-url` (or agency/profile/agent identity presign endpoints).

**Source:** `src/lib/upload.ts`

# Responsibilities

- Upload file bytes to a storage `upload_url` with **PUT** by default (XHR when progress is needed, otherwise `fetch`).
- Never attach app `Authorization` headers to the storage request.
- Map CORS / 403 failures to a clear error message for callers.

# Exports

| Export | Description |
| --- | --- |
| `PresignedUploadHttpMethod` | `"PUT"` \| `"POST"` |
| `putFileToPresignedUrl(uploadUrl, file, contentType, onProgress?, httpMethod?)` | Sends `file` to `uploadUrl` with `Content-Type`; optional `onProgress(0–100)` via XHR. Default method is **PUT**. |

# API Usage

Does **not** call MLS APIs. Callers obtain `upload_url` first, then:

1. `putFileToPresignedUrl(uploadUrl, file, contentType)` — **PUT** body = raw file bytes (matches `data.upload_http_method` from MLS)
2. Persist canonical `file_url` / `object_key` via `resolvePersistedUploadReference`; use `resolveUploadedFileUrl` (prefers `signed_read_url`) only for preview

# Dependencies

- Callers: `upload.service.ts`, `agentUpload.service.ts`, `profile.service.ts`
- Related: `resolveUploadedFileUrl.ts`

# Notes

- MLS `generate_presigned_put_url` signs **PUT**. POSTing to that URL fails with 403 after a successful `POST /uploads/presigned-url`.
- Pass `httpMethod: "POST"` only when a presign response explicitly sets `upload_http_method: "POST"`.
