# File Overview

Maps backend create/submit errors into `PropertyForm` `fieldErrors`, `stepErrors`, `submitError`, and owner-duplicate copy.

**Source:** `src/features/property/utils/propertySubmissionError.utils.ts`

# Responsibilities

- Prefer the exact API `message` (no generic “Could not submit property” as the toast title when BE sent a message).
- Replace generic Axios **Network Error** / canned transport strings with localized unreachable, timeout, or server copy. Do not overwrite a useful BE `message` / `detail` / `error.message`.
- Collect FastAPI-style `loc` / `field` / `path` validation items into field paths.
- Strip `body.` / `payload.` / `data.` prefixes so library `goToField` can focus the control.
- Detect owner-duplicate wording and set `ownerDuplicateError`.
- Identify host-owned Location DLS / `show_location` field paths so they are not passed into library `PropertyForm` `fieldErrors` (those keys would otherwise default to step 1 and block Next).

# Exports

- `PropertySubmissionUiError`
- `PropertySubmissionErrorCopy`
- `parsePropertySubmissionError(error, fallbackMessage, copy?)`
- `isHostLocationFieldPath(path)`
- `omitHostLocationFieldErrors(fieldErrors)`
- `getHostLocationFieldError(fieldErrors, fieldName)`

# Flow Description

1. Draft save or submit fails.
2. `usePropertyCreateScreen.applySubmissionError` parses the error.
3. Toast shows `parsed.message`.
4. `propertyFormRef.goToField` runs for the first **library** field path. Host DLS keys such as `hod_code` stay on the DLS selects and do not trigger `goToField`.

# Dependencies

- [usePropertyCreateScreen.md](../hooks/usePropertyCreateScreen.md)
- [error.normalizer](../../../apis/core/error.normalizer.md)
