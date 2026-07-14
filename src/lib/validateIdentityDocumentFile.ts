export const MAX_IDENTITY_DOCUMENT_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_IDENTITY_DOCUMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
] as const;

export const ACCEPTED_IDENTITY_DOCUMENT_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

type IdentityDocumentValidationMessages = {
  invalidType: string;
  tooLarge: string;
};

export function isAcceptedIdentityDocumentFile(file: File): boolean {
  if (
    ACCEPTED_IDENTITY_DOCUMENT_TYPES.includes(
      file.type as (typeof ACCEPTED_IDENTITY_DOCUMENT_TYPES)[number],
    )
  ) {
    return true;
  }

  const lowerName = file.name.toLowerCase();
  return ACCEPTED_IDENTITY_DOCUMENT_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
}

export function validateIdentityDocumentFile(
  file: File,
  messages: IdentityDocumentValidationMessages,
): string | null {
  if (!isAcceptedIdentityDocumentFile(file)) {
    return messages.invalidType;
  }

  if (file.size > MAX_IDENTITY_DOCUMENT_BYTES) {
    return messages.tooLarge;
  }

  if (file.size <= 0) {
    return messages.invalidType;
  }

  return null;
}

export function resolveIdentityDocumentContentType(file: File): string {
  if (file.type) {
    return file.type;
  }

  const ext = file.name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return "application/pdf";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    default:
      return "application/octet-stream";
  }
}
