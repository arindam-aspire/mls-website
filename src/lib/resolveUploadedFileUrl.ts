/**
 * Prefer the backend `file_url`; otherwise derive a stable public URL from the presigned PUT URL.
 */
export function resolveUploadedFileUrl(
  uploadUrl: string,
  fileUrl?: string | null,
): string {
  if (fileUrl?.trim()) {
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
