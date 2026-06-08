import { formatNotificationRelativeTime } from "./formatNotificationRelativeTime";

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

export function formatNotificationListTime(
  isoDate: string,
  locale: string,
  now: Date = new Date(),
): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (60 * 1000));
  const todayStart = startOfDay(now);

  if (diffMinutes < 60 || date >= todayStart) {
    return formatNotificationRelativeTime(isoDate, locale);
  }

  const dayDiff = getDayDiff(now, date);

  if (dayDiff === 1) {
    return new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  if (dayDiff >= 2 && dayDiff <= 7) {
    return new Intl.DateTimeFormat(locale, {
      weekday: "short",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  if (dayDiff >= 8 && dayDiff <= 30) {
    return new Intl.DateTimeFormat(locale, {
      weekday: "short",
      month: "numeric",
      day: "numeric",
    }).format(date);
  }

  return new Intl.DateTimeFormat(locale, {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
