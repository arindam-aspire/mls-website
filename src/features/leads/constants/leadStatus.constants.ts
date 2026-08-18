import {
  LEAD_STATUSES,
  type LeadStatus,
} from "../types/lead.types";

export const LEAD_STATUS_FILTER_VALUES = ["", ...LEAD_STATUSES] as const;

export type LeadStatusFilterValue = (typeof LEAD_STATUS_FILTER_VALUES)[number];

export function isLeadStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}

/** Agent may request close from IN_PROGRESS only. */
export const LEAD_STATUSES_ALLOWING_REQUEST_CLOSE: readonly LeadStatus[] = [
  "IN_PROGRESS",
];

/** Internal close workflow statuses visible to agency administrators only. */
export const LEAD_CLOSE_STATUS_VALUES: readonly LeadStatus[] = [
  "REQUEST_FOR_CLOSE",
  "CLOSED",
  "CLOSED_WON",
  "CLOSED_LOST",
];

export function isLeadCloseStatus(status: LeadStatus): boolean {
  return LEAD_CLOSE_STATUS_VALUES.includes(status);
}

/**
 * Choices in the Update Status modal.
 * Keep this modal focused on the four primary lifecycle states. Other statuses
 * remain supported for API display/filtering but are not transition choices.
 */
export const LEAD_UPDATABLE_STATUSES: readonly LeadStatus[] = [
  "NEW",
  "IN_PROGRESS",
  "REQUEST_FOR_CLOSE",
  "CLOSED",
];

/** @deprecated Use `LEAD_UPDATABLE_STATUSES` — kept as alias for agent update modal. */
export const LEAD_AGENT_UPDATABLE_STATUSES = LEAD_UPDATABLE_STATUSES;

/** Final outcomes that must use the admin-approved close workflow. */
export const LEAD_ADMIN_APPROVAL_STATUSES: readonly LeadStatus[] = [
  "CLOSED_WON",
  "CLOSED_LOST",
  "CLOSED",
];

/** Statuses after which ordinary lead actions are no longer available. */
export const LEAD_TERMINAL_STATUSES: readonly LeadStatus[] = [
  ...LEAD_ADMIN_APPROVAL_STATUSES,
  "CANCELLED",
  "CLOSED",
];

export const LEAD_STATUS_BADGE_CLASS: Record<LeadStatus, string> = {
  NEW: "border-info/30 bg-info/10 text-info",
  IN_PROGRESS: "border-primary/30 bg-primary/10 text-primary-dark",
  CONTACTED: "border-info/30 bg-info/10 text-info",
  QUALIFIED: "border-success/30 bg-success/10 text-success",
  FOLLOW_UP: "border-secondary/30 bg-secondary/10 text-secondary",
  MEETING_SCHEDULED: "border-primary/30 bg-primary/10 text-primary-dark",
  PROPOSAL_SENT: "border-info/30 bg-info/10 text-info",
  NEGOTIATION: "border-secondary/30 bg-secondary/10 text-secondary",
  REQUEST_FOR_CLOSE: "border-secondary/30 bg-secondary/10 text-secondary",
  CLOSED_WON: "border-success/30 bg-success/10 text-success",
  CLOSED_LOST: "border-danger/30 bg-danger/10 text-danger",
  ON_HOLD: "border-secondary/30 bg-secondary/10 text-secondary",
  CANCELLED: "border-danger/30 bg-danger/10 text-danger",
  CLOSED: "border-success/30 bg-success/10 text-success",
};
