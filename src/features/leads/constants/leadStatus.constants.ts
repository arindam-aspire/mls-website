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

/** Admin may approve close when status is REQUEST_FOR_CLOSE. */
export const LEAD_STATUSES_ALLOWING_APPROVE_CLOSE: readonly LeadStatus[] = [
  "REQUEST_FOR_CLOSE",
];

/** Statuses an agent can set via Update Status. */
export const LEAD_AGENT_UPDATABLE_STATUSES: readonly LeadStatus[] = [
  "IN_PROGRESS",
];

/** Statuses an admin can override to (excluding CLOSED — use close endpoint). */
export const LEAD_ADMIN_OVERRIDE_STATUSES: readonly LeadStatus[] = [
  "NEW",
  "IN_PROGRESS",
  "REQUEST_FOR_CLOSE",
];

export const LEAD_STATUS_BADGE_CLASS: Record<LeadStatus, string> = {
  NEW: "border-info/30 bg-info/10 text-info",
  IN_PROGRESS: "border-primary/30 bg-primary/10 text-primary-dark",
  REQUEST_FOR_CLOSE: "border-secondary/30 bg-secondary/10 text-secondary",
  CLOSED: "border-success/30 bg-success/10 text-success",
};
