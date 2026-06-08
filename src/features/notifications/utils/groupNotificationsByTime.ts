import type { NotificationGroupLabels } from "../i18n/buildNotificationGroupLabels";
import type { NotificationRecord } from "../types/notification.types";

export type NotificationTimeGroupId =
  | "justNow"
  | "earlierToday"
  | "yesterday"
  | "lastWeek"
  | "lastMonth"
  | `month:${number}-${number}`
  | "lastYear"
  | `year:${number}`;

export type NotificationTimeGroup = {
  id: NotificationTimeGroupId;
  label: string;
  sortKey: number;
  items: NotificationRecord[];
};

type TimeGroupMeta = {
  id: NotificationTimeGroupId;
  sortKey: number;
  monthDate?: Date;
};

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function getDayDiff(reference: Date, target: Date): number {
  const referenceStart = startOfDay(reference).getTime();
  const targetStart = startOfDay(target).getTime();

  return Math.floor((referenceStart - targetStart) / (24 * 60 * 60 * 1000));
}

function resolveTimeGroupMeta(date: Date, now: Date): TimeGroupMeta {
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (60 * 1000));

  if (diffMinutes < 60) {
    return { id: "justNow", sortKey: 0 };
  }

  const todayStart = startOfDay(now);
  if (date >= todayStart) {
    return { id: "earlierToday", sortKey: 1 };
  }

  const dayDiff = getDayDiff(now, date);

  if (dayDiff === 1) {
    return { id: "yesterday", sortKey: 2 };
  }

  if (dayDiff >= 2 && dayDiff <= 7) {
    return { id: "lastWeek", sortKey: 3 };
  }

  if (dayDiff >= 8 && dayDiff <= 30) {
    return { id: "lastMonth", sortKey: 4 };
  }

  const year = date.getFullYear();
  const month = date.getMonth();
  const currentYear = now.getFullYear();
  const previousYear = currentYear - 1;

  if (year === currentYear) {
    const monthDate = new Date(year, month, 1);

    return {
      id: `month:${year}-${month}`,
      sortKey: 100 + (12 - month),
      monthDate,
    };
  }

  if (year === previousYear) {
    return { id: "lastYear", sortKey: 2000 };
  }

  return {
    id: `year:${year}`,
    sortKey: 3000 + (9999 - year),
  };
}

function buildGroupLabel(
  meta: TimeGroupMeta,
  locale: string,
  labels: NotificationGroupLabels,
): string {
  switch (meta.id) {
    case "justNow":
      return labels.justNow;
    case "earlierToday":
      return labels.earlierToday;
    case "yesterday":
      return labels.yesterday;
    case "lastWeek":
      return labels.lastWeek;
    case "lastMonth":
      return labels.lastMonth;
    case "lastYear":
      return labels.lastYear;
    default:
      break;
  }

  if (meta.id.startsWith("month:") && meta.monthDate) {
    return new Intl.DateTimeFormat(locale, { month: "long" }).format(meta.monthDate);
  }

  if (meta.id.startsWith("year:")) {
    return meta.id.replace("year:", "");
  }

  return meta.id;
}

export function groupNotificationsByTime(
  items: NotificationRecord[],
  locale: string,
  labels: NotificationGroupLabels,
  now: Date = new Date(),
): NotificationTimeGroup[] {
  const groups = new Map<NotificationTimeGroupId, NotificationTimeGroup>();

  const sortedItems = [...items].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );

  for (const item of sortedItems) {
    const date = new Date(item.createdAt);
    if (Number.isNaN(date.getTime())) {
      continue;
    }

    const meta = resolveTimeGroupMeta(date, now);
    const label = buildGroupLabel(meta, locale, labels);
    const existing = groups.get(meta.id);

    if (existing) {
      existing.items.push(item);
      continue;
    }

    groups.set(meta.id, {
      id: meta.id,
      label,
      sortKey: meta.sortKey,
      items: [item],
    });
  }

  return Array.from(groups.values()).sort(
    (left, right) => left.sortKey - right.sortKey,
  );
}
