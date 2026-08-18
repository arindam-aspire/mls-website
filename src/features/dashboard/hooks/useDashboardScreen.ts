"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import type { ApiError } from "@/src/apis/core/error.normalizer";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { getUnreadNotificationCount } from "@/src/features/notifications/services/notification.service";
import {
  getAdminPropertySubmissions,
  getAgentProperties,
} from "@/src/features/property/services/property.service";
import { UserRole } from "@/src/lib/auth/roles";
import { getAgencyList } from "@/src/features/profile/services/profile.service";
import { useToast } from "@/src/hooks/useToast";
import type { DashboardKpiMetric } from "../components/DashboardKpiCards";
import { getDashboardSummary } from "../services/dashboard.service";

const DASHBOARD_PAGE_SIZE = 5;
const WORKFLOW_QUEUE_STATUSES = ["submitted", "agent-assigned", "pending-approval"] as const;

export function useDashboardScreen() {
  const t = useTranslations("dashboard");
  const toast = useToast();
  const user = useAuthStore((state) => state.user);
  const roles = useMemo(
    () => new Set(user?.roles?.map((role) => role.name) ?? []),
    [user?.roles],
  );
  const isSuperAdmin = roles.has(UserRole.SUPER_ADMIN);
  const canReviewSubmissions =
    roles.has(UserRole.SUPER_ADMIN) || roles.has(UserRole.AGENCY);
  const isAgent = roles.has(UserRole.AGENT);

  const summaryQuery = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummary,
    enabled: isSuperAdmin,
  });

  const agenciesQuery = useQuery({
    queryKey: ["dashboard", "agencies"],
    queryFn: () => getAgencyList({ skip: 0, limit: 100 }),
    enabled: canReviewSubmissions && !isSuperAdmin,
  });

  const pendingSubmissionsQuery = useQuery({
    queryKey: ["dashboard", "property-submissions", "workflow-queue"],
    queryFn: async () => {
      const responses = await Promise.all(
        WORKFLOW_QUEUE_STATUSES.map((status) =>
          getAdminPropertySubmissions({
            page: 1,
            pageSize: DASHBOARD_PAGE_SIZE,
            status,
          }),
        ),
      );
      const items = responses.flatMap((response) => response.data?.items ?? []);
      const total = responses.reduce(
        (sum, response) => sum + (response.data?.total ?? 0),
        0,
      );

      return {
        data: {
          items: items.slice(0, DASHBOARD_PAGE_SIZE),
          total,
        },
      };
    },
    enabled: canReviewSubmissions && !isSuperAdmin,
  });

  const activeSubmissionsQuery = useQuery({
    queryKey: ["dashboard", "property-submissions", "active"],
    queryFn: () =>
      getAdminPropertySubmissions({
        page: 1,
        pageSize: 1,
        status: "active",
      }),
    enabled: canReviewSubmissions && !isSuperAdmin,
  });

  const agentListingsQuery = useQuery({
    queryKey: ["dashboard", "agent-properties"],
    queryFn: () =>
      getAgentProperties({
        page: 1,
        pageSize: 1,
      }),
    enabled: isAgent && !canReviewSubmissions && !isSuperAdmin,
  });

  const notificationsQuery = useQuery({
    queryKey: ["dashboard", "notifications", "unread-count"],
    queryFn: getUnreadNotificationCount,
    enabled: !isSuperAdmin,
  });

  const isLoading =
    (isSuperAdmin && summaryQuery.isPending) ||
    (!isSuperAdmin &&
      ((canReviewSubmissions && agenciesQuery.isPending) ||
        (canReviewSubmissions && pendingSubmissionsQuery.isPending) ||
        (canReviewSubmissions && activeSubmissionsQuery.isPending) ||
        (isAgent && !canReviewSubmissions && agentListingsQuery.isPending) ||
        notificationsQuery.isPending));

  const errors = useMemo(
    () =>
      [
        isSuperAdmin ? summaryQuery.error : null,
        canReviewSubmissions ? agenciesQuery.error : null,
        canReviewSubmissions ? pendingSubmissionsQuery.error : null,
        canReviewSubmissions ? activeSubmissionsQuery.error : null,
        isAgent && !canReviewSubmissions ? agentListingsQuery.error : null,
        notificationsQuery.error,
      ].filter(Boolean),
    [
      agenciesQuery.error,
      agentListingsQuery.error,
      canReviewSubmissions,
      isAgent,
      isSuperAdmin,
      pendingSubmissionsQuery.error,
      activeSubmissionsQuery.error,
      notificationsQuery.error,
      summaryQuery.error,
    ],
  );

  const kpiMetrics = useMemo<DashboardKpiMetric[]>(() => {
    const summary = summaryQuery.data;

    if (!summary) {
      return [];
    }

    return [
      {
        id: "totalRegisteredUsers",
        label: t("kpi.totalRegisteredUsers"),
        value: summary.totalRegisteredUsers,
        trend: summary.registerUsersMoMDelta,
      },
      {
        id: "totalAgents",
        label: t("kpi.totalAgents"),
        value: summary.totalAgents,
        trend: summary.agentsMoMDelta,
      },
      {
        id: "totalAdmins",
        label: t("kpi.totalAdmins"),
        value: summary.totalAdmins,
      },
      {
        id: "pendingApprovals",
        label: t("kpi.pendingApprovals"),
        value: summary.pendingApprovals,
      },
      {
        id: "listingsThisMonth",
        label: t("kpi.listingsThisMonth"),
        value: summary.listingsThisMonth,
        trend: summary.listingsMoMDelta,
      },
      {
        id: "leadsThisMonth",
        label: t("kpi.leadsThisMonth"),
        value: summary.leadsThisMonth,
        trend: summary.leadsMoMDelta,
      },
      {
        id: "closedDeals",
        label: t("kpi.closedDeals"),
        value: summary.closedDeals,
      },
    ];
  }, [summaryQuery.data, t]);

  useEffect(() => {
    if (!summaryQuery.isError) {
      return;
    }

    const apiError = summaryQuery.error as unknown as ApiError;
    toast.error(t("error.title"), {
      description: apiError.message,
    });
  }, [summaryQuery.error, summaryQuery.isError, t, toast]);

  return {
    isLoading,
    hasError: errors.length > 0,
    isSummaryDashboard: isSuperAdmin,
    summary: summaryQuery.data,
    kpiMetrics,
    canReviewSubmissions,
    isAgent,
    agencyCount: agenciesQuery.data?.total ?? 0,
    agencies: agenciesQuery.data?.items ?? [],
    pendingSubmissions: pendingSubmissionsQuery.data?.data?.items ?? [],
    pendingSubmissionCount: pendingSubmissionsQuery.data?.data?.total ?? 0,
    activePropertyCount: canReviewSubmissions
      ? (activeSubmissionsQuery.data?.data?.total ?? 0)
      : (agentListingsQuery.data?.data?.total ?? 0),
    unreadNotificationCount: notificationsQuery.data?.data?.unreadCount ?? 0,
  };
}
