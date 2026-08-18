"use client";

import { memo } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import type {
  DashboardAlertSeverity,
  DashboardHealthAlert,
} from "../types/dashboard.types";

interface DashboardHealthAlertsProps {
  title: string;
  alerts: DashboardHealthAlert[];
  emptyTitle: string;
  emptyDescription: string;
  severityLabels: Record<DashboardAlertSeverity, string>;
}

interface SeverityVisual {
  icon: LucideIcon;
  className: string;
  badgeClassName: string;
}

const severityVisuals: Record<DashboardAlertSeverity, SeverityVisual> = {
  warning: {
    icon: AlertTriangle,
    className: "border-tertiary/40 bg-tertiary/10",
    badgeClassName: "bg-tertiary/20 text-tertiary-dark",
  },
  info: {
    icon: Info,
    className: "border-info/25 bg-info/5",
    badgeClassName: "bg-info/15 text-info",
  },
  error: {
    icon: AlertCircle,
    className: "border-danger/25 bg-danger/5",
    badgeClassName: "bg-danger/10 text-danger",
  },
  success: {
    icon: CheckCircle2,
    className: "border-success/25 bg-success/5",
    badgeClassName: "bg-success/15 text-success",
  },
};

function DashboardHealthAlertsComponent({
  title,
  alerts,
  emptyTitle,
  emptyDescription,
  severityLabels,
}: DashboardHealthAlertsProps) {
  return (
    <Card className="min-w-0 rounded-xl border border-secondary/10 shadow-none">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        {alerts.length > 0 ? (
          <ul className="space-y-3">
            {alerts.map((alert, index) => {
              const visual = severityVisuals[alert.severity];
              const Icon = visual.icon;

              return (
                <li
                  key={alert.id ?? `${alert.title}-${index}`}
                  className={cn("rounded-xl border p-4", visual.className)}
                >
                  <div className="flex items-start gap-3">
                    <Icon className="mt-0.5 size-5 shrink-0 text-text" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-text">{alert.title}</p>
                        <span
                          className={cn(
                            "rounded-lg px-2 py-1 text-xs font-semibold",
                            visual.badgeClassName,
                          )}
                        >
                          {severityLabels[alert.severity]}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted">{alert.message}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center px-4 text-center">
            <ShieldCheck className="size-9 text-success" aria-hidden />
            <p className="mt-3 text-sm font-semibold text-text">{emptyTitle}</p>
            <p className="mt-1 max-w-sm text-sm text-muted">{emptyDescription}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const DashboardHealthAlerts = memo(DashboardHealthAlertsComponent);
