import type { DashboardAlertSeverity } from "../types/dashboard.types";

const SEVERITY_ALIASES: Record<string, DashboardAlertSeverity> = {
  warning: "warning",
  info: "info",
  error: "error",
  danger: "error",
  critical: "error",
  success: "success",
};

/** Maps API severity strings (any case/alias) onto the dashboard union. */
export function normalizeDashboardAlertSeverity(
  value: unknown,
): DashboardAlertSeverity {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase();
  return SEVERITY_ALIASES[raw] ?? "info";
}
