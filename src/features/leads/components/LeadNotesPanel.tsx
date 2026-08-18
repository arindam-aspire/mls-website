"use client";

import { useMemo } from "react";
import { Avatar, Button, Card, CardContent } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingSectionClasses } from "@/src/lib/typography";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  NotebookPen,
  StickyNote,
} from "lucide-react";
import type { LeadNoteDisplay } from "../types/lead.types";
import {
  groupByCalendarDate,
  type CalendarDateGroup,
} from "../utils/groupByCalendarDate";

type LeadNotesPanelProps = {
  title: string;
  subtitle: string;
  noteCountLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  listUnavailable: string;
  internalBadgeLabel: string;
  savedBadgeLabel: string;
  addNoteLabel: string;
  resolveDateGroupLabel: (date: Date, dayDiff: number) => string;
  canAddNote: boolean;
  isLoading?: boolean;
  items: LeadNoteDisplay[];
  onAddNote: () => void;
};

function NotesTimelineSkeleton() {
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

function NoteCard({
  item,
  internalBadgeLabel,
  savedBadgeLabel,
}: {
  item: LeadNoteDisplay;
  internalBadgeLabel: string;
  savedBadgeLabel: string;
}) {
  return (
    <Card className="rounded-xl border border-secondary/15 bg-surface shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar
            name={item.authorName}
            size="sm"
            className="bg-secondary/10 text-secondary-dark"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-text sm:text-base">
                  {item.authorName}
                </span>
                <span className="inline-flex items-center rounded-lg bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary-dark">
                  {internalBadgeLabel}
                </span>
              </div>

              <div className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted sm:text-sm">
                <Clock3 className="size-3.5 shrink-0" aria-hidden />
                <time dateTime={item.createdAt ?? undefined}>
                  {item.createdTimeLabel}
                </time>
              </div>
            </div>

            <p className="mt-3 whitespace-pre-wrap break-words text-sm font-semibold leading-6 text-text sm:text-base">
              {item.note}
            </p>

            <div className="mt-4 flex justify-end">
              <span className="inline-flex items-center gap-1 rounded-lg bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                <CheckCircle2 className="size-3.5 shrink-0" aria-hidden />
                {savedBadgeLabel}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NotesDateGroupSection({
  group,
  internalBadgeLabel,
  savedBadgeLabel,
}: {
  group: CalendarDateGroup<LeadNoteDisplay>;
  internalBadgeLabel: string;
  savedBadgeLabel: string;
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
                className="absolute -start-[calc(0.75rem+1px)] top-6 size-3 rounded-full border-2 border-surface bg-secondary"
                aria-hidden
              />
              <NoteCard
                item={item}
                internalBadgeLabel={internalBadgeLabel}
                savedBadgeLabel={savedBadgeLabel}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function LeadNotesPanel({
  title,
  subtitle,
  noteCountLabel,
  emptyTitle,
  emptyDescription,
  listUnavailable,
  internalBadgeLabel,
  savedBadgeLabel,
  addNoteLabel,
  resolveDateGroupLabel,
  canAddNote,
  isLoading = false,
  items,
  onAddNote,
}: LeadNotesPanelProps) {
  const groups = useMemo(
    () =>
      groupByCalendarDate(items, (item) => item.createdAt, resolveDateGroupLabel),
    [items, resolveDateGroupLabel],
  );
  const hasItems = groups.length > 0;

  return (
    <Card className="overflow-hidden rounded-xl border border-secondary/15 bg-surface">
      <CardContent className="space-y-0 p-0">
        <div className="flex flex-col gap-4 border-b border-secondary/15 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary-dark">
              <NotebookPen className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-text sm:text-xl">
                {title}
              </h3>
              <p className={cn("mt-1 text-muted", bodyLargeTextClasses)}>
                {subtitle}
              </p>
              <p className="mt-1 text-sm text-muted">{noteCountLabel}</p>
            </div>
          </div>

          {canAddNote ? (
            <Button
              type="button"
              className="min-h-11 w-full shrink-0 sm:w-auto"
              onClick={onAddNote}
            >
              {addNoteLabel}
            </Button>
          ) : null}
        </div>

        <div className="px-4 py-4 sm:px-6 sm:py-6">
          {isLoading ? (
            <NotesTimelineSkeleton />
          ) : hasItems ? (
            <div className="max-h-[40rem] space-y-6 overflow-y-auto pe-1 sm:space-y-8">
              {groups.map((group) => (
                <NotesDateGroupSection
                  key={group.id}
                  group={group}
                  internalBadgeLabel={internalBadgeLabel}
                  savedBadgeLabel={savedBadgeLabel}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-secondary/20 bg-page px-4 py-10 text-center sm:px-6 sm:py-12">
              <span className="mx-auto inline-flex size-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary-dark">
                <StickyNote className="size-6" aria-hidden />
              </span>
              <p className="mt-4 text-base font-semibold text-text">
                {emptyTitle}
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                {emptyDescription}
              </p>
              <p className="mx-auto mt-3 max-w-md text-xs text-muted">
                {listUnavailable}
              </p>
              {canAddNote ? (
                <Button
                  type="button"
                  className="mt-6 min-h-11"
                  onClick={onAddNote}
                >
                  {addNoteLabel}
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
