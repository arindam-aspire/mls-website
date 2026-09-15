# File Overview

Client-side validation for owner documents and property documents on Create Property.

**Source:** `src/lib/validateOwnerDocumentFile.ts`

# Responsibilities

- Accept `PDF`, `DOC`, `DOCX` (MIME or extension).
- Enforce max size `10 MB` (`MAX_OWNER_DOCUMENT_BYTES`).
- Reject empty files.
- Return localized message strings supplied by the caller (no hardcoded user-facing copy).

# Exports

- `MAX_OWNER_DOCUMENT_BYTES`
- `ACCEPTED_OWNER_DOCUMENT_TYPES`
- `ACCEPTED_OWNER_DOCUMENT_EXTENSIONS`
- `isAcceptedOwnerDocumentFile(file)`
- `validateOwnerDocumentFile(file, messages)` → `string | null`

# Dependencies

- [useOwnerDocumentUpload.md](../features/property/hooks/useOwnerDocumentUpload.md)
- [usePropertyMediaUpload.md](../features/property/hooks/usePropertyMediaUpload.md)
