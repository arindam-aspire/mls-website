"use client";

import { memo } from "react";
import {
  Activity,
  Bell,
  Building2,
  CheckCircle2,
  ClipboardClock,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui";
import { cn } from "@/src/lib/cn";
import type {
  DashboardActivityTone,
  DashboardRecentActivity as DashboardRecentActivityItem,
} from "../types/dashboard.types";

interface DashboardRecentActivityProps {
  title: string;
  activities: DashboardRecentActivityItem[];
  emptyTitle: string;
  emptyDescription: string;
}

const activityIcons: Record<string, LucideIcon> = {
  activity: Activity,
  agent: UserRound,
  approval: CheckCircle2,
  bell: Bell,
  listing: Building2,
  pending: ClipboardClock,
  user: UserRound,
};

const toneClasses: Record<DashboardActivityTone, string> = {
  default: "bg-secondary-light text-secondary-dark",
  info: "bg-info/15 text-info",
  success: "bg-success/15 text-success",
  warning: "bg-tertiary/20 text-tertiary-dark",
  error: "bg-danger/10 text-danger",
};

function DashboardRecentActivityComponent({
  title,
  activities,
  emptyTitle,
  emptyDescription,
}: DashboardRecentActivityProps) {
  return (
    <Card className="min-w-0 rounded-xl border border-secondary/10 shadow-none">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        {activities.length > 0 ? (
          <ul className="divide-y divide-secondary/10">
            {activities.map((activity, index) => {
              const Icon = activityIcons[activity.icon.toLowerCase()] ?? Activity;

              return (
                <li
                  key={activity.id ?? `${activity.text}-${index}`}
                  className="flex min-w-0 gap-3 py-4 first:pt-0 last:pb-0"
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg",
                      toneClasses[activity.tone] ?? toneClasses.default,
                    )}
                    aria-hidden
                  >
                    <Icon className="size-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-6 text-text">{activity.text}</p>
                    <time className="mt-1 block text-xs text-muted">
                      {activity.relativeTime}
                    </time>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex min-h-48 flex-col items-center justify-center px-4 text-center">
            <Activity className="size-9 text-muted" aria-hidden />
            <p className="mt-3 text-sm font-semibold text-text">{emptyTitle}</p>
            <p className="mt-1 max-w-sm text-sm text-muted">{emptyDescription}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const DashboardRecentActivity = memo(DashboardRecentActivityComponent);
