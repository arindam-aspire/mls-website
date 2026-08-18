import type { LeadConversationMessageDisplay } from "../types/lead.types";
import {
  groupByCalendarDate,
  type CalendarDateGroup,
} from "./groupByCalendarDate";

export type LeadConversationDateGroup =
  CalendarDateGroup<LeadConversationMessageDisplay>;

export function groupLeadConversationByDate(
  items: LeadConversationMessageDisplay[],
  resolveGroupLabel: (date: Date, dayDiff: number) => string,
  now: Date = new Date(),
): LeadConversationDateGroup[] {
  return groupByCalendarDate(
    items,
    (item) => item.sentAt,
    resolveGroupLabel,
    now,
  );
}
