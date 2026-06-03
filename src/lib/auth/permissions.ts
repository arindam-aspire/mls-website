import { UserRole } from "./roles";

export const PERMISSIONS = {
  PROFILE: [
    UserRole.AGENCY,
    UserRole.AGENT,
    UserRole.OWNER,
    UserRole.USER,
  ],
  DASHBOARD: [UserRole.AGENCY, UserRole.AGENT, UserRole.OWNER],
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

