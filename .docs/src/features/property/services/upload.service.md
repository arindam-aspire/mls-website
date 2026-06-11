# File Overview

Presigned upload helpers for property create (owner documents, media images, property documents).

**Source:** `src/features/property/services/upload.service.ts`

# Responsibilities

- `requestUploadPresignedUrl` — authenticated `POST /uploads/presigned-url`.
- `uploadOwnerDocument` — `context: "owner_document"`.
- `uploadPropertyMediaImage` — `context: "property_media_image"` (`media_files`).
- `uploadPropertyDocument` — `context: "property_document"` (`documents`).
- Each helper presigns, `PUT`s bytes to `upload_url`, returns stable public URI via `resolveUploadedFileUrl`.

# Exports

- `requestUploadPresignedUrl(body)`
- `uploadOwnerDocument(file, draftClientId)`
- `uploadPropertyMediaImage(file, draftClientId)`
- `uploadPropertyDocument(file, draftClientId)`

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

Response `data.upload_url` → **PUT** file (no `apiClient`). Prefer `data.file_url` for the stored URI when present.

# Dependencies

- `@/src/apis/endpoints/uploadEndpoints`
- `@/src/lib/upload` (`putFileToPresignedUrl`)
- [upload.types.md](../types/upload.types.md)
