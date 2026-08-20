import { apiClient } from "@/src/apis/clients/api.client";
import { dashboardEndpoints } from "@/src/apis/endpoints/dashboardEndpoints";
import type {
  DashboardHealthAlert,
  DashboardSummaryData,
  DashboardSummaryResponse,
} from "../types/dashboard.types";
import { normalizeDashboardAlertSeverity } from "../utils/normalizeDashboardAlertSeverity";

export const EMPTY_DASHBOARD_SUMMARY: DashboardSummaryData = {
  totalRegisteredUsers: 0,
  totalAgents: 0,
  totalAdmins: 0,
  pendingApprovals: 0,
  listingsThisMonth: 0,
  leadsThisMonth: 0,
  closedDeals: 0,
  registerUsersMoMDelta: 0,
  agentsMoMDelta: 0,
  listingsMoMDelta: 0,
  leadsMoMDelta: 0,
  monthLabels: [],
  userGrowthSeries: [],
  listingGrowthSeries: [],
  leadGrowthSeries: [],
  leadSourceLabels: [],
  leadSourceValues: [],
  recentActivities: [],
  healthAlerts: [],
};

function normalizeHealthAlerts(
  alerts: DashboardHealthAlert[] | null | undefined,
): DashboardHealthAlert[] {
  if (!Array.isArray(alerts)) return [];

  return alerts.filter(Boolean).map((alert) => ({
    ...alert,
    severity: normalizeDashboardAlertSeverity(alert.severity),
  }));
}

export async function getDashboardSummary(): Promise<DashboardSummaryData> {
  const response = await apiClient.request<DashboardSummaryResponse>({
    endpoint: dashboardEndpoints.SUMMARY,
    method: "GET",
    auth: true,
  });

  const data = response.data ?? EMPTY_DASHBOARD_SUMMARY;

  return {
    ...data,
    healthAlerts: normalizeHealthAlerts(data.healthAlerts),
  };
}
