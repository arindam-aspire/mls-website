/**
 * Whether `src` is safe to pass to `next/image`.
 * Backend upload placeholders such as `dev://profile-pictures/...` are not
 * HTTP(S) URLs and crash Next's image loader if used as `src`.
 */
export function isUsableNextImageSrc(src: string | null | undefined): boolean {
  const trimmed = src?.trim() ?? "";
  if (!trimmed) return false;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return true;

  try {
    const { protocol } = new URL(trimmed);
    return (
      protocol === "https:" ||
      protocol === "http:" ||
      protocol === "blob:" ||
      protocol === "data:"
    );
  } catch {
    return false;
  }
}

/**
 * First candidate that `next/image` can load. Skips empty values and
 * backend placeholders such as `dev://profile-pictures/...`.
 */
export function resolveDisplayableImageSrc(
  ...candidates: Array<string | null | undefined>
): string | null {
  for (const candidate of candidates) {
    const trimmed = candidate?.trim() ?? "";
    if (isUsableNextImageSrc(trimmed)) return trimmed;
  }
  return null;
}

/**
 * Private or presigned S3 URLs cannot be fetched by the Next.js image optimizer (403).
 * Blob/data URLs also cannot be optimized. Use `unoptimized` on `next/image`
 * so the browser loads the URL directly.
 */
export function shouldUnoptimizeImageSrc(src: string): boolean {
  const trimmed = src.trim();
  if (!trimmed) return false;

  try {
    const { protocol, hostname, search } = new URL(trimmed);

    if (protocol === "blob:" || protocol === "data:") return true;

    const isS3Host =
      hostname.includes("amazonaws.com") &&
      (hostname.includes(".s3.") || hostname.endsWith(".s3.amazonaws.com"));

    const isPresigned =
      search.includes("X-Amz-Signature") ||
      search.includes("Signature=") ||
      search.includes("AWSAccessKeyId=");

    return isS3Host || isPresigned;
  } catch {
    return false;
  }
}
