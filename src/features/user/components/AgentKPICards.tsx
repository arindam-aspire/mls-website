"use client";

import { Card, CardContent } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import {
  Ban,
  Clock,
  MailOpen,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

export type AgentKPIMetricId =
  | "activeAgents"
  | "pendingReview"
  | "pendingInvite"
  | "declined";

export type AgentKPIMetric = {
  id: AgentKPIMetricId;
  label: string;
  value: number;
};

export type AgentKPICardsProps = {
  metrics: AgentKPIMetric[];
  sectionAriaLabel: string;
  className?: string;
};

type AgentKPIMetricVisual = {
  icon: LucideIcon;
  iconWrapperClassName: string;
};

const METRIC_VISUALS: Record<AgentKPIMetricId, AgentKPIMetricVisual> = {
  activeAgents: {
    icon: UserCheck,
    iconWrapperClassName: "bg-primary-light text-primary dark:bg-primary/20",
  },
  pendingReview: {
    icon: Clock,
    iconWrapperClassName: "bg-info/15 text-info",
  },
  pendingInvite: {
    icon: MailOpen,
    iconWrapperClassName: "bg-tertiary/15 text-tertiary-dark dark:text-tertiary",
  },
  declined: {
    icon: Ban,
    iconWrapperClassName: "bg-danger/10 text-danger",
  },
};

function formatMetricValue(value: number): string {
  return new Intl.NumberFormat(undefined).format(value);
}

function AgentKPICard({ metric }: { metric: AgentKPIMetric }) {
  const visual = METRIC_VISUALS[metric.id];
  const Icon = visual.icon;
  const valueId = `agent-kpi-value-${metric.id}`;

  return (
    <Card className="rounded-xl border border-secondary/10 shadow-none">
      <CardContent className="flex items-center justify-between gap-3 p-4 sm:gap-4 sm:p-5">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted sm:text-sm">
            {metric.label}
          </p>
          <p
            id={valueId}
            className="mt-2 text-2xl font-bold leading-none text-text sm:mt-3 sm:text-3xl"
          >
            {formatMetricValue(metric.value)}
          </p>
        </div>

        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl sm:size-12",
            visual.iconWrapperClassName,
          )}
          aria-hidden
        >
          <Icon className="size-5 sm:size-6" />
        </div>
      </CardContent>
    </Card>
  );
}

export function AgentKPICards({
  metrics,
  sectionAriaLabel,
  className,
}: AgentKPICardsProps) {
  if (metrics.length === 0) {
    return null;
  }

  return (
    <section
      className={cn("w-full min-w-0", className)}
      aria-label={sectionAriaLabel}
    >
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-4 lg:gap-6 xl:grid-cols-4">
        {metrics.map((metric) => (
          <li key={metric.id}>
            <AgentKPICard metric={metric} />
          </li>
        ))}
      </ul>
    </section>
  );
}
