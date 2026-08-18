"use client";

import { memo, useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui";

interface DashboardTrendChartProps {
  title: string;
  labels: string[];
  values: number[];
  emptyTitle: string;
  emptyDescription: string;
  locale: string;
  color: "primary" | "secondary" | "info";
}

const CHART_WIDTH = 600;
const CHART_HEIGHT = 220;
const CHART_PADDING_X = 18;
const CHART_PADDING_Y = 20;

const colorValues: Record<DashboardTrendChartProps["color"], string> = {
  primary: "var(--primary)",
  secondary: "var(--secondary)",
  info: "var(--info)",
};

function DashboardTrendChartComponent({
  title,
  labels,
  values,
  emptyTitle,
  emptyDescription,
  locale,
  color,
}: DashboardTrendChartProps) {
  const points = useMemo(() => {
    const length = Math.min(labels.length, values.length);
    const series = values.slice(0, length);

    if (length === 0) {
      return "";
    }

    const maximum = Math.max(...series, 1);
    const minimum = Math.min(...series, 0);
    const range = Math.max(maximum - minimum, 1);
    const availableWidth = CHART_WIDTH - CHART_PADDING_X * 2;
    const availableHeight = CHART_HEIGHT - CHART_PADDING_Y * 2;

    return series
      .map((value, index) => {
        const x =
          length === 1
            ? CHART_WIDTH / 2
            : CHART_PADDING_X + (index / (length - 1)) * availableWidth;
        const y =
          CHART_PADDING_Y +
          ((maximum - value) / range) * availableHeight;

        return `${x},${y}`;
      })
      .join(" ");
  }, [labels.length, values]);

  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const visibleLabels = labels.slice(0, values.length);

  return (
    <Card className="min-w-0 rounded-xl border border-secondary/10 shadow-none">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {points ? (
          <>
            <div className="h-56 w-full" aria-hidden>
              <svg
                className="h-full w-full overflow-visible"
                viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                preserveAspectRatio="none"
              >
                {[0.25, 0.5, 0.75].map((ratio) => (
                  <line
                    key={ratio}
                    x1={CHART_PADDING_X}
                    x2={CHART_WIDTH - CHART_PADDING_X}
                    y1={CHART_HEIGHT * ratio}
                    y2={CHART_HEIGHT * ratio}
                    stroke="var(--secondary)"
                    strokeOpacity="0.12"
                    strokeDasharray="5 7"
                  />
                ))}
                <polyline
                  points={points}
                  fill="none"
                  stroke={colorValues[color]}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
            <div
              className="mt-3 grid gap-1 text-center text-[0.65rem] text-muted sm:text-xs"
              style={{
                gridTemplateColumns: `repeat(${Math.max(visibleLabels.length, 1)}, minmax(0, 1fr))`,
              }}
            >
              {visibleLabels.map((label, index) => (
                <span key={`${label}-${index}`} className="truncate" title={label}>
                  {label}
                </span>
              ))}
            </div>
            <ul className="sr-only">
              {visibleLabels.map((label, index) => (
                <li key={`${label}-${index}-value`}>
                  {label}: {numberFormatter.format(values[index] ?? 0)}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="flex min-h-56 flex-col items-center justify-center px-4 text-center">
            <BarChart3 className="size-9 text-muted" aria-hidden />
            <p className="mt-3 text-sm font-semibold text-text">{emptyTitle}</p>
            <p className="mt-1 max-w-sm text-sm text-muted">{emptyDescription}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export const DashboardTrendChart = memo(DashboardTrendChartComponent);
