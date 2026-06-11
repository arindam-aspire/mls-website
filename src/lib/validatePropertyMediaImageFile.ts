export const MAX_PROPERTY_MEDIA_IMAGE_BYTES = 10 * 1024 * 1024;

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

export function validatePropertyMediaImageFile(
  file: File,
  messages: PropertyMediaImageValidationMessages,
): string | null {
  if (!isAcceptedPropertyMediaImageFile(file)) {
    return messages.invalidType;
  }

  if (file.size > MAX_PROPERTY_MEDIA_IMAGE_BYTES) {
    return messages.tooLarge;
  }

  if (file.size <= 0) {
    return messages.invalidType;
  }

  return null;
}
