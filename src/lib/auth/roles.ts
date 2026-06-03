/**
 * App role keys map to backend/API role names.
 * agency → admin, agent → agent, owner → owner, user → registered_user
 */
export enum UserRole {
  AGENCY = "admin",
  AGENT = "agent",
  OWNER = "owner",
  USER = "registered_user",
}

export const DEFAULT_AUTH_ROLE = UserRole.USER;
