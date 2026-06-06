"use client";

import { cn } from "@/src/lib/cn";
import { dropdownOptionSizeClasses } from "@/src/components/ui/responsiveSizes";
import { formatBudgetAmount } from "./budget.utils";

export type BudgetSuggestionListProps = {
  values: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  className?: string;
  /** When true, panel is anchored below a field trigger (form row). When false, flows in a panel grid. */
  anchored?: boolean;
};

export function BudgetSuggestionList({
  values,
  selectedValue,
  onSelect,
  className,
  anchored = true,
}: BudgetSuggestionListProps) {
  if (values.length === 0) {
    return null;
  }

  return (
    <ul
      className={cn(
        "max-h-56 w-full overflow-y-auto rounded-xl border border-secondary/15 bg-surface py-1 shadow-lg ring-1 ring-black/5",
        "[scrollbar-width:thin] empty:hidden",
        anchored
          ? "absolute start-0 end-0 top-[calc(100%+0.25rem)] z-[100]"
          : "relative mt-1",
        className,
      )}
      role="listbox"
      onMouseDown={(event) => {
        event.preventDefault();
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
                "w-full text-start text-text transition-colors",
                dropdownOptionSizeClasses,
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
