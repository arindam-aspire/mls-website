/**
 * Invitation validate often returns `fullName` equal to the invited email
 * (backend seeds `User.full_name` from email when no name was provided at invite).
 * Full Name must stay empty unless a real name is present.
 */
export function resolveInvitationFullName(
  fullName: string | null | undefined,
  email: string | null | undefined,
): string {
  const trimmedName = fullName?.trim() ?? "";
  if (!trimmedName) {
    return "";
  }

  const trimmedEmail = email?.trim().toLowerCase() ?? "";
  if (trimmedEmail && trimmedName.toLowerCase() === trimmedEmail) {
    return "";
  }

  // Backend may also seed full_name from a phone-invite placeholder email.
  if (trimmedName.includes("@")) {
    return "";
  }

  return trimmedName;
}
