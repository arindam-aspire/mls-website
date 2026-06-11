export const MAX_OWNER_DOCUMENT_BYTES = 10 * 1024 * 1024;

export const ACCEPTED_OWNER_DOCUMENT_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const ACCEPTED_OWNER_DOCUMENT_EXTENSIONS = [".pdf", ".doc", ".docx"];

type OwnerDocumentValidationMessages = {
  invalidType: string;
  tooLarge: string;
};

export function isAcceptedOwnerDocumentFile(file: File): boolean {
  if (
    ACCEPTED_OWNER_DOCUMENT_TYPES.includes(
      file.type as (typeof ACCEPTED_OWNER_DOCUMENT_TYPES)[number],
    )
  ) {
    return true;
  }

  const lowerName = file.name.toLowerCase();
  return ACCEPTED_OWNER_DOCUMENT_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
}

export function validateOwnerDocumentFile(
  file: File,
  messages: OwnerDocumentValidationMessages,
): string | null {
  if (!isAcceptedOwnerDocumentFile(file)) {
    return messages.invalidType;
  }

  if (file.size > MAX_OWNER_DOCUMENT_BYTES) {
    return messages.tooLarge;
  }

  if (file.size <= 0) {
    return messages.invalidType;
  }

  return null;
}
