# Agencies feature (`src/features/agencies/`)

Super-admin agency registry plus public invitation accept.

## Architecture

```text
agencies/
  components/  AgencyInvitationForm
  constants/   agencyInvitationEmail.constants (SES copy contract)
  hooks/       useAgencyInvitationScreen
  screens/     AgenciesScreen, AgencyInvitationScreen
  utils/       invitation create body + public-origin link rewrite
```

## Screens

| Screen | Route |
| --- | --- |
| `AgenciesScreen` | `/agencies` (super admin) |
| `AgencyInvitationScreen` | `/[locale]/agency-invitation?token=` (public email link) |

## Invitation flow

1. Admin submits invitation registration.
2. `createAgencyInvitation` sends `POST /agency/invitations` with form fields, `frontend_url` (`NEXT_PUBLIC_APP_URL` / current origin), and the invitation email copy (`AGENCY_INVITATION_EMAIL`).
3. Backend emails the invitee. CTA: **Accept Agency Invitation**, href on the public origin + `/[locale]/agency-invitation?token=`.
4. Invitee validates, uploads legal document, accepts.
5. Password setup uses `/agency-password-setup?token=`.

Expected email copy (placeholders substituted by the backend):

- Subject: You’re Invited to Join [Platform Name]
- Hello {{agency_admin_name}},
- You have been invited to register your agency on [Platform Name].
- [Accept Agency Invitation]
- This invitation link will expire in 15 minutes.
- If you did not expect this invitation, you can safely ignore this email.
- Regards, [Platform Name] Team

The frontend does not call SES or any send-email API. It must not hardcode localhost or production hosts in the invitation URL.

