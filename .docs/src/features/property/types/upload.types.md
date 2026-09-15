# File Overview

Request/response types for `POST /uploads/presigned-url`.

**Source:** `src/features/property/types/upload.types.ts`

# Responsibilities

- Type upload contexts used by Create Property and related flows:
  - `owner_document`
  - `property_media_image` / `property_document`
  - `agency_legal_document` / `agent_identity_document` (other hosts)
- Discriminate owner requests (`draft_client_id` required) vs submission requests (`submission_id` and/or `draft_client_id`).
- Describe presign response fields: `upload_url`, `upload_http_method`, `object_key`, `signed_read_url`, `file_url`.

# Exports

- `UploadPresignedUrlContext` and context-specific aliases
- `UploadPresignedUrlRequest` (union)
- `UploadPresignedUrlData`
- `UploadPresignedUrlResponse`

# Dependencies

- [upload.service.md](../services/upload.service.md)
- `@/src/apis/endpoints/uploadEndpoints`
