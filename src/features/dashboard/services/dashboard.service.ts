import { apiClient } from "@/src/apis/clients/api.client";
import { dashboardEndpoints } from "@/src/apis/endpoints/dashboardEndpoints";
import type {
  DashboardSummaryData,
  DashboardSummaryResponse,
} from "../types/dashboard.types";

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

export async function getDashboardSummary(): Promise<DashboardSummaryData> {
  const response = await apiClient.request<DashboardSummaryResponse>({
    endpoint: dashboardEndpoints.SUMMARY,
    method: "GET",
    auth: true,
  });

  return response.data ?? EMPTY_DASHBOARD_SUMMARY;
}
