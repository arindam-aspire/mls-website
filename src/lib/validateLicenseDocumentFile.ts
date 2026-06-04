export const MAX_LICENSE_DOCUMENT_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_LICENSE_DOCUMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/jpg",
] as const;

export const ACCEPTED_LICENSE_DOCUMENT_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"];

type LicenseDocumentValidationMessages = {
  invalidType: string;
  tooLarge: string;
};

export function isAcceptedLicenseDocumentFile(file: File): boolean {
  if (ACCEPTED_LICENSE_DOCUMENT_TYPES.includes(file.type as (typeof ACCEPTED_LICENSE_DOCUMENT_TYPES)[number])) {
    return true;
  }

  const lowerName = file.name.toLowerCase();
  return ACCEPTED_LICENSE_DOCUMENT_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
}

export function validateLicenseDocumentFile(
  file: File,
  messages: LicenseDocumentValidationMessages,
): string | null {
  if (!isAcceptedLicenseDocumentFile(file)) {
    return messages.invalidType;
  }

  if (file.size > MAX_LICENSE_DOCUMENT_BYTES) {
    return messages.tooLarge;
  }

  if (file.size <= 0) {
    return messages.invalidType;
  }

  return null;
}

export function resolveLicenseDocumentContentType(file: File): string {
  if (file.type) return file.type;

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
