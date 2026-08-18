import type { PropertyDetails } from "@/src/features/property/types/property.types";
import type {
  Lead,
  LeadActivityDisplay,
  LeadActivityItem,
  LeadAssignedAgentSnapshot,
  LeadConversationMessageDisplay,
  LeadConversationMessageVariant,
  LeadMessage,
  LeadNote,
  LeadNoteDisplay,
  LeadStatus,
} from "../types/lead.types";
import {
  isLeadCloseStatus,
  isLeadStatus,
} from "../constants/leadStatus.constants";

type LocalizedLike =
  | string
  | Record<string, string | null | undefined>
  | null
  | undefined;

function readTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function resolveLocalizedText(value: LocalizedLike, locale: string): string {
  if (!value) return "";
  if (typeof value === "string") return value.trim();

  return (
    value[locale]?.trim() ||
    value.en?.trim() ||
    value.ar?.trim() ||
    value.esp?.trim() ||
    value.fr?.trim() ||
    Object.values(value).find((entry) => entry?.trim())?.trim() ||
    ""
  );
}

function readAddressFromRecord(
  record: Record<string, unknown>,
  locale: string,
): string {
  const directAddress =
    readTrimmedString(record.address) ||
    readTrimmedString(record.property_address) ||
    readTrimmedString(record.location_address);

  if (directAddress) {
    return directAddress;
  }

  const localizedAddress = resolveLocalizedText(
    record.address as LocalizedLike,
    locale,
  );
  if (localizedAddress) {
    return localizedAddress;
  }

  const location = record.location;
  if (location && typeof location === "object") {
    const locationRecord = location as Record<string, unknown>;
    const nestedAddress =
      resolveLocalizedText(locationRecord.address as LocalizedLike, locale) ||
      readTrimmedString(locationRecord.address);

    if (nestedAddress) {
      return nestedAddress;
    }

    const locationParts = [
      readTrimmedString(locationRecord.region),
      readTrimmedString(locationRecord.city),
      readTrimmedString(locationRecord.country),
    ].filter(Boolean);

    if (locationParts.length > 0) {
      return locationParts.join(", ");
    }
  }

  return "";
}

function normalizeComparableId(value: unknown): string {
  if (value == null || value === "") {
    return "";
  }

  return String(value).trim();
}

function readAssignedAgentNameFromSnapshot(
  assignedAgent: unknown,
): string {
  if (!assignedAgent || typeof assignedAgent !== "object") {
    return "";
  }

  const snapshot = assignedAgent as LeadAssignedAgentSnapshot &
    Record<string, unknown>;
  const directName =
    snapshot.fullName?.trim() ||
    snapshot.full_name?.trim() ||
    snapshot.name?.trim() ||
    readTrimmedString(snapshot.display_name) ||
    readTrimmedString(snapshot.agent_name);

  if (directName) {
    return directName;
  }

  return (
    readAssignedAgentNameFromSnapshot(snapshot.user) ||
    readAssignedAgentNameFromSnapshot(snapshot.agent) ||
    ""
  );
}

export function resolvePropertySnapshotAgentName(lead: Lead): string | null {
  if (!lead.property || typeof lead.property !== "object") {
    return null;
  }

  const property = lead.property as Record<string, unknown>;
  const fromAgentObject = readAssignedAgentNameFromSnapshot(property.agent);
  if (fromAgentObject) {
    return fromAgentObject;
  }

  const fromFlatFields =
    readTrimmedString(property.agent_name) ||
    readTrimmedString(property.assigned_agent_name);

  return fromFlatFields || null;
}

export function resolvePropertySnapshotAgentIds(lead: Lead): string[] {
  if (!lead.property || typeof lead.property !== "object") {
    return [];
  }

  const property = lead.property as Record<string, unknown>;
  const ids = [
    property.agent_user_id,
    property.assigned_agent_id,
    property.agent_id,
  ];

  if (property.agent && typeof property.agent === "object") {
    const agent = property.agent as Record<string, unknown>;
    ids.push(agent.id, agent.user_id, agent.agent_user_id);
  }

  return [...new Set(ids.map(normalizeComparableId).filter(Boolean))];
}

