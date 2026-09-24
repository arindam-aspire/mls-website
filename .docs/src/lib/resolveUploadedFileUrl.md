# `resolveUploadedFileUrl`

**Source:** `src/lib/resolveUploadedFileUrl.ts`

## File Overview

Resolves URLs from a presigned upload response: a **preview** URL (`resolveUploadedFileUrl`) and a **persisted** storage reference (`resolvePersistedUploadReference`). Property create stores a signed preview on the form `uri` so Review & Submit can render `<img src>`, then maps back to the persist ref on draft save.

## Behavior

### `resolveUploadedFileUrl` (preview / download)

1. Prefer `signed_read_url` (signed, time-limited read URL)
2. Fall back to legacy `file_url`
3. Last resort: strip query string from `upload_url`

### `resolvePersistedUploadReference` (API storage fields)

1. Prefer canonical `file_url`
2. Fall back to `object_key`
3. Last resort: query-stripped `upload_url`

### `isBrowserDisplayableFileUrl`

True for `http(s):`, `blob:`, and `data:` URIs. Object keys and `dev://` refs are not loadable in `<img>`.

### `rememberPersistedUploadReference` / `resolvePersistableFileUri`

In-memory map from signed preview URL → `file_url` / `object_key`. Draft/submit mappers call `resolvePersistableFileUri` so payloads keep the stable key.

Do **not** persist `signed_read_url` — it expires. Super-admin offline registration stores this value as `legal_document_s3_link`.

## Signature

```ts
isBrowserDisplayableFileUrl(uri?: string | null): boolean

rememberPersistedUploadReference(displayUrl: string, persistRef: string): void

resolvePersistableFileUri(uri: string): string

resolveUploadedFileUrl(
  uploadUrl: string,
  options?: { signedReadUrl?: string | null; fileUrl?: string | null } | string | null,
): string

resolvePersistedUploadReference(data: {
  file_url?: string | null;
  object_key?: string | null;
  upload_url?: string | null;
}): string
```

Passing a string as the second argument of `resolveUploadedFileUrl` remains supported (treated as legacy `file_url`).

## Notes

Do not treat stripped `upload_url` as a public CDN URL when the backend returns `signed_read_url` / `object_key`.
