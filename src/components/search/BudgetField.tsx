"use client";

import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ChevronDown, X } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/src/lib/cn";
import {
  buttonIconSizeClasses,
  fieldControlSizeClasses,
} from "@/src/components/ui/responsiveSizes";
import {
  controlTextClasses,
  currencyBadgeTextClasses,
  sheetTitleClasses,
} from "@/src/lib/typography";
import { useMatchMedia } from "@/src/hooks/useMatchMedia";
import { AnchoredDropdown } from "./AnchoredDropdown";
import { BudgetRangeInputs } from "./BudgetRangeInputs";
import {
  BUY_BUDGET_SUGGESTIONS,
  formatBudgetLabel,
  RENT_BUDGET_SUGGESTIONS,
} from "./budget.utils";
import type { BudgetFieldProps } from "./types";

export function BudgetField({
  min,
  max,
  onChangeMin,
  onChangeMax,
  isOpen,
  onToggle,
  onClose,
  onCommit,
  onReset,
  placeholder = "Select budget",
  currencyCode = "JD",
  isRtl = false,
  rentMode = false,
  minFallbackLabel = "Min",
  maxFallbackLabel = "Max",
  disabled = false,
  className,
  "aria-label": ariaLabel = "Budget",
}: BudgetFieldProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const isMobileSheet = useMatchMedia("(max-width: 767px)");
  const hasValue = Boolean(min || max);
  const label = formatBudgetLabel(
    min,
    max,
    placeholder,
    minFallbackLabel,
    maxFallbackLabel,
  );

  const suggestions = rentMode
    ? RENT_BUDGET_SUGGESTIONS
    : BUY_BUDGET_SUGGESTIONS;

  const maxPlaceholder = rentMode ? "5000" : "400000";
  const sheetTitle = ariaLabel;

  const budgetInputs = (
    <BudgetRangeInputs
      minBudget={min}
      maxBudget={max}
      onChangeMin={onChangeMin}
      onChangeMax={onChangeMax}
      onReset={onReset}
      onDone={() => {
        onCommit();
        onClose();
      }}
      minLabel={rentMode ? "Yearly Min" : undefined}
      maxLabel={rentMode ? "Yearly Max" : undefined}
      maxPlaceholder={maxPlaceholder}
      suggestions={suggestions}
      variant={isMobileSheet ? "sheet" : "dropdown"}
    />
  );

  return (
    <div
      className={cn("relative min-w-0", className)}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <button
        suppressHydrationWarning
        ref={triggerRef}
        type="button"
        title={label}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        disabled={disabled}
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg border bg-surface px-2.5 transition-colors sm:px-4",
          fieldControlSizeClasses.md,
          "border-secondary/15 hover:border-secondary/60",
          hasValue ? "font-medium text-text" : "font-normal text-muted",
          isOpen && "border-secondary ring-2 ring-secondary/20",
          isRtl && "flex-row-reverse",
          disabled && "cursor-not-allowed opacity-50",
        )}
      >
        <span
          className={cn(
            "inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-page text-secondary",
            currencyBadgeTextClasses,
          )}
        >
          {currencyCode}
        </span>
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-start",
            controlTextClasses.md,
          )}
        >
          {label}
        </span>
        <ChevronDown
          className={cn(
            "shrink-0 text-muted transition-transform",
            buttonIconSizeClasses.md,
            isOpen && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {!isMobileSheet ? (
        <AnchoredDropdown
          isOpen={isOpen}
          onClose={onClose}
          align={isRtl ? "right" : "left"}
          anchorRef={triggerRef}
          minPanelWidth={300}
        >
          {budgetInputs}
        </AnchoredDropdown>
      ) : null}

      {isMobileSheet ? (
        <Dialog
          open={isOpen}
          onClose={onClose}
          transition
          className="relative z-[80]"
        >
          <DialogBackdrop
            transition
            className={cn(
              "fixed inset-0 bg-black/65 transition-opacity",
              "data-closed:opacity-0 data-enter:opacity-100 data-leave:opacity-0",
            )}
          />

          <div className="fixed inset-0 z-[80] flex items-end justify-center">
            <DialogPanel
              transition
              className={cn(
                "flex max-h-[min(90dvh,100%)] w-full flex-col overflow-hidden rounded-t-xl border border-b-0 border-secondary/15 bg-surface text-text shadow-lg",
                "transition duration-300 ease-out",
                "data-closed:translate-y-full data-enter:translate-y-0 data-leave:translate-y-full",
              )}
            >
              <div className="relative shrink-0 border-b border-secondary/15">
                <div className="flex justify-center pt-2" aria-hidden>
                  <div className="h-1 w-10 rounded-full bg-secondary/25" />
                </div>
                <div className="relative px-4 py-3 sm:px-6">
                  <DialogTitle className={cn("pe-12", sheetTitleClasses)}>
                    {sheetTitle}
                  </DialogTitle>
                  <CloseButton
                    type="button"
                    aria-label="Close budget"
                    className="absolute end-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-lg text-muted transition-colors hover:bg-page hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 sm:end-5"
                  >
                    <X className="size-5" aria-hidden />
                  </CloseButton>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
                {budgetInputs}
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      ) : null}
    </div>
  );
}
