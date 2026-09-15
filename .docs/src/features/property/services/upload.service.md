# File Overview

Presigned upload helpers for property create (owner documents, media images, property documents).

**Source:** `src/features/property/services/upload.service.ts`

# Responsibilities

- `requestUploadPresignedUrl` — authenticated `POST /uploads/presigned-url`.
- `uploadOwnerDocument` — `context: "owner_document"` with `draft_client_id` (works before a submission id exists). Returns a **stable** persistence reference via `resolvePersistedUploadReference` (same as media/docs — never store expiring `signed_read_url` in drafts).
- `uploadPropertyMediaImage` — `context: "property_media_image"` (`media_files`) with image/video content-type resolution for JPG, PNG, WebP, GIF, MP4, and MOV.
- `uploadPropertyDocument` — `context: "property_document"` (`documents`).
- Each helper: presign → **PUT** or **POST** bytes to `upload_url` (per `upload_http_method`).
- Media and property-document helpers accept `UploadSubmissionTarget` (`submission_id` and/or `draft_client_id`).
- Presign failures throw with the backend `message` when present (empty string otherwise); callers toast localized titles.

# Exports

- `requestUploadPresignedUrl(body)`
- `uploadOwnerDocument(file, draftClientId)`
- `uploadPropertyMediaImage(file, target)`
- `uploadPropertyDocument(file, target)`

# API Usage

**POST** `/uploads/presigned-url` (auth required)

Owner document:

```json
{
  "draft_client_id": "<uuid>",
  "context": "owner_document",
  "file_name": "owner-id.pdf",
  "content_type": "application/pdf",
  "file_size": 102400
}
```

Property media (`media_files` / `documents`):

```json
{
  "submission_id": "<draft submission id>",
  "context": "property_media_image",
  "file_name": "photo.jpg",
  "content_type": "image/jpeg",
  "file_size": 204800
}
```

Response `data.upload_url` → **PUT**/**POST** file (no `apiClient`). Create Property callbacks return `data.file_url`, `data.object_key`, or the stripped upload URL for stable draft persistence.

# Dependencies

- `@/src/apis/endpoints/uploadEndpoints`
- `@/src/lib/upload` (`putFileToPresignedUrl`)
- [upload.types.md](../types/upload.types.md)
