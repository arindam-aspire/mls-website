"use client";

import { Avatar } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import type { AgentListItem } from "@/src/features/agent/types/agent.types";
import { Mail, Phone } from "lucide-react";

type AssignAgentListItemProps = {
  agent: AgentListItem;
  selected: boolean;
  disabled?: boolean;
  onSelect: () => void;
  ariaLabel: string;
};

export function AssignAgentListItem({
  agent,
  selected,
  disabled = false,
  onSelect,
  ariaLabel,
}: AssignAgentListItemProps) {
  const displayName = agent.fullName.trim() || agent.email.trim();
  const email = agent.email.trim();
  const phone = agent.phone.trim();
  const showMeta = email.length > 0 || phone.length > 0;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex w-full min-w-0 items-start gap-2.5 rounded-xl border p-2 text-start transition-colors sm:items-center sm:gap-3",
        "outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        selected
          ? "border-primary bg-primary-light/50 shadow-sm dark:border-primary dark:bg-primary/15"
          : "border-secondary/15 bg-surface hover:border-secondary/30 hover:bg-page/60",
        disabled && "pointer-events-none opacity-60",
      )}
    >
      <Avatar
        alt=""
        name={displayName}
        size="lg"
        className={cn(
          "shrink-0 ring-2 ring-transparent transition-shadow",
          selected ? "ring-primary/30" : "ring-secondary/10",
        )}
      />

      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-sm font-semibold sm:text-base",
            selected ? "text-primary-dark dark:text-primary" : "text-text",
          )}
        >
          {displayName}
        </span>

        {showMeta ? (
          <span className="mt-1 flex min-w-0 flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-0.5">
            {email ? (
              <span className="inline-flex min-w-0 max-w-full items-center gap-1.5 text-xs text-muted sm:text-sm">
                <Mail className="size-3.5 shrink-0 sm:size-4" aria-hidden />
                <span className="truncate">{email}</span>
              </span>
            ) : null}
            {phone ? (
              <span className="inline-flex min-w-0 max-w-full items-center gap-1.5 text-xs text-muted sm:text-sm">
                <Phone className="size-3.5 shrink-0 sm:size-4" aria-hidden />
                <span className="truncate">{phone}</span>
              </span>
            ) : null}
          </span>
        ) : null}
      </span>

      <span
        className={cn(
          "mt-1 flex size-5 shrink-0 items-center justify-center rounded-full border-2 sm:mt-0",
          selected ? "border-primary" : "border-secondary/25",
        )}
        aria-hidden
      >
        {selected ? <span className="size-2.5 rounded-full bg-primary" /> : null}
      </span>
    </button>
  );
}

export type { AssignAgentListItemProps };
