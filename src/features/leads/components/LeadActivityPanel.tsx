"use client";

import { useMemo } from "react";
import { Avatar, Card, CardContent } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingSectionClasses } from "@/src/lib/typography";
import {
  Activity,
  CalendarDays,
  Clock3,
  UserRound,
} from "lucide-react";
import type { LeadActivityDisplay } from "../types/lead.types";
import {
  groupByCalendarDate,
  type CalendarDateGroup,
} from "../utils/groupByCalendarDate";

type LeadActivityPanelProps = {
  title: string;
  subtitle: string;
  activityCountLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  byActorLabel: (name: string) => string;
  resolveDateGroupLabel: (date: Date, dayDiff: number) => string;
  isLoading?: boolean;
  items: LeadActivityDisplay[];
};

function ActivityTimelineSkeleton() {
  return (
    <div className="space-y-6" aria-hidden>
      <div className="h-5 w-44 rounded-lg bg-secondary/10" />
      <div className="relative ms-4 space-y-4 border-s-2 border-secondary/10 ps-6">
        {[0, 1].map((index) => (
          <div key={index} className="relative">
            <span className="absolute -start-[calc(0.75rem+1px)] top-6 size-3 rounded-full bg-secondary/10" />
            <div className="rounded-xl border border-secondary/15 bg-surface p-4 sm:p-5">
              <div className="flex gap-3">
                <div className="size-9 rounded-full bg-secondary/10" />
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="h-4 w-40 rounded-lg bg-secondary/10" />
                  <div className="h-5 w-3/4 rounded-lg bg-secondary/10" />
                  <div className="h-3 w-32 rounded-lg bg-secondary/10" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function activityDotClass(type: string): string {
  switch (type.trim().toUpperCase()) {
    case "LEAD_CREATED":
      return "bg-info";
    case "LEAD_ASSIGNED":
      return "bg-primary";
    case "LEAD_CLOSURE_REQUEST":
    case "REQUEST_FOR_CLOSE":
      return "bg-secondary";
    case "LEAD_CLOSED":
      return "bg-success";
    default:
      return "bg-primary";
  }
}

function ActivityCard({
  item,
  byActorLabel,
}: {
  item: LeadActivityDisplay;
  byActorLabel: (name: string) => string;
}) {
  return (
    <Card className="rounded-xl border border-secondary/15 bg-surface shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar
            name={item.actorName || item.title}
            size="sm"
            className="bg-primary/10 text-primary-dark"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-text sm:text-base">
                  {item.title}
                </span>
                <span className="inline-flex items-center rounded-lg bg-info/10 px-2 py-0.5 text-xs font-medium text-info">
                  {item.typeLabel}
                </span>
              </div>

              <div className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted sm:text-sm">
                <Clock3 className="size-3.5 shrink-0" aria-hidden />
                <time dateTime={item.createdAt ?? undefined}>
                  {item.createdTimeLabel}
                </time>
              </div>
            </div>

            {item.description ? (
              <p className="mt-3 text-sm leading-6 text-text sm:text-base">
                {item.description}
              </p>
            ) : null}

            <div className="mt-3 space-y-1.5 text-sm text-muted">
              {item.actorName ? (
                <p className="flex min-w-0 items-center gap-2">
                  <UserRound className="size-4 shrink-0" aria-hidden />
                  <span className="truncate">{byActorLabel(item.actorName)}</span>
                </p>
              ) : null}
              <p className="flex min-w-0 items-center gap-2">
                <CalendarDays className="size-4 shrink-0" aria-hidden />
                <span className="truncate">{item.createdAtLabel}</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ActivityDateGroupSection({
  group,
  byActorLabel,
}: {
  group: CalendarDateGroup<LeadActivityDisplay>;
  byActorLabel: (name: string) => string;
}) {
  return (
    <section className="min-w-0">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-xl bg-info/10 text-info">
          <CalendarDays className="size-4" aria-hidden />
        </span>
        <h3 className={headingSectionClasses}>{group.label}</h3>
      </div>

      <div className="relative ms-4 border-s-2 border-secondary/15 ps-5 sm:ps-6">
        <ul className="space-y-4 sm:space-y-5">
          {group.items.map((item) => (
            <li key={item.id} className="relative min-w-0">
              <span
                className={cn(
                  "absolute -start-[calc(0.75rem+1px)] top-6 size-3 rounded-full border-2 border-surface",
                  activityDotClass(item.type),
                )}
                aria-hidden
              />
              <ActivityCard item={item} byActorLabel={byActorLabel} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function LeadActivityPanel({
  title,
  subtitle,
  activityCountLabel,
  emptyTitle,
  emptyDescription,
  byActorLabel,
  resolveDateGroupLabel,
  isLoading = false,
  items,
}: LeadActivityPanelProps) {
  const groups = useMemo(
    () =>
      groupByCalendarDate(
        items,
        (item) => item.createdAt,
        resolveDateGroupLabel,
      ),
    [items, resolveDateGroupLabel],
  );
  const hasItems = groups.length > 0;

  return (
    <Card className="overflow-hidden rounded-xl border border-secondary/15 bg-surface">
      <CardContent className="space-y-0 p-0">
        <div className="flex flex-col gap-4 border-b border-secondary/15 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
              <Activity className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-text sm:text-xl">
                {title}
              </h3>
              <p className={cn("mt-1 text-muted", bodyLargeTextClasses)}>
                {subtitle}
              </p>
              <p className="mt-1 text-sm text-muted">{activityCountLabel}</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 sm:px-6 sm:py-6">
          {isLoading ? (
            <ActivityTimelineSkeleton />
          ) : hasItems ? (
            <div className="max-h-[40rem] space-y-6 overflow-y-auto pe-1 sm:space-y-8">
              {groups.map((group) => (
                <ActivityDateGroupSection
                  key={group.id}
                  group={group}
                  byActorLabel={byActorLabel}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-secondary/20 bg-page px-4 py-10 text-center sm:px-6 sm:py-12">
              <span className="mx-auto inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                <Activity className="size-6" aria-hidden />
              </span>
              <p className="mt-4 text-base font-semibold text-text">
                {emptyTitle}
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                {emptyDescription}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
