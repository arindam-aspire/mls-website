import type { BudgetSelectOption } from "./types";
import { BUDGET_SELECT_EMPTY_VALUE } from "./types";

export function encodeBudgetRange(min?: number, max?: number) {
  if (min == null && max == null) {
    return BUDGET_SELECT_EMPTY_VALUE;
  }

  return `${min ?? ""}:${max ?? ""}`;
}

export function decodeBudgetRange(value: string) {
  if (!value || value === BUDGET_SELECT_EMPTY_VALUE) {
    return { min: undefined, max: undefined };
  }

  const [minValue, maxValue] = value.split(":");

  return {
    min: minValue ? Number(minValue) : undefined,
    max: maxValue ? Number(maxValue) : undefined,
  };
}

export function resolveBudgetRangeValue(
  min: number | undefined,
  max: number | undefined,
  options: BudgetSelectOption[],
) {
  const encoded = encodeBudgetRange(min, max);

  if (options.some((option) => option.value === encoded)) {
    return encoded;
  }

  return BUDGET_SELECT_EMPTY_VALUE;
}

export function formatBudgetAmount(amount: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(amount);
}
