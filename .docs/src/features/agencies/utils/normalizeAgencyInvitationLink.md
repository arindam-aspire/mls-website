# File Overview

Rewrites agency invitation and password-setup URLs onto the public frontend origin.

**Source:** `src/features/agencies/utils/normalizeAgencyInvitationLink.ts`

# Responsibilities

- Split comma-separated API payloads and prefer invitation / password-setup / token segments.
- Replace the API host with `getPublicAppOrigin()` (`NEXT_PUBLIC_APP_URL` or the current origin).
- Rebuild locale-prefixed routes: `/[locale]/agency-invitation?token=` and `/[locale]/agency-password-setup?token=`.
- Token may come from `token`, `invitation_token`, `invitation`, or a path segment.

# Imports

- `getPublicAppOrigin` from `src/configs/environment.config.ts`

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

Origin comes from env, not a hardcoded localhost or production URL.

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
2. Resolve origin via `getPublicAppOrigin()`. If empty, return the original string.
3. Parse the candidate URL against that origin.
4. If a token is present, rebuild the locale-prefixed invitation or password-setup path.
5. On parse failure, return the original string.

# Dependencies

- `AgenciesScreen`
- `useAgencyInvitationScreen`

# Notes

Backend invitation emails should use the same origin (`frontend_url` on create). This helper keeps the in-app copy bar consistent with that public host.
