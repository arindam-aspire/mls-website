"use client";

import { useMemo, useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  buttonSizeClasses,
  fieldControlSizeClasses,
} from "@/src/components/ui/responsiveSizes";
import { cn } from "@/src/lib/cn";
import { controlTextClasses, overlineLabelClasses } from "@/src/lib/typography";
import { BudgetSuggestionList } from "./BudgetSuggestionList";
import {
  BUY_BUDGET_SUGGESTIONS,
  filterMaxSuggestions,
  filterMinSuggestions,
  handleMaxChange,
  handleMinChange,
  preventNegativeInput,
} from "./budget.utils";
import type { BudgetRangeInputsProps } from "./types";

const inputClasses = cn(
  fieldControlSizeClasses.sm,
  "h-9 w-full rounded-lg border border-secondary/15 bg-surface outline-none",
  "placeholder:text-muted/70",
  "focus:border-secondary focus:ring-2 focus:ring-secondary/20",
);

export function BudgetRangeInputs({
  minBudget,
  maxBudget,
  onChangeMin,
  onChangeMax,
  onDone,
  onReset,
  minLabel = "Minimum",
  maxLabel = "Maximum",
  maxPlaceholder = "400000",
  suggestions = BUY_BUDGET_SUGGESTIONS,
  variant = "dropdown",
}: BudgetRangeInputsProps) {
  const [activeField, setActiveField] = useState<"min" | "max" | null>(null);
  const isSheet = variant === "sheet";

  const minSuggestions = useMemo(
    () => filterMinSuggestions(suggestions, maxBudget),
    [maxBudget, suggestions],
  );

  const maxSuggestions = useMemo(
    () => filterMaxSuggestions(suggestions, minBudget),
    [minBudget, suggestions],
  );

  return (
    <div
      className={cn(
        controlTextClasses.md,
        isSheet
          ? "px-4 pb-6 pt-3 sm:px-6"
          : "rounded-xl border border-secondary/15 bg-surface p-3 shadow-xl ring-1 ring-black/5",
      )}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          setActiveField(null);
        }
      }}
    >
      <div
        className="grid grid-cols-2 items-start gap-3"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="relative min-w-0 self-start">
          <label htmlFor="budget-min-input" className={overlineLabelClasses}>
            {minLabel}
          </label>
          <input
            id="budget-min-input"
            type="number"
            inputMode="numeric"
            min={0}
            value={minBudget}
            placeholder="0"
            className={inputClasses}
            onFocus={() => {
              setActiveField("min");
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            onKeyDown={preventNegativeInput}
            onChange={(event) => {
              handleMinChange(event.target.value, maxBudget, onChangeMin);
            }}
          />
          {activeField === "min" && (
            <BudgetSuggestionList
              anchored={false}
              values={minSuggestions}
              selectedValue={minBudget}
              onSelect={(nextValue) => {
                onChangeMin(nextValue);
                setActiveField(null);
              }}
            />
          )}
        </div>

        <div className="relative min-w-0 self-start">
          <label htmlFor="budget-max-input" className={overlineLabelClasses}>
            {maxLabel}
          </label>
          <input
            id="budget-max-input"
            type="number"
            inputMode="numeric"
            min={0}
            value={maxBudget}
            placeholder={maxPlaceholder}
            className={inputClasses}
            onFocus={() => {
              setActiveField("max");
            }}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            onKeyDown={preventNegativeInput}
            onChange={(event) => {
              handleMaxChange(event.target.value, minBudget, onChangeMax);
            }}
          />
          {activeField === "max" && (
            <BudgetSuggestionList
              anchored={false}
              values={maxSuggestions}
              selectedValue={maxBudget}
              onSelect={(nextValue) => {
                onChangeMax(nextValue);
                setActiveField(null);
              }}
            />
          )}
        </div>
      </div>

      <div
        className="mt-3 flex items-center justify-between gap-2"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <Button
          type="button"
          color="inherit"
          variant="outline"
          size="sm"
          className={cn(buttonSizeClasses.sm, "rounded-lg uppercase tracking-wide")}
          onClick={(event) => {
            event.stopPropagation();
            onReset();
            setActiveField(null);
          }}
        >
          Reset
        </Button>
        <Button
          type="button"
          color="tertiary"
          variant="solid"
          size="sm"
          className={cn(buttonSizeClasses.sm, "rounded-lg uppercase tracking-wide")}
          onClick={(event) => {
            event.stopPropagation();
            onDone();
          }}
        >
          Done
        </Button>
      </div>
    </div>
  );
}
