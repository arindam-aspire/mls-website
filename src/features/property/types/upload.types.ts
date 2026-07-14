export type UploadPresignedUrlOwnerContext = "owner_document";

export type UploadPresignedUrlSubmissionContext =
  | "property_media_image"
  | "property_document";

export type UploadPresignedUrlAgencyContext = "agency_legal_document";

export type UploadPresignedUrlAgentContext = "agent_identity_document";

export type UploadPresignedUrlContext =
  | UploadPresignedUrlOwnerContext
  | UploadPresignedUrlSubmissionContext
  | UploadPresignedUrlAgencyContext
  | UploadPresignedUrlAgentContext;

type UploadPresignedUrlFileFields = {
  file_name: string;
  content_type: string;
  file_size: number;
};

export type UploadPresignedUrlOwnerRequest = UploadPresignedUrlFileFields & {
  draft_client_id: string;
  context: UploadPresignedUrlOwnerContext;
};

export type UploadPresignedUrlSubmissionRequest = UploadPresignedUrlFileFields & {
  submission_id?: string;
  draft_client_id?: string;
  context: UploadPresignedUrlSubmissionContext;
};

export type UploadPresignedUrlAgencyRequest = UploadPresignedUrlFileFields & {
  context: UploadPresignedUrlAgencyContext;
};

export type UploadPresignedUrlAgentRequest = UploadPresignedUrlFileFields & {
  context: UploadPresignedUrlAgentContext;
  invitation_token?: string;
};

export type UploadPresignedUrlRequest =
  | UploadPresignedUrlOwnerRequest
  | UploadPresignedUrlSubmissionRequest
  | UploadPresignedUrlAgencyRequest
  | UploadPresignedUrlAgentRequest;

export type UploadPresignedUrlData = {
  upload_url: string;
  /** S3 object key / stable file reference for persistence. */
  object_key?: string;
  /** Time-limited signed URL for preview/download (preferred over public URLs). */
  signed_read_url?: string;
  /**
   * Legacy public/stable URL. Prefer `signed_read_url` when present.
   * Kept for backward compatibility with older API responses.
   */
  file_url?: string;
};

export type UploadPresignedUrlResponse = {
  success: boolean;
  message: string | null;
  data: UploadPresignedUrlData | null;
  error: unknown;
  meta?: Record<string, unknown>;
};
