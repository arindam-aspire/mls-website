/**
 * Backend SES / invitation email contract.
 * The frontend does not send this mail; it supplies `frontend_url` (`NEXT_PUBLIC_APP_URL`)
 * so the Accept Agency Invitation CTA is built on the public origin, not localhost.
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
