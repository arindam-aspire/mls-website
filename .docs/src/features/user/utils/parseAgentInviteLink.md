# `parseAgentInviteLink`

**Source:** `src/features/user/utils/parseAgentInviteLink.ts`

## File Overview

Normalizes agent invitation and password-setup URLs returned by the API so copy/open actions use the current frontend origin.

**Used by:** `inviteAgentByEmail`, `resendAgentInvitation`, `manualOnboardAgent`, `validateAgentInvitation`, and `submitAgentInvitation` in `agent.service.ts`.

## Responsibilities

- Split comma-separated API payloads and prefer the segment that contains `agent-invite`, `agent-password-setup`, or `token=`.
- Rewrite the host onto `window.location.origin` so a backend-hardcoded origin such as `http://localhost:3000` is not opened in local or deployed environments.
- Keep the existing route, query string (including `token`), and hash.
- Prefix or replace the locale segment (`en` | `ar` | `es` | `fr`) from the current page path so links stay on the existing locale-prefixed FE routes.
- Leave the raw string unchanged when `window` is unavailable (SSR) or URL parsing fails.

## Imports

None (uses the browser `URL` API and `window.location`).

## Exports

| Export | Description |
| --- | --- |
| `parseAgentInviteLink(rawLink)` | Normalize one raw invitation / password-setup URL. |
| `resolveAgentInviteLinkFromPayload(data)` | Pick `invitation_url` / `invitationUrl` / `inviteLink` / `invite_link` from an invite/resend payload, then parse. |

## State Management

None.

## API Usage

Does not call APIs. Runs on URLs already returned by agent invite, resend, manual-onboard, validate, and onboarding-submit endpoints.

## Navigation

Produces links for:

- `/[locale]/agent-invite?token=…`
- `/[locale]/agent-password-setup?token=…`

Local example: `http://localhost:3000/en/agent-invite?token=…`  
Deployed example: `https://<deployed-domain>/en/agent-invite?token=…`

## Props / Parameters

| Function | Argument | Notes |
| --- | --- | --- |
| `parseAgentInviteLink` | `rawLink: string` | Absolute or relative; may be comma-separated. |
| `resolveAgentInviteLinkFromPayload` | invite/resend payload | Empty string when no URL field is present. |

## Actions / Inputs

Not a UI module. Callers copy or `window.open` the returned string.

## UI Details

Not a UI module.

## Flow Description

1. Trim the raw string; return immediately if empty.
2. If the value contains commas, choose the invite/password-setup/token segment.
3. On the client, parse with `new URL(link, window.location.origin)`.
4. Rebuild as `` `${window.location.origin}${localizedPath}${search}${hash}` ``.
5. Return the original string if parsing fails or `window` is undefined.

## Dependencies

- `src/features/user/services/agent.service.ts`
- Invite copy UI: `useInviteAgentByEmailModal`, `useResendAgentInvitationConfirm`
- Manual onboard copy UI: `useManualOnboardAgentModal`
- Public invite screen open/copy: `useAgentInviteScreen`

## Notes

- The API may return a full URL whose host is a backend env default (`http://localhost:3000`). The FE must not pass that host through to users.
- Relative paths such as `/agent-invite?token=…` still receive the current locale prefix, matching previous behavior.
