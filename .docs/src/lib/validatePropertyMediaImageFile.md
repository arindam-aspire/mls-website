# File Overview

Validates files selected in **Create Property -> Media & Documents** before MLS requests a presigned upload URL.

**Source:** `src/lib/validatePropertyMediaImageFile.ts`

# Responsibilities

- Export byte limits for property media uploads:
  - images up to `10 MB`
  - videos up to `50 MB`
- Accept image formats: `JPEG`, `PNG`, `WebP`, `GIF`
- Accept video formats: `MP4`, `MOV`
- Resolve a supported media MIME type from either the browser-provided MIME or the filename extension for presign requests
- Reject unsupported file types or empty files
- Return localized validation message keys supplied by the caller instead of throwing

# Exports

- `MAX_PROPERTY_MEDIA_IMAGE_BYTES`
- `MAX_PROPERTY_MEDIA_VIDEO_BYTES`
- `ACCEPTED_PROPERTY_MEDIA_IMAGE_TYPES`
- `ACCEPTED_PROPERTY_MEDIA_IMAGE_EXTENSIONS`
- `ACCEPTED_PROPERTY_MEDIA_VIDEO_TYPES`
- `ACCEPTED_PROPERTY_MEDIA_VIDEO_EXTENSIONS`
- `isAcceptedPropertyMediaImageFile(file)`
- `isAcceptedPropertyMediaVideoFile(file)`
- `resolvePropertyMediaContentType(file)`
- `validatePropertyMediaImageFile(file, messages)`

# Props / Parameters

| Export | Parameters | Notes |
| --- | --- | --- |
| `isAcceptedPropertyMediaImageFile` | `file: File` | Uses MIME type first, then lowercase filename extension fallback |
| `isAcceptedPropertyMediaVideoFile` | `file: File` | Accepts `video/mp4`, `video/quicktime`, or `.mp4`, `.mov` |
| `resolvePropertyMediaContentType` | `file: File` | Resolves image and video MIME types, including extension-only MP4/MOV files; unsupported files fall back to `application/octet-stream` |
| `validatePropertyMediaImageFile` | `file: File`, `messages: { invalidType; tooLarge }` | Returns `null` when valid, otherwise one localized error string |

# Flow Description

1. Check whether the selected file matches one of the accepted image or video formats.
2. If the file is an image, enforce the `10 MB` image cap.
3. If the file is a video, enforce the `50 MB` video cap.
4. Reject zero-byte files as invalid.
5. Return the caller-provided localized error string for invalid type or size.

# Dependencies

- [usePropertyMediaUpload.md](../features/property/hooks/usePropertyMediaUpload.md)

# Notes

- Despite the filename, this module now validates both property images and property videos to keep the MLS upload hook change minimal.
- This validation is client-side only; backend upload policies may still enforce their own limits.
