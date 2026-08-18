export type CalendarDateGroup<T> = {
  id: string;
  label: string;
  items: T[];
};

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDayDiff(reference: Date, target: Date): number {
  const referenceStart = startOfDay(reference).getTime();
  const targetStart = startOfDay(target).getTime();
  return Math.floor((referenceStart - targetStart) / (24 * 60 * 60 * 1000));
}

/** Groups items by calendar day (newest day first; items chronological within a day). */
export function groupByCalendarDate<T>(
  items: T[],
  getDateIso: (item: T) => string | null,
  resolveGroupLabel: (date: Date, dayDiff: number) => string,
  now: Date = new Date(),
): CalendarDateGroup<T>[] {
  const groups = new Map<string, CalendarDateGroup<T>>();

  const sortedItems = [...items].sort((left, right) => {
    const leftTime = getDateIso(left) ? Date.parse(getDateIso(left)!) : 0;
    const rightTime = getDateIso(right) ? Date.parse(getDateIso(right)!) : 0;
    return leftTime - rightTime;
  });

  for (const item of sortedItems) {
    const iso = getDateIso(item);
    const parsed = iso ? new Date(iso) : null;
    const date =
      parsed && !Number.isNaN(parsed.getTime()) ? parsed : now;
    const dayDiff = getDayDiff(now, date);
    const id = toDateKey(date);
    const label = resolveGroupLabel(date, dayDiff);
    const existing = groups.get(id);

    if (existing) {
      existing.items.push(item);
      continue;
    }

    groups.set(id, {
      id,
      label,
      items: [item],
    });
  }

  return Array.from(groups.values()).sort((left, right) =>
    right.id.localeCompare(left.id),
  );
}
