export type DashboardTrendMetric =
  | "registeredUsers"
  | "agents"
  | "listings"
  | "leads";

export type DashboardActivityTone = "default" | "info" | "success" | "warning" | "error";

export type DashboardAlertSeverity = "warning" | "info" | "error" | "success";

export interface DashboardRecentActivity {
  id?: string;
  icon: string;
  text: string;
  relativeTime: string;
  tone: DashboardActivityTone;
}

export interface DashboardHealthAlert {
  id?: string;
  title: string;
  message: string;
  severity: DashboardAlertSeverity;
}

export interface DashboardSummaryData {
  totalRegisteredUsers: number;
  totalAgents: number;
  totalAdmins: number;
  pendingApprovals: number;
  listingsThisMonth: number;
  leadsThisMonth: number;
  closedDeals: number;
  registerUsersMoMDelta: number;
  agentsMoMDelta: number;
  listingsMoMDelta: number;
  leadsMoMDelta: number;
  monthLabels: string[];
  userGrowthSeries: number[];
  listingGrowthSeries: number[];
  leadGrowthSeries: number[];
  leadSourceLabels: string[];
  leadSourceValues: number[];
  recentActivities: DashboardRecentActivity[];
  healthAlerts: DashboardHealthAlert[];
}

export interface DashboardSummaryResponse {
  success: boolean;
  message: string | null;
  data: DashboardSummaryData | null;
  error?: unknown;
  meta: null;
}