export function normalizeLeadFromApi(lead: Lead): Lead {
  const record = lead as Lead & Record<string, unknown>;
  const assignedAgentName =
    lead.assigned_agent_name?.trim() ||
    readAssignedAgentNameFromSnapshot(lead.assigned_agent) ||
    readAssignedAgentNameFromSnapshot(record.assignedAgent) ||
    readTrimmedString(record.assignee_name) ||
    readTrimmedString(record.agent_name) ||
    resolvePropertySnapshotAgentName(lead) ||
    "";
  const resolvedStatus = resolveLeadStatus(lead.status);

  return {
    ...lead,
    ...(resolvedStatus ? { status: resolvedStatus } : {}),
    ...(assignedAgentName ? { assigned_agent_name: assignedAgentName } : {}),
  };
}

export function resolvePropertyAgentDisplayName(
  propertyDetails?: PropertyDetails | null,
): string | null {
  if (!propertyDetails) {
    return null;
  }

  return (
    propertyDetails.agent?.name?.trim() ||
    propertyDetails.agent_name?.trim() ||
    null
  );
}

export function resolvePropertyAgentComparableIds(
  propertyDetails?: PropertyDetails | null,
): string[] {
  if (!propertyDetails) {
    return [];
  }

  return [
    propertyDetails.agent_user_id,
    propertyDetails.assigned_agent_id,
    propertyDetails.agent?.id,
  ]
    .map(normalizeComparableId)
    .filter(Boolean);
}

function propertyAgentMatchesAssignedLead(
  assignedAgentId: string,
  propertyAgentIds: string[],
): boolean {
  return propertyAgentIds.includes(assignedAgentId);
}

/** Normalizes API status strings (`in progress`, `in-progress`) to enum keys. */
export function normalizeLeadStatusKey(
  status: string | null | undefined,
): string {
  if (!status?.trim()) {
    return "";
  }

  return status.trim().replace(/[\s-]+/g, "_").toUpperCase();
}

export function resolveLeadStatus(status: string | null | undefined): LeadStatus | null {
  const normalized = normalizeLeadStatusKey(status);
  if (!normalized) {
    return null;
  }

  return isLeadStatus(normalized) ? normalized : null;
}

export function resolveLeadAssigneeComparableIds(
  lead: Lead,
  propertyDetails?: PropertyDetails | null,
): string[] {
  const ids = [
    lead.assigned_agent_id,
    lead.assigned_agent?.id,
    ...resolvePropertySnapshotAgentIds(lead),
    ...(propertyDetails ? resolvePropertyAgentComparableIds(propertyDetails) : []),
  ];

  return [...new Set(ids.map(normalizeComparableId).filter(Boolean))];
}

/** Matches auth user id against lead assignment and related property agent ids. */
export function isLeadAssignedToCurrentUser(
  lead: Lead | null | undefined,
  userId: string | null | undefined,
  propertyDetails?: PropertyDetails | null,
): boolean {
  const normalizedUserId = normalizeComparableId(userId);
  if (!normalizedUserId || !lead?.assigned_agent_id?.trim()) {
    return false;
  }

  return resolveLeadAssigneeComparableIds(lead, propertyDetails).includes(
    normalizedUserId,
  );
}

const CLOSE_ACTIVITY_TYPES = new Set([
  "LEAD_CLOSURE_REQUEST",
  "REQUEST_FOR_CLOSE",
  "LEAD_CLOSED",
]);

/** Masks internal close statuses for agents while preserving workflow state. */
export function resolveLeadStatusForViewer(
  status: string | null | undefined,
  canViewCloseStatus: boolean,
): LeadStatus | null {
  const resolved = resolveLeadStatus(status);

  if (!resolved) {
    return null;
  }

  if (!canViewCloseStatus && isLeadCloseStatus(resolved)) {
    return "IN_PROGRESS";
  }

  return resolved;
}

