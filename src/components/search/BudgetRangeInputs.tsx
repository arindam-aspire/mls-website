"use client";

import { useMemo, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/cn";
import {
  BUY_BUDGET_SUGGESTIONS,
  formatBudgetAmount,
  filterMaxSuggestions,
  filterMinSuggestions,
  handleMaxChange,
  handleMinChange,
  preventNegativeInput,
} from "./budget.utils";
import type { BudgetRangeInputsProps } from "./types";

const inputClasses = cn(
  "h-9 w-full rounded-lg border border-secondary/15 bg-surface px-2.5 text-xs text-text outline-none",
  "placeholder:text-muted/70",
  "focus:border-secondary focus:ring-2 focus:ring-secondary/20",
);

const labelClasses =
  "mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-text/70";

function SuggestionList({
  values,
  selectedValue,
  onSelect,
}: {
  values: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}) {
  if (values.length === 0) {
    return null;
  }

  return (
    <ul
      className="mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-secondary/15 bg-surface py-1 shadow-xl ring-1 ring-black/5"
      role="listbox"
      onMouseDown={(event) => {
        event.stopPropagation();
      }}
    >
      {values.map((value) => {
        const isSelected = selectedValue === value;

        return (
          <li key={value}>
            <button
              type="button"
              role="option"
              aria-selected={isSelected}
              className={cn(
                "w-full px-2.5 py-1.5 text-start text-xs text-text transition-colors",
                "hover:bg-page focus:bg-page focus:outline-none",
                isSelected && "bg-page font-medium text-secondary-dark",
              )}
              onMouseDown={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onSelect(value);
              }}
            >
              {formatBudgetAmount(value)}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

const panelButtonClassName = cn(
  "rounded-lg uppercase tracking-wide",
  "h-7 px-2 text-[11px] sm:h-8 sm:px-2.5 sm:text-xs lg:h-8 lg:px-2.5",
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
        "text-xs",
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
          <label htmlFor="budget-min-input" className={labelClasses}>
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
            <SuggestionList
              values={minSuggestions}
              selectedValue={minBudget}
              onSelect={(value) => {
                onChangeMin(value);
                setActiveField(null);
              }}
            />
          )}
        </div>

        <div className="relative min-w-0 self-start">
          <label htmlFor="budget-max-input" className={labelClasses}>
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
            <SuggestionList
              values={maxSuggestions}
              selectedValue={maxBudget}
              onSelect={(value) => {
                onChangeMax(value);
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
          className={panelButtonClassName}
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
          className={panelButtonClassName}
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
