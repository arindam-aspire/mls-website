const MAX_PROFILE_IMAGE_BYTES = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

type ProfileImageValidationMessages = {
  invalidType: string;
  tooLarge: string;
};

export function validateProfileImageFile(
  file: File,
  messages: ProfileImageValidationMessages,
): string | null {
  const contentType = file.type.trim().toLowerCase();
  if (contentType && !ALLOWED_IMAGE_TYPES.has(contentType)) {
    return messages.invalidType;
  }

  if (!contentType) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowedExt = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
    if (!ext || !allowedExt.has(ext)) {
      return messages.invalidType;
    }
  }

  if (file.size > MAX_PROFILE_IMAGE_BYTES) {
    return messages.tooLarge;
  }

  if (file.size <= 0) {
    return messages.invalidType;
  }

  return null;
}

export function resolveProfileImageContentType(file: File): string {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}
