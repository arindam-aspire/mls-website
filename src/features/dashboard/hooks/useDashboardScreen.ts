"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { getUnreadNotificationCount } from "@/src/features/notifications/services/notification.service";
import {
  getAdminPropertySubmissions,
  getAgentProperties,
} from "@/src/features/property/services/property.service";
import { UserRole } from "@/src/lib/auth/roles";
import { getAgencyList } from "@/src/features/profile/services/profile.service";

const DASHBOARD_PAGE_SIZE = 5;

export function useDashboardScreen() {
  const user = useAuthStore((state) => state.user);
  const roles = new Set(user?.roles?.map((role) => role.name) ?? []);
  const canReviewSubmissions =
    roles.has(UserRole.SUPER_ADMIN) || roles.has(UserRole.AGENCY);
  const isAgent = roles.has(UserRole.AGENT);

  const agenciesQuery = useQuery({
    queryKey: ["dashboard", "agencies"],
    queryFn: () => getAgencyList({ skip: 0, limit: 100 }),
    enabled: canReviewSubmissions,
  });

  const pendingSubmissionsQuery = useQuery({
    queryKey: ["dashboard", "property-submissions", "pending-approval"],
    queryFn: () =>
      getAdminPropertySubmissions({
        page: 1,
        pageSize: DASHBOARD_PAGE_SIZE,
        status: "pending-approval",
      }),
    enabled: canReviewSubmissions,
  });

  const activeSubmissionsQuery = useQuery({
    queryKey: ["dashboard", "property-submissions", "active"],
    queryFn: () =>
      getAdminPropertySubmissions({
        page: 1,
        pageSize: 1,
        status: "active",
      }),
    enabled: canReviewSubmissions,
  });

  const agentListingsQuery = useQuery({
    queryKey: ["dashboard", "agent-properties"],
    queryFn: () =>
      getAgentProperties({
        page: 1,
        pageSize: 1,
      }),
    enabled: isAgent && !canReviewSubmissions,
  });

  const notificationsQuery = useQuery({
    queryKey: ["dashboard", "notifications", "unread-count"],
    queryFn: getUnreadNotificationCount,
  });

  const isLoading =
    (canReviewSubmissions && agenciesQuery.isPending) ||
    (canReviewSubmissions && pendingSubmissionsQuery.isPending) ||
    (canReviewSubmissions && activeSubmissionsQuery.isPending) ||
    (isAgent && !canReviewSubmissions && agentListingsQuery.isPending) ||
    notificationsQuery.isPending;

  const errors = useMemo(
    () =>
      [
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
      pendingSubmissionsQuery.error,
      activeSubmissionsQuery.error,
      notificationsQuery.error,
    ],
  );

  return {
    isLoading,
    hasError: errors.length > 0,
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
