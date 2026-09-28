/**
 * Invitation email copy sent with `POST /agency/invitations`.
 * The backend owns the From address and builds absolute links.
 *
 * Placeholders: `{{agency_admin_name}}`, `[Platform Name]`.
 */
export const AGENCY_INVITATION_EMAIL = {
  subject: "You’re Invited to Join [Platform Name]",
  greeting: "Hello {{agency_admin_name}},",
  body: "You have been invited to register your agency on [Platform Name].",
  ctaLabel: "Accept Agency Invitation",
  expiry: "This invitation link will expire in 15 minutes.",
  ignore: "If you did not expect this invitation, you can safely ignore this email.",
  regards: "Regards,",
  team: "[Platform Name] Team",
} as const;
