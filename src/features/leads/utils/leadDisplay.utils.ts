import type { Lead, LeadActivityItem, LeadStatus } from "../types/lead.types";
import { isLeadStatus } from "../constants/leadStatus.constants";

export function resolveLeadStatus(status: string | null | undefined): LeadStatus | null {
  if (!status) return null;
  return isLeadStatus(status) ? status : null;
}

export function resolveLeadPropertyTitle(lead: Lead): string {
  if (lead.external_property_name?.trim()) {
    return lead.external_property_name.trim();
  }

  const property = lead.property;
  if (property && typeof property === "object") {
    const title =
      (property.title as string | undefined) ??
      (property.name as string | undefined) ??
      (property.property_title as string | undefined);
    if (title?.trim()) return title.trim();
  }

  if (lead.property_id) {
    return lead.property_id;
  }

  return "—";
}

export function resolveLeadCustomerName(lead: Lead): string {
  return lead.contact_name?.trim() || lead.contact_email?.trim() || "—";
}

export function resolveAssignedAgentLabel(lead: Lead): string {
  if (lead.assigned_agent_name?.trim()) {
    return lead.assigned_agent_name.trim();
  }
  if (lead.assigned_agent_id) {
    return lead.assigned_agent_id;
  }
  return "—";
}

/**
 * Builds a synthetic timeline from lead detail timestamps until
 * GET /leads/{id}/activity is available.
 */
export function buildLeadTimelineFromLead(lead: Lead): LeadActivityItem[] {
  const items: LeadActivityItem[] = [];

  if (lead.created_at) {
    items.push({
      id: `${lead.id}-created`,
      type: "LEAD_CREATED",
      title: "created",
      description: lead.lead_number,
      created_at: lead.created_at,
    });
  }

  if (lead.assigned_agent_id && lead.updated_at) {
    items.push({
      id: `${lead.id}-assigned`,
      type: "LEAD_ASSIGNED",
      title: "assigned",
      description: lead.assigned_agent_id,
      created_at: lead.last_activity_at ?? lead.updated_at,
    });
  }

  if (lead.request_close_at) {
    items.push({
      id: `${lead.id}-request-close`,
      type: "LEAD_CLOSURE_REQUEST",
      title: "requestClose",
      created_at: lead.request_close_at,
    });
  }

  if (lead.closed_at) {
    items.push({
      id: `${lead.id}-closed`,
      type: "LEAD_CLOSED",
      title: "closed",
      created_at: lead.closed_at,
    });
  }

  if (lead.last_activity_at) {
    items.push({
      id: `${lead.id}-activity`,
      type: "LEAD_ACTIVITY",
      title: "lastActivity",
      created_at: lead.last_activity_at,
    });
  }

  return items.sort((a, b) => {
    const aTime = a.created_at ? Date.parse(a.created_at) : 0;
    const bTime = b.created_at ? Date.parse(b.created_at) : 0;
    return bTime - aTime;
  });
}

export function formatLeadDate(
  value: string | null | undefined,
  locale: string,
): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
