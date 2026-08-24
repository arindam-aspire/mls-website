import { apiClient } from "@/src/apis/clients/api.client";
import { dashboardEndpoints } from "@/src/apis/endpoints/dashboardEndpoints";
import type {
  DashboardHealthAlert,
  DashboardRecentActivity,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSummaryResponse(raw: any): DashboardSummaryData {
  if (!raw || typeof raw !== "object") return EMPTY_DASHBOARD_SUMMARY;

  const num = (v: unknown) => (typeof v === "number" ? v : 0);
  const arr = (v: unknown) => (Array.isArray(v) ? v : []);

  return {
    totalRegisteredUsers: num(raw.totalRegisteredUsers ?? raw.total_registered_users),
    totalAgents: num(raw.totalAgents ?? raw.total_agents),
    totalAdmins: num(raw.totalAdmins ?? raw.total_admins),
    pendingApprovals: num(raw.pendingApprovals ?? raw.pending_approvals),
    listingsThisMonth: num(raw.listingsThisMonth ?? raw.listings_this_month),
    leadsThisMonth: num(raw.leadsThisMonth ?? raw.leads_this_month),
    closedDeals: num(raw.closedDeals ?? raw.closed_deals),
    registerUsersMoMDelta: normalizeDelta(raw.registerUsersMoMDelta ?? raw.register_users_mom_delta),
    agentsMoMDelta: normalizeDelta(raw.agentsMoMDelta ?? raw.agents_mom_delta),
    listingsMoMDelta: normalizeDelta(raw.listingsMoMDelta ?? raw.listings_mom_delta),
    leadsMoMDelta: normalizeDelta(raw.leadsMoMDelta ?? raw.leads_mom_delta),
    monthLabels: arr(raw.monthLabels ?? raw.month_labels) as string[],
    userGrowthSeries: arr(raw.userGrowthSeries ?? raw.user_growth_series) as number[],
    listingGrowthSeries: arr(raw.listingGrowthSeries ?? raw.listing_growth_series) as number[],
    leadGrowthSeries: arr(raw.leadGrowthSeries ?? raw.lead_growth_series) as number[],
    leadSourceLabels: arr(raw.leadSourceLabels ?? raw.lead_source_labels) as string[],
    leadSourceValues: arr(raw.leadSourceValues ?? raw.lead_source_values) as number[],
    recentActivities: arr(raw.recentActivities ?? raw.recent_activities) as DashboardRecentActivity[],
    healthAlerts: normalizeHealthAlerts(raw.healthAlerts ?? raw.health_alerts),
  };
}

function normalizeDelta(value: unknown): number {
  if (typeof value !== "number") return 0;
  // If the API returns a decimal ratio (e.g. 0.15 for 15%), convert to percentage
  if (Math.abs(value) > 0 && Math.abs(value) < 1) {
    return value * 100;
  }
  return value;
}

export async function getDashboardSummary(): Promise<DashboardSummaryData> {
  const response = await apiClient.request<DashboardSummaryResponse>({
    endpoint: dashboardEndpoints.SUMMARY,
    method: "GET",
    auth: true,
  });

  return mapSummaryResponse(response.data);
}
