# Agencies feature (`src/features/agencies/`)

Super-admin agency registry plus public invitation accept.

## Architecture

```text
agencies/
  components/  AgencyInvitationForm
  hooks/       useAgencyInvitationScreen
  screens/     AgenciesScreen, AgencyInvitationScreen
```

## Screens

| Screen | Route |
| --- | --- |
| `AgenciesScreen` | `/agencies` (super admin) |
| `AgencyInvitationScreen` | `/[locale]/agency-invitation?token=` (public email link) |

## Invitation flow

1. Admin `POST /agency/invitations`.
2. Backend emails `/agency-invitation?token=`.
3. Invitee validates, uploads legal document, accepts.
4. Password setup uses `/agency-password-setup?token=`.

The frontend does not call SES or any send-email API.
