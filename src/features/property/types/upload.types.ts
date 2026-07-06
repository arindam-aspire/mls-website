export type UploadPresignedUrlOwnerContext = "owner_document";

export type UploadPresignedUrlSubmissionContext =
  | "property_media_image"
  | "property_document";

export type UploadPresignedUrlAgencyContext = "agency_legal_document";

export type UploadPresignedUrlContext =
  | UploadPresignedUrlOwnerContext
  | UploadPresignedUrlSubmissionContext
  | UploadPresignedUrlAgencyContext;

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

export type UploadPresignedUrlRequest =
  | UploadPresignedUrlOwnerRequest
  | UploadPresignedUrlSubmissionRequest
  | UploadPresignedUrlAgencyRequest;

export type UploadPresignedUrlData = {
  upload_url: string;
  file_url?: string;
};

export type UploadPresignedUrlResponse = {
  success: boolean;
  message: string | null;
  data: UploadPresignedUrlData | null;
  error: unknown;
  meta?: Record<string, unknown>;
};
