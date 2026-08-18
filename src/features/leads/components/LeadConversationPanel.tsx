"use client";

import { useMemo } from "react";
import { Avatar, Button, Card, CardContent } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import { bodyLargeTextClasses, headingSectionClasses } from "@/src/lib/typography";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageSquare,
  MessagesSquare,
  UserRound,
} from "lucide-react";
import type { LeadConversationMessageDisplay } from "../types/lead.types";
import {
  groupLeadConversationByDate,
  type LeadConversationDateGroup,
} from "../utils/groupLeadConversationByDate";

type LeadConversationPanelProps = {
  title: string;
  subtitle: string;
  messageCountLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  listUnavailable: string;
  toRecipientLabel: (name: string) => string;
  channelWithValueLabel: (channel: string) => string;
  agentRoleLabel: string;
  customerRoleLabel: string;
  sentBadgeLabel: string;
  replyLabel: string;
  resolveDateGroupLabel: (date: Date, dayDiff: number) => string;
  canReply: boolean;
  isLoading?: boolean;
  items: LeadConversationMessageDisplay[];
  onReply: () => void;
};

function ConversationTimelineSkeleton() {
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

function RoleBadge({ label, isAgent }: { label: string; isAgent: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium",
        isAgent
          ? "bg-info/10 text-info"
          : "bg-secondary/10 text-secondary-dark",
      )}
    >
      {label}
    </span>
  );
}

function SentBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-lg bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
      <CheckCircle2 className="size-3.5 shrink-0" aria-hidden />
      {label}
    </span>
  );
}

function ConversationMessageCard({
  item,
  toRecipientLabel,
  channelWithValueLabel,
  agentRoleLabel,
  customerRoleLabel,
  sentBadgeLabel,
}: {
  item: LeadConversationMessageDisplay;
  toRecipientLabel: (name: string) => string;
  channelWithValueLabel: (channel: string) => string;
  agentRoleLabel: string;
  customerRoleLabel: string;
  sentBadgeLabel: string;
}) {
  const isAgent = item.variant === "agent";
  const roleLabel = isAgent ? agentRoleLabel : customerRoleLabel;

  return (
    <Card className="rounded-xl border border-secondary/15 bg-surface shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar
            name={item.senderName}
            size="sm"
            className={cn(
              isAgent
                ? "bg-primary/10 text-primary-dark"
                : "bg-info/10 text-info",
            )}
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-text sm:text-base">
                  {item.senderName}
                </span>
                <RoleBadge label={roleLabel} isAgent={isAgent} />
              </div>

              <div className="inline-flex shrink-0 items-center gap-1.5 text-xs text-muted sm:text-sm">
                <Clock3 className="size-3.5 shrink-0" aria-hidden />
                <time dateTime={item.sentAt ?? undefined}>{item.sentTimeLabel}</time>
              </div>
            </div>

            <p className="mt-3 text-sm font-semibold leading-6 text-text sm:text-base">
              {item.message}
            </p>

            <div className="mt-3 space-y-1.5 text-sm text-muted">
              {item.recipientName ? (
                <p className="flex min-w-0 items-center gap-2">
                  <UserRound className="size-4 shrink-0" aria-hidden />
                  <span className="truncate">
                    {toRecipientLabel(item.recipientName)}
                  </span>
                </p>
              ) : null}
              <p className="flex min-w-0 items-center gap-2">
                <Bell className="size-4 shrink-0" aria-hidden />
                <span className="truncate">
                  {channelWithValueLabel(item.channelLabel)}
                </span>
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <SentBadge label={sentBadgeLabel} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ConversationDateGroupSection({
  group,
  toRecipientLabel,
  channelWithValueLabel,
  agentRoleLabel,
  customerRoleLabel,
  sentBadgeLabel,
}: {
  group: LeadConversationDateGroup;
  toRecipientLabel: (name: string) => string;
  channelWithValueLabel: (channel: string) => string;
  agentRoleLabel: string;
  customerRoleLabel: string;
  sentBadgeLabel: string;
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
                  item.variant === "agent" ? "bg-primary" : "bg-info",
                )}
                aria-hidden
              />
              <ConversationMessageCard
                item={item}
                toRecipientLabel={toRecipientLabel}
                channelWithValueLabel={channelWithValueLabel}
                agentRoleLabel={agentRoleLabel}
                customerRoleLabel={customerRoleLabel}
                sentBadgeLabel={sentBadgeLabel}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function LeadConversationPanel({
  title,
  subtitle,
  messageCountLabel,
  emptyTitle,
  emptyDescription,
  listUnavailable,
  toRecipientLabel,
  channelWithValueLabel,
  agentRoleLabel,
  customerRoleLabel,
  sentBadgeLabel,
  replyLabel,
  resolveDateGroupLabel,
  canReply,
  isLoading = false,
  items,
  onReply,
}: LeadConversationPanelProps) {
  const groups = useMemo(
    () => groupLeadConversationByDate(items, resolveDateGroupLabel),
    [items, resolveDateGroupLabel],
  );
  const hasItems = groups.length > 0;

  return (
    <Card className="overflow-hidden rounded-xl border border-secondary/15 bg-surface">
      <CardContent className="space-y-0 p-0">
        <div className="flex flex-col gap-4 border-b border-secondary/15 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-start gap-3">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
              <MessagesSquare className="size-5" aria-hidden />
            </span>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-text sm:text-xl">
                {title}
              </h3>
              <p className={cn("mt-1 text-muted", bodyLargeTextClasses)}>
                {subtitle}
              </p>
              <p className="mt-1 text-sm text-muted">{messageCountLabel}</p>
            </div>
          </div>

          {canReply ? (
            <Button
              type="button"
              className="min-h-11 w-full shrink-0 sm:w-auto"
              onClick={onReply}
            >
              {replyLabel}
            </Button>
          ) : null}
        </div>

        <div className="px-4 py-4 sm:px-6 sm:py-6">
          {isLoading ? (
            <ConversationTimelineSkeleton />
          ) : hasItems ? (
            <div className="max-h-[40rem] space-y-6 overflow-y-auto pe-1 sm:space-y-8">
              {groups.map((group) => (
                <ConversationDateGroupSection
                  key={group.id}
                  group={group}
                  toRecipientLabel={toRecipientLabel}
                  channelWithValueLabel={channelWithValueLabel}
                  agentRoleLabel={agentRoleLabel}
                  customerRoleLabel={customerRoleLabel}
                  sentBadgeLabel={sentBadgeLabel}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-secondary/20 bg-page px-4 py-10 text-center sm:px-6 sm:py-12">
              <span className="mx-auto inline-flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary-dark">
                <MessageSquare className="size-6" aria-hidden />
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
              {canReply ? (
                <Button
                  type="button"
                  className="mt-6 min-h-11"
                  onClick={onReply}
                >
                  {replyLabel}
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