export function filterLeadActivityItemsForViewer(
  items: LeadActivityItem[],
  canViewCloseStatus: boolean,
): LeadActivityItem[] {
  if (canViewCloseStatus) {
    return items;
  }

  return items.filter((item) => {
    const type = readTrimmedString(item.type).toUpperCase();
    return !CLOSE_ACTIVITY_TYPES.has(type);
  });
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

export function resolveLeadPropertyAddress(
  lead: Lead,
  locale: string,
  propertyDetails?: PropertyDetails | null,
): string {
  if (lead.property && typeof lead.property === "object") {
    const fromSnapshot = readAddressFromRecord(lead.property, locale);
    if (fromSnapshot) {
      return fromSnapshot;
    }
  }

  if (propertyDetails) {
    const fromDetails = readAddressFromRecord(
      propertyDetails as unknown as Record<string, unknown>,
      locale,
    );
    if (fromDetails) {
      return fromDetails;
    }
  }

  return "";
}

export function resolveLeadCustomerName(lead: Lead): string {
  return lead.contact_name?.trim() || lead.contact_email?.trim() || "—";
}

type ResolveAssignedAgentLabelOptions = {
  propertyAgentName?: string | null;
  propertyAgentIds?: string[];
  cachedAgentName?: string | null;
  currentUserName?: string | null;
};

export function resolveAssignedAgentLabel(
  lead: Lead,
  options: ResolveAssignedAgentLabelOptions = {},
): string {
  const normalizedLead = normalizeLeadFromApi(lead);

  if (normalizedLead.assigned_agent_name?.trim()) {
    return normalizedLead.assigned_agent_name.trim();
  }

  const snapshotName = readAssignedAgentNameFromSnapshot(
    normalizedLead.assigned_agent,
  );
  if (snapshotName) {
    return snapshotName;
  }

  const assignedAgentId = normalizedLead.assigned_agent_id?.trim();
  const propertyAgentName =
    options.propertyAgentName?.trim() ||
    resolvePropertySnapshotAgentName(normalizedLead) ||
    null;
  const propertyAgentIds = [
    ...new Set([
      ...(options.propertyAgentIds ?? []),
      ...resolvePropertySnapshotAgentIds(normalizedLead),
    ]),
  ];

  if (
    assignedAgentId &&
    propertyAgentName &&
    propertyAgentMatchesAssignedLead(assignedAgentId, propertyAgentIds)
  ) {
    return propertyAgentName;
  }

  if (options.cachedAgentName?.trim()) {
    return options.cachedAgentName.trim();
  }

  if (
    assignedAgentId &&
    options.currentUserName?.trim()
  ) {
    return options.currentUserName.trim();
  }

  if (assignedAgentId && propertyAgentName) {
    return propertyAgentName;
  }

  if (assignedAgentId) {
    return "";
  }

  return "—";
}

export function hasAssignedLeadAgent(lead: Lead): boolean {
  return Boolean(lead.assigned_agent_id?.trim());
}

/**
 * Builds a synthetic timeline from lead detail timestamps until
 * GET /leads/{id}/activity is available.
 */
export function buildLeadTimelineFromLead(
  lead: Lead,
  options?: {
    assignedAgentName?: string | null;
  },
): LeadActivityItem[] {
  const items: LeadActivityItem[] = [];
  const assignedAgentName =
    options?.assignedAgentName?.trim() ||
    resolveAssignedAgentLabel(lead) ||
    null;

  if (lead.created_at) {
    items.push({
      id: `${lead.id}-created`,
      type: "LEAD_CREATED",
      title: "created",
      description: lead.lead_number,
      created_at: lead.created_at,
    });
  }

  if (lead.assigned_agent_id) {
    items.push({
      id: `${lead.id}-assigned`,
      type: "LEAD_ASSIGNED",
      title: "assigned",
      description: assignedAgentName || undefined,
      actor_name: assignedAgentName,
      created_at: lead.last_activity_at ?? lead.updated_at ?? lead.created_at,
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

const LEAD_ACTIVITY_TITLE_KEYS = [
  "created",
  "assigned",
  "requestClose",
  "closed",
  "lastActivity",
] as const;

type LeadActivityTitleKey = (typeof LEAD_ACTIVITY_TITLE_KEYS)[number];

function isLeadActivityTitleKey(value: string): value is LeadActivityTitleKey {
  return (LEAD_ACTIVITY_TITLE_KEYS as readonly string[]).includes(value);
}

function resolveActivityTitleKeyFromType(
  type: string,
): LeadActivityTitleKey | null {
  switch (type) {
    case "LEAD_CREATED":
      return "created";
    case "LEAD_ASSIGNED":
      return "assigned";
    case "LEAD_CLOSURE_REQUEST":
    case "REQUEST_FOR_CLOSE":
      return "requestClose";
    case "LEAD_CLOSED":
      return "closed";
    case "LEAD_ACTIVITY":
      return "lastActivity";
    default:
      return null;
  }
}

export type LeadActivityDisplayLabels = {
  createdDescription: (params: {
    leadNumber: string;
    source: string;
  }) => string;
  assignedDescription: (params: { agentName: string }) => string;
  assignedDescriptionUnknown: string;
  requestCloseDescription: string;
  closedDescription: string;
  lastActivityDescription: string;
  typeCreated: string;
  typeAssigned: string;
  typeRequestClose: string;
  typeClosed: string;
  typeActivity: string;
  typeGeneric: string;
  resolveTitle: (key: LeadActivityTitleKey) => string;
};

function resolveActivityTypeLabel(
  type: string,
  labels: LeadActivityDisplayLabels,
): string {
  switch (type.trim().toUpperCase()) {
    case "LEAD_CREATED":
      return labels.typeCreated;
    case "LEAD_ASSIGNED":
      return labels.typeAssigned;
    case "LEAD_CLOSURE_REQUEST":
    case "REQUEST_FOR_CLOSE":
      return labels.typeRequestClose;
    case "LEAD_CLOSED":
      return labels.typeClosed;
    case "LEAD_ACTIVITY":
      return labels.typeActivity;
    default:
      return labels.typeGeneric;
  }
}

function resolveActivityDescription(
  item: LeadActivityItem,
  labels: LeadActivityDisplayLabels,
  context: {
    leadNumber: string;
    sourceLabel: string;
  },
): string | null {
  const fromApi = readTrimmedString(item.description);
  const type = readTrimmedString(item.type).toUpperCase();
  const isSynthetic = isLeadActivityTitleKey(readTrimmedString(item.title));

  if (fromApi && !isSynthetic) {
    return fromApi;
  }

  switch (type) {
    case "LEAD_CREATED":
      return labels.createdDescription({
        leadNumber: fromApi || context.leadNumber,
        source: context.sourceLabel,
      });
    case "LEAD_ASSIGNED":
      if (fromApi) {
        return labels.assignedDescription({ agentName: fromApi });
      }
      return labels.assignedDescriptionUnknown;
    case "LEAD_CLOSURE_REQUEST":
    case "REQUEST_FOR_CLOSE":
      return labels.requestCloseDescription;
    case "LEAD_CLOSED":
      return labels.closedDescription;
    case "LEAD_ACTIVITY":
      return labels.lastActivityDescription;
    default:
      return fromApi || null;
  }
}

export function mapLeadActivityToDisplay(params: {
  items: LeadActivityItem[];
  locale: string;
  leadNumber: string;
  sourceLabel: string;
  labels: LeadActivityDisplayLabels;
}): LeadActivityDisplay[] {
  const { items, locale, leadNumber, sourceLabel, labels } = params;

  return items.map((item, index) => {
    const record = item as LeadActivityItem & Record<string, unknown>;
    const type = readTrimmedString(item.type).toUpperCase();
    const rawTitle =
      readTrimmedString(item.title) ||
      readTrimmedString(record.event_title) ||
      readTrimmedString(record.action);
    const titleKey = isLeadActivityTitleKey(rawTitle)
      ? rawTitle
      : resolveActivityTitleKeyFromType(type);
    const title = titleKey
      ? labels.resolveTitle(titleKey)
      : rawTitle || labels.typeGeneric;
    const createdAt =
      readTrimmedString(item.created_at) ||
      readTrimmedString(record.createdAt) ||
      readTrimmedString(record.timestamp) ||
      null;
    const actorName =
      readTrimmedString(item.actor_name) ||
      readTrimmedString(record.actorName) ||
      readTrimmedString(record.created_by_name) ||
      null;

    return {
      id:
        readTrimmedString(item.id) ||
        `${type || "activity"}-${createdAt || index}`,
      type,
      typeLabel: resolveActivityTypeLabel(type, labels),
      title,
      description: resolveActivityDescription(item, labels, {
        leadNumber: leadNumber || "—",
        sourceLabel: sourceLabel || "—",
      }),
      actorName,
      createdAt,
      createdAtLabel: formatLeadDate(createdAt, locale),
      createdTimeLabel: formatLeadTime(createdAt, locale),
    };
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

export function formatLeadTime(
  value: string | null | undefined,
  locale: string,
): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatLeadShortDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function normalizeLeadMessageFromApi(message: LeadMessage): LeadMessage {
  const record = message as LeadMessage & Record<string, unknown>;
  const createdByName =
    message.created_by_name?.trim() ||
    readTrimmedString(record.sender_name) ||
    readTrimmedString(record.actor_name) ||
    readAssignedAgentNameFromSnapshot(record.sender) ||
    readAssignedAgentNameFromSnapshot(record.created_by);

  if (!createdByName) {
    return message;
  }

  return {
    ...message,
    created_by_name: createdByName,
  };
}

type ResolveLeadMessageSenderOptions = {
  lead: Lead;
  assignedAgentName?: string | null;
  currentUserId?: string | null;
  currentUserName?: string | null;
  unknownSenderLabel: string;
};

export function resolveLeadMessageSenderName(
  message: LeadMessage,
  options: ResolveLeadMessageSenderOptions,
): string {
  const normalizedMessage = normalizeLeadMessageFromApi(message);

  if (normalizedMessage.created_by_name?.trim()) {
    return normalizedMessage.created_by_name.trim();
  }

  const createdById = normalizedMessage.created_by_id?.trim();
  const customerName = resolveLeadCustomerName(options.lead);
  const customerId = options.lead.user_id?.trim();
  const assignedAgentId = options.lead.assigned_agent_id?.trim();
  const assignedAgentName = options.assignedAgentName?.trim();
  const currentUserName = options.currentUserName?.trim();
  const currentUserId = options.currentUserId?.trim();
  const recipientUserId = normalizedMessage.recipient_user_id?.trim();
  const direction = normalizedMessage.direction?.trim().toLowerCase();

  if (
    createdById &&
    currentUserId &&
    createdById === currentUserId &&
    currentUserName
  ) {
    return currentUserName;
  }

  if (
    createdById &&
    customerId &&
    createdById === customerId &&
    customerName !== "—"
  ) {
    return customerName;
  }

  if (createdById && assignedAgentId && createdById === assignedAgentId && assignedAgentName) {
    return assignedAgentName;
  }

  if (direction === "inbound" && customerName !== "—") {
    return customerName;
  }

  if (direction === "outbound" && assignedAgentName) {
    return assignedAgentName;
  }

  if (
    recipientUserId &&
    customerId &&
    recipientUserId === customerId &&
    assignedAgentName
  ) {
    return assignedAgentName;
  }

  if (
    recipientUserId &&
    assignedAgentId &&
    recipientUserId === assignedAgentId &&
    customerName !== "—"
  ) {
    return customerName;
  }

  if (assignedAgentName) {
    return assignedAgentName;
  }

  if (customerName !== "—") {
    return customerName;
  }

  return options.unknownSenderLabel;
}

function resolveLeadMessageVariant(
  message: LeadMessage,
  options: {
    lead: Lead;
    senderName: string;
    assignedAgentName?: string | null;
    currentUserId?: string | null;
    customerName: string;
  },
): LeadConversationMessageVariant {
  const normalizedMessage = normalizeLeadMessageFromApi(message);
  const direction = normalizedMessage.direction?.trim().toLowerCase();

  if (direction === "outbound") {
    return "agent";
  }

  if (direction === "inbound") {
    return "customer";
  }

  const createdById = normalizedMessage.created_by_id?.trim();
  const customerId = options.lead.user_id?.trim();
  const assignedAgentId = options.lead.assigned_agent_id?.trim();
  const assignedAgentName = options.assignedAgentName?.trim();
  const currentUserId = options.currentUserId?.trim();
  const recipientUserId = normalizedMessage.recipient_user_id?.trim();

  if (createdById && customerId && createdById === customerId) {
    return "customer";
  }

  if (
    createdById &&
    assignedAgentId &&
    createdById === assignedAgentId
  ) {
    return "agent";
  }

  if (createdById && currentUserId && createdById === currentUserId) {
    return "agent";
  }

  if (
    recipientUserId &&
    customerId &&
    recipientUserId === customerId
  ) {
    return "agent";
  }

  if (
    recipientUserId &&
    assignedAgentId &&
    recipientUserId === assignedAgentId
  ) {
    return "customer";
  }

  if (
    assignedAgentName &&
    options.senderName.trim() === assignedAgentName
  ) {
    return "agent";
  }

  if (
    options.customerName !== "—" &&
    options.senderName.trim() === options.customerName
  ) {
    return "customer";
  }

  return "agent";
}

function resolveLeadMessageRecipientName(
  message: LeadMessage,
  variant: LeadConversationMessageVariant,
  options: {
    lead: Lead;
    assignedAgentName?: string | null;
    customerName: string;
  },
): string | null {
  const normalizedMessage = normalizeLeadMessageFromApi(message);
  const recipientName = normalizedMessage.recipient_name?.trim();

  if (recipientName) {
    return recipientName;
  }

  if (variant === "agent") {
    return options.customerName !== "—" ? options.customerName : null;
  }

  return options.assignedAgentName?.trim() || null;
}

export function mapLeadMessagesToConversationDisplay(params: {
  messages: LeadMessage[];
  lead: Lead;
  locale: string;
  assignedAgentName?: string | null;
  currentUserId?: string | null;
  currentUserName?: string | null;
  unknownSenderLabel: string;
  channelLabelFor: (channel: string) => string;
}): LeadConversationMessageDisplay[] {
  const {
    messages,
    lead,
    locale,
    assignedAgentName,
    currentUserId,
    currentUserName,
    unknownSenderLabel,
    channelLabelFor,
  } = params;

  return messages.map((rawMessage) => {
    const message = normalizeLeadMessageFromApi(rawMessage);
    const customerName = resolveLeadCustomerName(lead);
    const senderName = resolveLeadMessageSenderName(message, {
      lead,
      assignedAgentName,
      currentUserId,
      currentUserName,
      unknownSenderLabel,
    });
    const variant = resolveLeadMessageVariant(message, {
      lead,
      senderName,
      assignedAgentName,
      currentUserId,
      customerName,
    });
    const recipientName = resolveLeadMessageRecipientName(message, variant, {
      lead,
      assignedAgentName,
      customerName,
    });

    return {
      id: message.id,
      message: message.message,
      senderName,
      recipientName,
      sentAt: message.created_at,
      sentAtLabel: formatLeadDate(message.created_at, locale),
      sentTimeLabel: formatLeadTime(message.created_at, locale),
      channelLabel: channelLabelFor(message.channel),
      variant,
    };
  });
}

export function mapLeadNotesToDisplay(params: {
  notes: LeadNote[];
  locale: string;
  currentUserId?: string | null;
  currentUserName?: string | null;
  unknownAuthorLabel: string;
}): LeadNoteDisplay[] {
  const {
    notes,
    locale,
    currentUserId,
    currentUserName,
    unknownAuthorLabel,
  } = params;

  return notes.map((note) => {
    const authorFromApi = note.created_by_name?.trim();
    const authorFromCurrentUser =
      note.created_by_id &&
      currentUserId &&
      note.created_by_id === currentUserId
        ? currentUserName?.trim() || null
        : null;
    const authorName =
      authorFromApi || authorFromCurrentUser || unknownAuthorLabel;

    return {
      id: note.id,
      note: note.note,
      authorName,
      createdAt: note.created_at,
      createdAtLabel: formatLeadDate(note.created_at, locale),
      createdTimeLabel: formatLeadTime(note.created_at, locale),
    };
  });
}
