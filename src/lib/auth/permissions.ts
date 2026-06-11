import { UserRole } from "./roles";

export const PERMISSIONS = {
  PROFILE: [
    UserRole.AGENCY,
    UserRole.AGENT,
    UserRole.OWNER,
    UserRole.USER,
  ],
  DASHBOARD: [UserRole.AGENCY, UserRole.AGENT, UserRole.OWNER],
  MY_LISTINGS: [UserRole.OWNER],
  MANAGE_LISTINGS: [UserRole.AGENCY, UserRole.AGENT],
  DRAFT_LISTINGS: [UserRole.OWNER, UserRole.AGENT],
  /** Sidebar nav only — agents see Draft Listings in the protected sidebar. */
  DRAFT_LISTINGS_SIDEBAR: [UserRole.AGENT],
  PROPERTY_CREATE: [UserRole.OWNER, UserRole.AGENT],
  SAVED_SEARCHES: [UserRole.AGENCY, UserRole.AGENT, UserRole.OWNER, UserRole.USER],
  FAVOURITES: [UserRole.AGENCY, UserRole.AGENT, UserRole.OWNER, UserRole.USER],
  NOTIFICATIONS: [UserRole.AGENCY, UserRole.AGENT, UserRole.OWNER, UserRole.USER],
  RECENTLY_VIEWED: [UserRole.OWNER, UserRole.USER],
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

