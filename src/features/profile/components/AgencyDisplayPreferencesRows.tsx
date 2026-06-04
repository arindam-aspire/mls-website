"use client";

import { Ruler, Wallet, type LucideIcon } from "lucide-react";
import { UpcomingFeatureModal } from "@/src/components/common/UpcomingFeatureModal";
import { cn } from "@/src/lib/cn";
import { useAgencyDisplayPreferencesRows } from "../hooks/useAgencyDisplayPreferencesRows";
import type {
  AgencyProfileCardDisplayPreferences,
  DisplayPreferenceOption,
} from "../types/profile.types";
import { DisplayPreferenceOptionCard } from "./DisplayPreferenceOptionCard";

type AgencyDisplayPreferencesRowsProps = {
  preferences: AgencyProfileCardDisplayPreferences;
};

const preferenceIconClassName = cn(
  "flex size-10 shrink-0 items-center justify-center rounded-lg",
  "bg-black/5 text-black/70 dark:bg-white/5 dark:text-white/70",
);

type DisplayPreferenceRowProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

function DisplayPreferenceRow({ icon: Icon, title, description }: DisplayPreferenceRowProps) {
  return (
    <div className="flex w-full items-start gap-3 py-3 sm:min-h-[3.75rem] sm:items-center">
      <div className={preferenceIconClassName}>
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 text-start">
        <p className="text-sm font-semibold text-text">{title}</p>
        <p className="mt-0.5 text-sm text-muted">{description}</p>
      </div>
    </div>
  );
}

type PreferenceOptionCardsProps<T extends string> = {
  title: string;
  value: T;
  options: DisplayPreferenceOption<T>[];
  onSelect: (value: T) => void;
  disabled: boolean;
  interactive: boolean;
  onUpcomingFeature: () => void;
};

function PreferenceOptionCards<T extends string>({
  title,
  value,
  options,
  onSelect,
  disabled,
  interactive,
  onUpcomingFeature,
}: PreferenceOptionCardsProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={title}
      className="grid grid-cols-1 gap-3 pb-1 sm:grid-cols-2"
    >
      {options.map((option) => (
        <DisplayPreferenceOptionCard
          key={option.value}
          code={option.code}
          name={option.name}
          symbol={option.symbol}
          selected={value === option.value}
          disabled={disabled}
          onSelect={() => {
            if (disabled) return;
            if (!interactive) {
              onUpcomingFeature();
              return;
            }
            onSelect(option.value as T);
          }}
          ariaLabel={`${option.code} — ${option.name}`}
        />
      ))}
    </div>
  );
}

export function AgencyDisplayPreferencesRows({
  preferences,
}: AgencyDisplayPreferencesRowsProps) {
  const { currency, measurementUnit } = preferences;
  const { upcomingFeatureModal, openUpcomingFeatureModal } =
    useAgencyDisplayPreferencesRows();

  const currencyDisabled = currency.disabled || currency.isUpdating;
  const measurementDisabled = measurementUnit.disabled || measurementUnit.isUpdating;

  return (
    <>
      <div className="mt-4 space-y-4 sm:mt-5">
        <div
          className={cn(currencyDisabled && "opacity-60")}
          aria-busy={currency.isUpdating || undefined}
        >
          <DisplayPreferenceRow
            icon={Wallet}
            title={currency.title}
            description={currency.description}
          />
          <PreferenceOptionCards
            title={currency.title}
            value={currency.value}
            options={currency.options}
            onSelect={currency.onSelect}
            disabled={currencyDisabled}
            interactive={currency.interactive}
            onUpcomingFeature={openUpcomingFeatureModal}
          />
        </div>

        <div
          className={cn(measurementDisabled && "opacity-60")}
          aria-busy={measurementUnit.isUpdating || undefined}
        >
          <DisplayPreferenceRow
            icon={Ruler}
            title={measurementUnit.title}
            description={measurementUnit.description}
          />
          <PreferenceOptionCards
            title={measurementUnit.title}
            value={measurementUnit.value}
            options={measurementUnit.options}
            onSelect={measurementUnit.onSelect}
            disabled={measurementDisabled}
            interactive={measurementUnit.interactive}
            onUpcomingFeature={openUpcomingFeatureModal}
          />
        </div>
      </div>

      <UpcomingFeatureModal
        open={upcomingFeatureModal.open}
        onClose={upcomingFeatureModal.onClose}
        title={upcomingFeatureModal.title}
        subtitle={upcomingFeatureModal.subtitle}
        description={upcomingFeatureModal.description}
        dismissLabel={upcomingFeatureModal.dismissLabel}
      />
    </>
  );
}
