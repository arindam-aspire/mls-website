# `resolveUploadedFileUrl`

**Source:** `src/lib/resolveUploadedFileUrl.ts`

## File Overview

Resolves a readable URL from a presigned upload response for preview/download.

## Behavior

1. Prefer `signed_read_url` (signed, time-limited read URL)
2. Fall back to legacy `file_url`
3. Last resort: strip query string from `upload_url`

## Signature

```ts
resolveUploadedFileUrl(
  uploadUrl: string,
  options?: { signedReadUrl?: string | null; fileUrl?: string | null } | string | null,
): string
```

Passing a string as the second argument remains supported (treated as legacy `file_url`).

## Notes

Do not treat stripped `upload_url` as a public CDN URL when the backend returns `signed_read_url` / `object_key`.
