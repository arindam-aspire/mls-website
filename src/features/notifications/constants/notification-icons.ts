import {
  BadgeCheck,
  Bell,
  BookmarkCheck,
  Building,
  CalendarClock,
  CalendarX,
  CircleDollarSign,
  CircleX,
  ClipboardCheck,
  FilePenLine,
  GitBranch,
  Handshake,
  KeyRound,
  Mail,
  Megaphone,
  MessageSquare,
  RefreshCw,
  SearchCheck,
  ShieldAlert,
  UserCheck,
  UserCog,
  UserPlus,
  UserRoundPlus,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export const notificationIcons = {
  PROPERTY_SUBMISSION: Building,
  PROPERTY_EDITED: FilePenLine,
  PROPERTY_DEACTIVATED: Building,
  PROPERTY_APPROVED: BadgeCheck,
  PROPERTY_REJECTED: CircleX,
  PROPERTY_EXPIRY: CalendarClock,
  PROPERTY_STATUS_UPDATE: RefreshCw,

  LEAD_CREATED: UserPlus,
  LEAD_ASSIGNED: UserCheck,
  LEAD_STATUS_CHANGED: GitBranch,
  LEAD_MESSAGE: MessageSquare,
  LEAD_CLOSURE_REQUEST: ClipboardCheck,
  LEAD_CLOSURE_APPROVED: BadgeCheck,
  LEAD_CLOSURE_REJECTED: CircleX,

  DEAL_CLOSURE_REQUEST: Handshake,
  DEAL_CLOSURE_APPROVED: BadgeCheck,
  DEAL_CLOSURE_REJECTED: CircleX,

  SAVED_SEARCH_CREATED: BookmarkCheck,
  SAVED_SEARCH_MATCH: SearchCheck,

  CONTACT_US_MESSAGE: Mail,

  SUBSCRIPTION_EXPIRY: CalendarClock,
  SUBSCRIPTION_EXPIRED: CalendarX,

  PAYMENT_SUCCESS: CircleDollarSign,
  PAYMENT_FAILURE: CircleX,

  AGENT_INVITATION: UserRoundPlus,

  PASSWORD_RESET: KeyRound,
  LOGIN_ALERT: ShieldAlert,
  ACCOUNT_UPDATE: UserCog,

  SYSTEM_ANNOUNCEMENT: Megaphone,
  MAINTENANCE_NOTIFICATION: Wrench,
} as const;

export type NotificationIconKey = keyof typeof notificationIcons;

export const NOTIFICATION_DEFAULT_ICON: LucideIcon = Bell;

function resolveNotificationIconKey(
  typeKey: string,
): NotificationIconKey | null {
  const normalized = typeKey.trim().replace(/\./g, "_").toUpperCase();

  if (normalized in notificationIcons) {
    return normalized as NotificationIconKey;
  }

  return null;
}

export function getNotificationIcon(
  typeKey: string,
  eventType?: string,
): LucideIcon {
  const fromTypeKey = resolveNotificationIconKey(typeKey);
  if (fromTypeKey) {
    return notificationIcons[fromTypeKey];
  }

  if (eventType) {
    const fromEventType = resolveNotificationIconKey(eventType);
    if (fromEventType) {
      return notificationIcons[fromEventType];
    }
  }

  return NOTIFICATION_DEFAULT_ICON;
}
