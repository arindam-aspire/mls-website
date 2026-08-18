"use client";

import { memo, useMemo } from "react";
import { PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui";

interface DashboardLeadSourceChartProps {
  title: string;
  labels: string[];
  values: number[];
  emptyTitle: string;
  emptyDescription: string;
  locale: string;
}

const SOURCE_COLORS = [
  "var(--primary)",
  "var(--secondary)",
  "var(--info)",
  "var(--success)",
  "var(--tertiary)",
  "var(--danger)",
] as const;

function DashboardLeadSourceChartComponent({
  title,
  labels,
  values,
  emptyTitle,
  emptyDescription,
  locale,
}: DashboardLeadSourceChartProps) {
  const segments = useMemo(() => {
    const length = Math.min(labels.length, values.length);
    const total = values.slice(0, length).reduce((sum, value) => sum + Math.max(value, 0), 0);

    return labels.slice(0, length).reduce<Array<{
      label: string;
      value: number;
      percentage: number;
      color: string;
      start: number;
      end: number;
    }>>((result, label, index) => {
      const value = Math.max(values[index] ?? 0, 0);
      const percentage = total > 0 ? (value / total) * 100 : 0;
      const start = result.at(-1)?.end ?? 0;

      return [...result, {
        label,
        value,
        percentage,
        color: SOURCE_COLORS[index % SOURCE_COLORS.length],
        start,
        end: start + percentage,
      }];
    }, []);
  }, [labels, values]);

  const hasData = segments.some((segment) => segment.value > 0);
  const gradient = segments
    .map((segment) => `${segment.color} ${segment.start}% ${segment.end}%`)
    .join(", ");
  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const percentageFormatter = useMemo(
    () => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
    [locale],
  );

  return (
    <Card className="min-w-0 rounded-xl border border-secondary/10 shadow-none">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <div
              className="relative size-40 shrink-0 rounded-full sm:size-44"
              style={{ background: `conic-gradient(${gradient})` }}
              aria-hidden
            >
              <div className="absolute inset-9 rounded-full bg-surface sm:inset-10" />
            </div>
            <ul className="grid min-w-0 flex-1 grid-cols-1 gap-3 self-stretch">
              {segments.map((segment, index) => (
                <li
                  key={`${segment.label}-${index}`}
                  className="flex min-w-0 items-center justify-between gap-3 text-sm"
                >
                  <span className="flex min-w-0 items-center gap-2 text-muted">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: segment.color }}
                      aria-hidden
                    />
                    <span className="truncate">{segment.label}</span>
                  </span>
                  <span className="shrink-0 font-semibold text-text">
                    {numberFormatter.format(segment.value)}{" "}
                    <span className="text-xs font-normal text-muted">
                      ({percentageFormatter.format(segment.percentage)}%)
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex min-h-56 flex-col items-center justify-center px-4 text-center">
            <PieChart className="size-9 text-muted" aria-hidden />
            <p className="mt-3 text-sm font-semibold text-text">{emptyTitle}</p>
            <p className="mt-1 max-w-sm text-sm text-muted">{emptyDescription}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const DashboardLeadSourceChart = memo(DashboardLeadSourceChartComponent);
