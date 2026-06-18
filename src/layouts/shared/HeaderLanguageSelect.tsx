"use client";

import {
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@/src/components/ui/popover";
import { useClose } from "@headlessui/react";
import type { AppLocale } from "@/src/i18n/routing";
import { localeDisplayCode, localeFlagUrl } from "@/src/i18n/localeFlags";
import { cn } from "@/src/lib/cn";
import { controlTextClasses } from "@/src/lib/typography";
import type { HeaderLanguageOption } from "./buildHeaderLocaleOptions";

export type HeaderLanguageSelectProps = {
  value: AppLocale;
  options: HeaderLanguageOption[];
  onChange: (locale: AppLocale) => void;
  ariaLabel: string;
  className?: string;
  /** Landing header: light-on-image treatment over hero. */
  overHero?: boolean;
};

function LocaleFlag({
  locale,
  size = "md",
  className,
}: {
  locale: AppLocale;
  size?: "sm" | "md";
  className?: string;
}) {
  const dimension = size === "sm" ? 20 : 24;

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full bg-page",
        size === "sm" ? "size-5" : "size-6",
        className,
      )}
    >
      <img
        src={localeFlagUrl(locale)}
        alt=""
        width={dimension}
        height={dimension}
        className="size-full object-cover"
        aria-hidden
      />
    </span>
  );
}

function LanguageMenuItem({
  option,
  isSelected,
  onSelect,
}: {
  option: HeaderLanguageOption;
  isSelected: boolean;
  onSelect: (locale: AppLocale) => void;
}) {
  const close = useClose();

  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={isSelected}
      onClick={() => {
        onSelect(option.value);
        close();
      }}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start transition-colors",
        "outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        isSelected
          ? "bg-primary-light/60 dark:bg-primary/15"
          : "hover:bg-inherit-color/10",
      )}
    >
      <LocaleFlag locale={option.value} size="md" />
      <span className={cn("min-w-0 flex-1 text-sm text-text", controlTextClasses.md)}>
        {option.label}
      </span>
    </button>
  );
}

export function HeaderLanguageSelect({
  value,
  options,
  onChange,
  ariaLabel,
  className,
  overHero = false,
}: HeaderLanguageSelectProps) {
  const activeOption = options.find((option) => option.value === value) ?? options[0];

  return (
    <Popover className={cn("relative shrink-0", className)}>
      <PopoverButton
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border-0 bg-transparent px-1 py-1 shadow-none",
          overHero
            ? "text-white hover:bg-white/10 data-active:bg-white/10 focus-visible:ring-white/40"
            : "text-muted hover:bg-inherit-color/10 hover:text-text data-active:bg-inherit-color/10 data-active:text-text focus-visible:ring-secondary/40",
          "focus-visible:ring-2",
        )}
        aria-label={ariaLabel}
      >
        {activeOption ? (
          <>
            <LocaleFlag locale={activeOption.value} size="sm" />
            <span
              className={cn(
                "font-medium uppercase tracking-wide",
                overHero ? "text-white" : "text-muted",
                controlTextClasses.sm,
              )}
            >
              {localeDisplayCode(activeOption.value)}
            </span>
          </>
        ) : null}
      </PopoverButton>

      <PopoverPanel anchor="bottom end" className="min-w-52 !p-1.5">
        <ul role="menu" aria-label={ariaLabel} className="flex flex-col gap-0.5">
          {options.map((option) => (
            <li key={option.value} role="none">
              <LanguageMenuItem
                option={option}
                isSelected={option.value === value}
                onSelect={onChange}
              />
            </li>
          ))}
        </ul>
      </PopoverPanel>
    </Popover>
  );
}
