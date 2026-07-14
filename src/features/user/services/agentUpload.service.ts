import { apiClient } from "@/src/apis/clients/api.client";
import { uploadEndpoints } from "@/src/apis/endpoints/uploadEndpoints";
import type { UploadPresignedUrlResponse } from "@/src/features/property/types/upload.types";
import { resolveIdentityDocumentContentType } from "@/src/lib/validateIdentityDocumentFile";
import { resolveUploadedFileUrl } from "@/src/lib/resolveUploadedFileUrl";
import { putFileToPresignedUrl } from "@/src/lib/upload";

export type AgentIdentityDocumentUploadResult = {
  /** S3 object key / file reference for onboarding submission. */
  objectKey: string;
  /** Signed URL for preview/download (not a public URL). */
  signedReadUrl: string;
};

async function requestAgentIdentityDocumentPresignedUrl(
  file: File,
  invitationToken?: string,
): Promise<UploadPresignedUrlResponse> {
  const isInvitationUpload = Boolean(invitationToken);

  return apiClient.request<UploadPresignedUrlResponse>({
    endpoint: isInvitationUpload
      ? uploadEndpoints.INVITATION_PRESIGNED_URL
      : uploadEndpoints.PRESIGNED_URL,
    method: "POST",
    auth: !isInvitationUpload,
    body: {
      context: "agent_identity_document",
      file_name: file.name,
      content_type: resolveIdentityDocumentContentType(file),
      file_size: file.size,
      ...(invitationToken ? { invitation_token: invitationToken } : {}),
    },
  });
}

/**
 * Uploads an agent identity document.
 *
 * - Invitation onboarding (unauthenticated): `POST /agents/invitations/presigned-url`
 *   with `invitation_token`.
 * - Authenticated flows (e.g. manual onboard): `POST /uploads/presigned-url` with auth.
 */
export async function uploadAgentIdentityDocument(
  file: File,
  invitationToken?: string,
): Promise<AgentIdentityDocumentUploadResult> {
  const response = await requestAgentIdentityDocumentPresignedUrl(file, invitationToken);
  const uploadUrl = response.data?.upload_url;
  const objectKey = response.data?.object_key?.trim() ?? "";
  const signedReadUrl = resolveUploadedFileUrl(uploadUrl ?? "", {
    signedReadUrl: response.data?.signed_read_url,
    fileUrl: response.data?.file_url,
  });

  if (!response.success || !uploadUrl) {
    throw new Error(response.message ?? "Identity document upload failed");
  }

  if (!uploadUrl.startsWith("dev://")) {
    await putFileToPresignedUrl(
      uploadUrl,
      file,
      resolveIdentityDocumentContentType(file),
    );
  }

  const resolvedObjectKey = objectKey || signedReadUrl;

  if (!resolvedObjectKey) {
    throw new Error(response.message ?? "Identity document upload failed");
  }

  return {
    objectKey: resolvedObjectKey,
    signedReadUrl: signedReadUrl || resolvedObjectKey,
  };
}
