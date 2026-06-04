export function licenseDocumentDisplayName(
  link: string | null | undefined,
  notProvided: string,
): string | null {
  const trimmed = link?.trim();
  if (!trimmed) return null;

  try {
    const name = new URL(trimmed).pathname.split("/").filter(Boolean).pop();
    return name?.trim() || notProvided;
  } catch {
    const name = trimmed.split("/").filter(Boolean).pop();
    return name?.trim() || notProvided;
  }
}
