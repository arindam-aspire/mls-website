/**
 * Resolve a readable file URL from a presigned upload response.
 *
 * Prefer `signed_read_url` for preview/download. Fall back to legacy `file_url`,
 * then strip query params from `upload_url` only as a last resort.
 */
export function resolveUploadedFileUrl(
  uploadUrl: string,
  options?: {
    signedReadUrl?: string | null;
    fileUrl?: string | null;
  } | string | null,
): string {
  const signedReadUrl =
    typeof options === "object" && options != null
      ? options.signedReadUrl
      : undefined;
  const fileUrl =
    typeof options === "string" || options == null
      ? options
      : options.fileUrl;

  if (signedReadUrl?.trim()) {
    return signedReadUrl.trim();
  }

  if (typeof fileUrl === "string" && fileUrl.trim()) {
    return fileUrl.trim();
  }

  try {
    const url = new URL(uploadUrl);
    url.search = "";
    return url.toString();
  } catch {
    return uploadUrl.split("?")[0] ?? uploadUrl;
  }
}
