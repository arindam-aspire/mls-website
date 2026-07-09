export const MAX_PROPERTY_MEDIA_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_PROPERTY_MEDIA_VIDEO_BYTES = 50 * 1024 * 1024;

export const ACCEPTED_PROPERTY_MEDIA_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const ACCEPTED_PROPERTY_MEDIA_IMAGE_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
];

export const ACCEPTED_PROPERTY_MEDIA_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/webm",
] as const;

export const ACCEPTED_PROPERTY_MEDIA_VIDEO_EXTENSIONS = [
  ".mp4",
  ".mov",
  ".webm",
];

type PropertyMediaImageValidationMessages = {
  invalidType: string;
  tooLarge: string;
};

export function isAcceptedPropertyMediaImageFile(file: File): boolean {
  if (
    ACCEPTED_PROPERTY_MEDIA_IMAGE_TYPES.includes(
      file.type as (typeof ACCEPTED_PROPERTY_MEDIA_IMAGE_TYPES)[number],
    )
  ) {
    return true;
  }

  const lowerName = file.name.toLowerCase();
  return ACCEPTED_PROPERTY_MEDIA_IMAGE_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
}

export function isAcceptedPropertyMediaVideoFile(file: File): boolean {
  if (
    ACCEPTED_PROPERTY_MEDIA_VIDEO_TYPES.includes(
      file.type as (typeof ACCEPTED_PROPERTY_MEDIA_VIDEO_TYPES)[number],
    )
  ) {
    return true;
  }

  const lowerName = file.name.toLowerCase();
  return ACCEPTED_PROPERTY_MEDIA_VIDEO_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
}

export function validatePropertyMediaImageFile(
  file: File,
  messages: PropertyMediaImageValidationMessages,
): string | null {
  const isAcceptedImage = isAcceptedPropertyMediaImageFile(file);
  const isAcceptedVideo = isAcceptedPropertyMediaVideoFile(file);

  if (!isAcceptedImage && !isAcceptedVideo) {
    return messages.invalidType;
  }

  if (isAcceptedImage && file.size > MAX_PROPERTY_MEDIA_IMAGE_BYTES) {
    return messages.tooLarge;
  }

  if (isAcceptedVideo && file.size > MAX_PROPERTY_MEDIA_VIDEO_BYTES) {
    return messages.tooLarge;
  }

  if (file.size <= 0) {
    return messages.invalidType;
  }

  return null;
}
