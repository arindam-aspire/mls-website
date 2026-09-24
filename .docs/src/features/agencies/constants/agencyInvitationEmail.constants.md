# File Overview

Agency invitation SES copy contract used when creating invitations.

**Source:** `src/features/agencies/constants/agencyInvitationEmail.constants.ts`

# Responsibilities

- Hold the invitation email subject, body lines, and CTA label the API should render.
- Keep placeholders `{{agency_admin_name}}` and `[Platform Name]` for backend substitution.
- Avoid embedding any host (localhost or production) in the copy.

# Imports

None.

# Exports

| Export | Description |
| --- | --- |
| `AGENCY_INVITATION_EMAIL` | Subject, greeting, body, CTA, expiry, ignore, regards, team sign-off |

# State Management

None.

# API Usage

Consumed by `buildAgencyInvitationCreateBody` and sent on `POST /agency/invitations` as `email_*` fields plus `frontend_url`.

# Navigation

CTA href is not stored here. The backend concatenates `frontend_url` + locale path + `token`.

# Props / Parameters

N/A.

# Actions / Inputs

N/A.

# UI Details

Not rendered in the app UI.

# Flow Description

1. Super admin submits invitation registration.
2. Create-body helper copies these strings onto the request.
3. Backend sends SES mail with the Accept Agency Invitation button pointing at the public origin.

# Dependencies

- `src/features/agencies/utils/buildAgencyInvitationCreateBody.ts`

# Notes

The frontend does not call SES. This file exists so FE and BE share the same invitation copy.
