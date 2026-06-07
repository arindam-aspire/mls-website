import { UserRole } from "./roles";

export const PERMISSIONS = {
  PROFILE: [
    UserRole.AGENCY,
    UserRole.AGENT,
    UserRole.OWNER,
    UserRole.USER,
  ],
  DASHBOARD: [UserRole.AGENCY, UserRole.AGENT, UserRole.OWNER],
  SAVED_SEARCHES: [UserRole.AGENCY, UserRole.AGENT, UserRole.OWNER, UserRole.USER],
  FAVOURITES: [UserRole.AGENCY, UserRole.AGENT, UserRole.OWNER, UserRole.USER],
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

