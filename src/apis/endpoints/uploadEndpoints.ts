export const uploadEndpoints = {
  PRESIGNED_URL: "/uploads/presigned-url",
  /** Unauthenticated invitation onboarding upload (requires `invitation_token`). */
  INVITATION_PRESIGNED_URL: "/agents/invitations/presigned-url",
} as const;
