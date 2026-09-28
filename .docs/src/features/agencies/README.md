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
2. Upload the licence with `POST /uploads/presigned-url` (`context: agency_legal_document`), PUT the bytes, then `createAgencyInvitation` sends JSON `POST /agency/invitations` with `email`, names, E.164 `phone`, `legal_document_s3_link` (`data.file_url`), and invitation email copy. The backend owns the From address and the absolute link.
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

