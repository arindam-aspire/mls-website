import { getPublicAppOrigin } from "@/src/configs/environment.config";
import { AGENCY_INVITATION_EMAIL } from "@/src/features/agencies/constants/agencyInvitationEmail.constants";
import type { AgencyInvitationCreateRequest } from "@/src/features/profile/types/profile.types";

/**
 * Adds the public frontend origin and invitation email copy so the API can
 * build the SES message without a hardcoded localhost host.
 */
export function buildAgencyInvitationCreateBody(
  body: AgencyInvitationCreateRequest,
): AgencyInvitationCreateRequest {
  const frontendUrl = getPublicAppOrigin();

  return {
    ...body,
    ...(frontendUrl ? { frontend_url: frontendUrl } : {}),
    email_subject: AGENCY_INVITATION_EMAIL.subject,
    email_greeting: AGENCY_INVITATION_EMAIL.greeting,
    email_body: AGENCY_INVITATION_EMAIL.body,
    email_cta_label: AGENCY_INVITATION_EMAIL.ctaLabel,
    email_expiry_notice: AGENCY_INVITATION_EMAIL.expiry,
    email_ignore_notice: AGENCY_INVITATION_EMAIL.ignore,
    email_regards: AGENCY_INVITATION_EMAIL.regards,
    email_sign_off: AGENCY_INVITATION_EMAIL.team,
  };
}
