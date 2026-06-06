import type { KeyboardEvent } from "react";

export const BUY_BUDGET_SUGGESTIONS = [
  "0",
  "200000",
  "225000",
  "250000",
  "275000",
  "300000",
  "350000",
  "400000",
] as const;

export const RENT_BUDGET_SUGGESTIONS = [
  "0",
  "300",
  "500",
  "800",
  "1200",
  "2000",
  "3000",
  "5000",
] as const;

export function sanitizeBudgetValue(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function formatBudgetAmount(value: string) {
  if (!value) {
    return "";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function formatBudgetLabel(
  min: string,
  max: string,
  placeholder: string,
  minFallback: string,
  maxFallback: string,
): string {
  if (!min && !max) {
    return placeholder;
  }

  const minLabel = min ? formatBudgetAmount(min) : minFallback;
  const maxLabel = max ? formatBudgetAmount(max) : maxFallback;

  return `${minLabel} - ${maxLabel}`;
}

export function handleMinChange(
  raw: string,
  max: string,
  setMin: (value: string) => void,
) {
  const next = sanitizeBudgetValue(raw);

  if (next === "") {
    setMin("");
    return;
  }

  if (max !== "" && Number(next) > Number(max)) {
    setMin(max);
    return;
  }

  setMin(next);
}

export function handleMaxChange(
  raw: string,
  min: string,
  setMax: (value: string) => void,
) {
  const next = sanitizeBudgetValue(raw);

  if (next === "") {
    setMax("");
    return;
  }

  if (min !== "" && Number(next) < Number(min)) {
    setMax(min);
    return;
  }

  setMax(next);
}

export function preventNegativeInput(event: KeyboardEvent) {
  if (event.key === "-" || event.key === "Subtract") {
    event.preventDefault();
  }
}

export function filterMinSuggestions(
  suggestions: readonly string[],
  max: string,
) {
  if (max === "") {
    return [...suggestions];
  }

  const maxNum = Number(max);

  return suggestions.filter(
    (value) => Number(value) < maxNum && value !== max,
  );
}

export function filterMaxSuggestions(
  suggestions: readonly string[],
  min: string,
) {
  if (min === "") {
    return [...suggestions];
  }

  const minNum = Number(min);

  return suggestions.filter(
    (value) => Number(value) > minNum && value !== min,
  );
}

export function filterBudgetSuggestionsByQuery(
  suggestions: readonly string[],
  query: string,
) {
  const sanitized = sanitizeBudgetValue(query);

  if (!sanitized) {
    return [...suggestions];
  }

  return suggestions.filter(
    (value) =>
      value.startsWith(sanitized) ||
      formatBudgetAmount(value).replace(/,/g, "").includes(sanitized),
  );
}

export function getInitialBudgetMin(searchParams: URLSearchParams): string {
  return (
    searchParams.get("budgetMin")?.trim() ??
    searchParams.get("minPrice")?.trim() ??
    ""
  );
}

export function getInitialBudgetMax(searchParams: URLSearchParams): string {
  return (
    searchParams.get("budgetMax")?.trim() ??
    searchParams.get("maxPrice")?.trim() ??
    ""
  );
}
