"use client";

import {
  BriefcaseBusiness,
  Building2,
  ClipboardClock,
  Handshake,
  ShieldCheck,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";

export type DashboardKpiMetricId =
  | "totalRegisteredUsers"
  | "totalAgents"
  | "totalAdmins"
  | "pendingApprovals"
  | "listingsThisMonth"
  | "leadsThisMonth"
  | "closedDeals";

export interface DashboardKpiMetric {
  id: DashboardKpiMetricId;
  label: string;
  value: number;
  trend?: number;
}

interface DashboardKpiCardsProps {
  metrics: DashboardKpiMetric[];
  locale: string;
  sectionAriaLabel: string;
  trendAriaLabel: (percentage: number) => string;
}

interface MetricVisual {
  icon: LucideIcon;
  className: string;
}

const METRIC_VISUALS: Record<DashboardKpiMetricId, MetricVisual> = {
  totalRegisteredUsers: {
    icon: UsersRound,
    className: "bg-primary-light text-primary-dark",
  },
  totalAgents: {
    icon: UserRound,
    className: "bg-info/15 text-info",
  },
  totalAdmins: {
    icon: ShieldCheck,
    className: "bg-secondary-light text-secondary-dark",
  },
  pendingApprovals: {
    icon: ClipboardClock,
    className: "bg-tertiary/20 text-tertiary-dark",
  },
  listingsThisMonth: {
    icon: Building2,
    className: "bg-primary-light text-primary-dark",
  },
  leadsThisMonth: {
    icon: BriefcaseBusiness,
    className: "bg-info/15 text-info",
  },
  closedDeals: {
    icon: Handshake,
    className: "bg-success/15 text-success",
  },
};

export function DashboardKpiCards({
  metrics,
  locale,
  sectionAriaLabel,
  trendAriaLabel,
}: DashboardKpiCardsProps) {
  const numberFormatter = new Intl.NumberFormat(locale);
  const percentageFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
  });

  return (
    <section aria-label={sectionAriaLabel}>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {metrics.map((metric) => {
          const visual = METRIC_VISUALS[metric.id];
          const Icon = visual.icon;
          const hasTrend = metric.trend !== undefined;
          const isPositive = (metric.trend ?? 0) >= 0;

          return (
            <li key={metric.id}>
              <Card className="h-full rounded-xl border border-secondary/10 shadow-none">
                <CardContent className="flex h-full items-start justify-between gap-3 p-4 sm:p-5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-muted">{metric.label}</p>
                    <p className="mt-2 text-2xl font-bold text-text sm:text-3xl">
                      {numberFormatter.format(metric.value)}
                    </p>
                    {hasTrend ? (
                      <p
                        className={cn(
                          "mt-3 text-xs font-semibold",
                          isPositive ? "text-success" : "text-danger",
                        )}
                        aria-label={trendAriaLabel(metric.trend ?? 0)}
                      >
                        <span aria-hidden>{isPositive ? "↑" : "↓"}</span>{" "}
                        {percentageFormatter.format(Math.abs(metric.trend ?? 0))}%
                      </p>
                    ) : null}
                  </div>
                  <span
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-lg",
                      visual.className,
                    )}
                    aria-hidden
                  >
                    <Icon className="size-5" />
                  </span>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
