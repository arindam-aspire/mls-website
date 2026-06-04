/**
 * Private or presigned S3 URLs cannot be fetched by the Next.js image optimizer (403).
 * Use `unoptimized` on `next/image` so the browser loads the URL directly.
 */
export function shouldUnoptimizeImageSrc(src: string): boolean {
  const trimmed = src.trim();
  if (!trimmed) return false;

  try {
    const { hostname, search } = new URL(trimmed);

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
