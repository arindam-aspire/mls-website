import type { LoggedInUser } from "../types/user.types";
import { getCachedProfilePictureSrc } from "@/src/lib/profilePictureCache";
import {
  isUsableNextImageSrc,
  resolveDisplayableImageSrc,
} from "@/src/lib/shouldUnoptimizeImageSrc";

type ProfilePictureApiFields = {
  profile_picture_url?: unknown;
  profile_picture_signed_url?: unknown;
  profile_picture_read_url?: unknown;
  signed_read_url?: unknown;
  avatar_url?: unknown;
};

function coerceImageUrl(value: unknown): string | null {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return coerceImageUrl(
      record.signed_read_url ??
        record.signed_url ??
        record.url ??
        record.file_url,
    );
  }
  return null;
}

function isUnsignedS3Url(src: string): boolean {
  try {
    const { hostname, search } = new URL(src);
    const isS3Host =
      hostname.includes("amazonaws.com") &&
      (hostname.includes(".s3.") || hostname.endsWith(".s3.amazonaws.com"));
    const isPresigned =
      search.includes("X-Amz-Signature") ||
      search.includes("Signature=") ||
      search.includes("AWSAccessKeyId=");
    return isS3Host && !isPresigned;
  } catch {
    return false;
  }
}

function pickApiProfilePictureUrl(data: ProfilePictureApiFields): string | null {
  return resolveDisplayableImageSrc(
    coerceImageUrl(data.profile_picture_signed_url),
    coerceImageUrl(data.profile_picture_read_url),
    coerceImageUrl(data.signed_read_url),
    coerceImageUrl(data.avatar_url),
    coerceImageUrl(data.profile_picture_url),
  );
}

export async function withDisplayableProfilePicture(
  user: LoggedInUser,
): Promise<LoggedInUser> {
  const apiFields = user as LoggedInUser & ProfilePictureApiFields;
  const apiUrl = pickApiProfilePictureUrl(apiFields);
  const storedUrl = coerceImageUrl(apiFields.profile_picture_url);
  const prefersApiUrl = Boolean(apiUrl) && !isUnsignedS3Url(apiUrl ?? "");

  if (prefersApiUrl && isUsableNextImageSrc(apiUrl)) {
    return { ...user, profile_picture_url: apiUrl };
  }

  const cachedSrc = user.id
    ? await getCachedProfilePictureSrc(user.id)
    : null;
  const displaySrc = resolveDisplayableImageSrc(cachedSrc, apiUrl, storedUrl);

  return {
    ...user,
    profile_picture_url: displaySrc,
  };
}
