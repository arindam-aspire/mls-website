import type { BudgetSelectOption } from "./types";
import { formatBudgetAmount } from "./utils";

function upTo(max: number): BudgetSelectOption {
  return {
    value: `:${max}`,
    label: `Up to ${formatBudgetAmount(max)}`,
    max,
  };
}

function between(min: number, max: number): BudgetSelectOption {
  return {
    value: `${min}:${max}`,
    label: `${formatBudgetAmount(min)} - ${formatBudgetAmount(max)}`,
    min,
    max,
  };
}

function from(min: number): BudgetSelectOption {
  return {
    value: `${min}:`,
    label: `${formatBudgetAmount(min)}+`,
    min,
  };
}

export const BUY_BUDGET_OPTIONS: BudgetSelectOption[] = [
  upTo(50_000),
  between(50_000, 100_000),
  between(100_000, 150_000),
  between(150_000, 200_000),
  between(200_000, 300_000),
  between(300_000, 500_000),
  from(500_000),
];

export const RENT_BUDGET_OPTIONS: BudgetSelectOption[] = [
  upTo(300),
  between(300, 500),
  between(500, 800),
  between(800, 1_200),
  between(1_200, 2_000),
  from(2_000),
];
