import { apiClient } from "@/src/apis/clients/api.client";
import { uploadEndpoints } from "@/src/apis/endpoints/uploadEndpoints";
import type {
  UploadPresignedUrlRequest,
  UploadPresignedUrlResponse,
  UploadPresignedUrlSubmissionContext,
} from "@/src/features/property/types/upload.types";
import { resolveOwnerDocumentContentType } from "@/src/lib/resolveOwnerDocumentContentType";
import { resolveProfileImageContentType } from "@/src/features/profile/utils/validateProfileImageFile";
import { resolveUploadedFileUrl } from "@/src/lib/resolveUploadedFileUrl";
import { putFileToPresignedUrl } from "@/src/lib/upload";

type UploadContentTypeResolver = (file: File) => string;
type UploadSubmissionTarget = string | { submission_id?: string; draft_client_id?: string };

export async function requestUploadPresignedUrl(
  body: UploadPresignedUrlRequest,
): Promise<UploadPresignedUrlResponse> {
  return apiClient.request<UploadPresignedUrlResponse>({
    endpoint: uploadEndpoints.PRESIGNED_URL,
    method: "POST",
    body,
    auth: true,
  });
}

async function uploadWithPresignedUrl(
  file: File,
  presignBody: UploadPresignedUrlRequest,
): Promise<string> {
  const contentType = presignBody.content_type;
  const presignResponse = await requestUploadPresignedUrl(presignBody);

  const uploadUrl = presignResponse.data?.upload_url;

  if (!presignResponse.success || !uploadUrl) {
    throw new Error(presignResponse.message ?? "Upload presign failed");
  }

  if (!uploadUrl.startsWith("dev://")) {
    await putFileToPresignedUrl(uploadUrl, file, contentType);
  }

  return resolveUploadedFileUrl(uploadUrl, presignResponse.data?.file_url);
}

async function uploadSubmissionFile(
  file: File,
  target: UploadSubmissionTarget,
  context: UploadPresignedUrlSubmissionContext,
  resolveContentType: UploadContentTypeResolver,
): Promise<string> {
  const contentType = resolveContentType(file);
  const uploadTarget = typeof target === "string" ? { submission_id: target } : target;

  return uploadWithPresignedUrl(file, {
    ...uploadTarget,
    context,
    file_name: file.name,
    content_type: contentType,
    file_size: file.size,
  });
}

export async function uploadOwnerDocument(
  file: File,
  draftClientId: string,
): Promise<string> {
  const contentType = resolveOwnerDocumentContentType(file);

  return uploadWithPresignedUrl(file, {
    draft_client_id: draftClientId,
    context: "owner_document",
    file_name: file.name,
    content_type: contentType,
    file_size: file.size,
  });
}

export async function uploadPropertyMediaImage(
  file: File,
  target: UploadSubmissionTarget,
): Promise<string> {
  return uploadSubmissionFile(
    file,
    target,
    "property_media_image",
    resolveProfileImageContentType,
  );
}

export async function uploadPropertyDocument(
  file: File,
  target: UploadSubmissionTarget,
): Promise<string> {
  return uploadSubmissionFile(
    file,
    target,
    "property_document",
    resolveOwnerDocumentContentType,
  );
}
