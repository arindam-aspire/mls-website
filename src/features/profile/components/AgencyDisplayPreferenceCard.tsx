"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/src/components/ui";
import { Skeleton } from "@/src/components/ui/skeleton";
import { cn } from "@/src/lib/cn";
import { bodyTextClasses, headingSectionClasses } from "@/src/lib/typography";
import type { AgencySelectablePreference } from "../types/profile.types";
import { DisplayPreferenceOptionCard } from "./DisplayPreferenceOptionCard";

const preferenceIconClassName = cn(
  "flex size-10 shrink-0 items-center justify-center rounded-lg",
  "bg-black/5 text-black/70 dark:bg-white/5 dark:text-white/70",
);

export type AgencyDisplayPreferenceCardProps<T extends string> = {
  icon: LucideIcon;
  preference: AgencySelectablePreference<T>;
  onUpcomingFeature: () => void;
};

export function AgencyDisplayPreferenceCard<T extends string>({
  icon: Icon,
  preference,
  onUpcomingFeature,
}: AgencyDisplayPreferenceCardProps<T>) {
  const isDisabled = preference.disabled || preference.isUpdating;

  return (
    <Card className="h-full w-full">
      <CardContent className="p-4 sm:p-6">
        <div
          className={cn("flex items-start gap-3", isDisabled && "opacity-60")}
          aria-busy={preference.isUpdating || undefined}
        >
          <div className={preferenceIconClassName}>
            <Icon className="size-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 text-start">
            <h2 className={cn("break-words", headingSectionClasses)}>
              {preference.title}
            </h2>
            <p className={cn("mt-1 text-sm text-muted sm:text-base", bodyTextClasses)}>
              {preference.description}
            </p>
          </div>
        </div>

        <div
          role="radiogroup"
          aria-label={preference.title}
          className="mt-4 grid grid-cols-1 gap-3 sm:mt-5 sm:grid-cols-2"
        >
          {preference.options.map((option) => (
            <DisplayPreferenceOptionCard
              key={option.value}
              code={option.code}
              name={option.name}
              symbol={option.symbol}
              selected={preference.value === option.value}
              disabled={isDisabled}
              onSelect={() => {
                if (isDisabled) return;
                if (!preference.interactive) {
                  onUpcomingFeature();
                  return;
                }
                preference.onSelect(option.value as T);
              }}
              ariaLabel={`${option.code} — ${option.name}`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function AgencyDisplayPreferenceCardSkeleton() {
  return (
    <Card className="h-full w-full" aria-hidden>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <Skeleton className="size-10 shrink-0 rounded-lg" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton variant="text" className="h-6 w-32" />
            <Skeleton variant="text" className="h-4 w-full max-w-sm" />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Skeleton className="h-[4.75rem] w-full rounded-xl" />
          <Skeleton className="h-[4.75rem] w-full rounded-xl" />
        </div>
      </CardContent>
    </Card>
  );
}
