export const uploadEndpoints = {
  PRESIGNED_URL: "/uploads/presigned-url",
  /** Unauthenticated invitation onboarding upload (requires `token`). */
  INVITATION_DOCUMENT_UPLOAD: "/agents/invitations/document-upload",
} as const;
