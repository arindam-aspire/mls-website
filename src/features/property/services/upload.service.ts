import { apiClient } from "@/src/apis/clients/api.client";
import { uploadEndpoints } from "@/src/apis/endpoints/uploadEndpoints";
import type {
  UploadPresignedUrlRequest,
  UploadPresignedUrlResponse,
  UploadPresignedUrlSubmissionContext,
} from "@/src/features/property/types/upload.types";
import { resolveOwnerDocumentContentType } from "@/src/lib/resolveOwnerDocumentContentType";
import { resolvePropertyMediaContentType } from "@/src/lib/validatePropertyMediaImageFile";
import {
  isBrowserDisplayableFileUrl,
  rememberPersistedUploadReference,
  resolvePersistedUploadReference,
  resolveUploadedFileUrl,
} from "@/src/lib/resolveUploadedFileUrl";
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
  persistReference = false,
): Promise<string> {
  const contentType = presignBody.content_type;
  const presignResponse = await requestUploadPresignedUrl(presignBody);

  const uploadUrl = presignResponse.data?.upload_url;

  if (!presignResponse.success || !uploadUrl) {
    throw new Error(presignResponse.message?.trim() || "");
  }

  if (!uploadUrl.startsWith("dev://")) {
    await putFileToPresignedUrl(
      uploadUrl,
      file,
      contentType,
      undefined,
      presignResponse.data?.upload_http_method === "POST" ? "POST" : "PUT",
    );
  }

  const displayUrl = resolveUploadedFileUrl(uploadUrl, {
    signedReadUrl: presignResponse.data?.signed_read_url,
    fileUrl: presignResponse.data?.file_url,
  });

  if (!persistReference) {
    return displayUrl;
  }

  const persistRef = resolvePersistedUploadReference({
    file_url: presignResponse.data?.file_url,
    object_key: presignResponse.data?.object_key,
    upload_url: uploadUrl,
  });

  // Form `uri` must be loadable in Review & Submit (`<img src={uri}>`).
  // Keep the stable key for draft/submit via rememberPersistedUploadReference.
  const formUri = isBrowserDisplayableFileUrl(displayUrl) ? displayUrl : persistRef;
  rememberPersistedUploadReference(formUri, persistRef);
  return formUri;
}

async function uploadSubmissionFile(
  file: File,
  target: UploadSubmissionTarget,
  context: UploadPresignedUrlSubmissionContext,
  resolveContentType: UploadContentTypeResolver,
): Promise<string> {
  const contentType = resolveContentType(file);
  const uploadTarget = typeof target === "string" ? { submission_id: target } : target;

  return uploadWithPresignedUrl(
    file,
    {
      ...uploadTarget,
      context,
      file_name: file.name,
      content_type: contentType,
      file_size: file.size,
    },
    true,
  );
}

export async function uploadOwnerDocument(
  file: File,
  draftClientId: string,
): Promise<string> {
  const contentType = resolveOwnerDocumentContentType(file);

  // Form URI is a signed preview when available; drafts persist file_url/object_key.
  return uploadWithPresignedUrl(
    file,
    {
      draft_client_id: draftClientId,
      context: "owner_document",
      file_name: file.name,
      content_type: contentType,
      file_size: file.size,
    },
    true,
  );
}

export async function uploadPropertyMediaImage(
  file: File,
  target: UploadSubmissionTarget,
): Promise<string> {
  return uploadSubmissionFile(
    file,
    target,
    "property_media_image",
    resolvePropertyMediaContentType,
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
