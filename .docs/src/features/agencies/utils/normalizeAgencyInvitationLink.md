# File Overview

Keeps the backend's absolute agency invitation and password-setup URLs.

**Source:** `src/features/agencies/utils/normalizeAgencyInvitationLink.ts`

# Responsibilities

- Split comma-separated API payloads and prefer invitation / password-setup / token segments.
- Keep the URL origin from the API. Do not replace it with the browser origin or localhost.
- Normalize the path to `/agency-invitation` or `/agency-password-setup` and keep `token` in the query string.
- Preserve a leading locale segment when the API URL already has one.

# Imports

None. The helper only parses the absolute URL the API returned.

# Exports

| Export | Description |
| --- | --- |
| `normalizeAgencyInvitationLink(link)` | Invitation or password-setup URL for copy/open |
| `rewriteAgencyPasswordSetupLink(link)` | Password-setup URL or `null` when empty |

# State Management

None.

# API Usage

Does not call APIs. Runs on URLs already returned by invitation / review / password-link / accept endpoints.

# Navigation

Produces:

- `/[locale]/agency-invitation?token=…`
- `/[locale]/agency-password-setup?token=…`

Origin comes from the API URL. The helper does not build a localhost link.

# Props / Parameters

| Function | Argument | Notes |
| --- | --- | --- |
| `normalizeAgencyInvitationLink` | `rawLink: string` | Absolute or relative; may be comma-separated |
| `rewriteAgencyPasswordSetupLink` | nullable string | Returns `null` when blank |

# Actions / Inputs

Not a UI module. Callers copy or `window.open` the returned string.

# UI Details

N/A.

# Flow Description

1. Trim; return empty strings unchanged.
2. Prefer the comma-separated segment that contains the invitation path or `token`.
3. Parse it as an absolute URL and keep that origin.
4. If a token is present, keep `/agency-invitation` or `/agency-password-setup` and `?token=`.
5. On parse failure, return the original string.

# Dependencies

- `AgenciesScreen`
- `useAgencyInvitationScreen`

# Notes

Backend invitation links are already absolute. This helper does not replace the host with localhost or `NEXT_PUBLIC_APP_URL`.
