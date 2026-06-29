"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { getUnreadNotificationCount } from "@/src/features/notifications/services/notification.service";
import { getAdminPropertySubmissions } from "@/src/features/property/services/property.service";
import { getAgencyList } from "@/src/features/profile/services/profile.service";

const DASHBOARD_PAGE_SIZE = 5;

export function useDashboardScreen() {
  const agenciesQuery = useQuery({
    queryKey: ["dashboard", "agencies"],
    queryFn: () => getAgencyList({ skip: 0, limit: 100 }),
  });

  const pendingSubmissionsQuery = useQuery({
    queryKey: ["dashboard", "property-submissions", "pending-approval"],
    queryFn: () =>
      getAdminPropertySubmissions({
        page: 1,
        pageSize: DASHBOARD_PAGE_SIZE,
        status: "pending-approval",
      }),
  });

  const activeSubmissionsQuery = useQuery({
    queryKey: ["dashboard", "property-submissions", "active"],
    queryFn: () =>
      getAdminPropertySubmissions({
        page: 1,
        pageSize: 1,
        status: "active",
      }),
  });

  const notificationsQuery = useQuery({
    queryKey: ["dashboard", "notifications", "unread-count"],
    queryFn: getUnreadNotificationCount,
  });

  const isLoading =
    agenciesQuery.isPending ||
    pendingSubmissionsQuery.isPending ||
    activeSubmissionsQuery.isPending ||
    notificationsQuery.isPending;

  const errors = useMemo(
    () =>
      [
        agenciesQuery.error,
        pendingSubmissionsQuery.error,
        activeSubmissionsQuery.error,
        notificationsQuery.error,
      ].filter(Boolean),
    [
      agenciesQuery.error,
      pendingSubmissionsQuery.error,
      activeSubmissionsQuery.error,
      notificationsQuery.error,
    ],
  );

  return {
    isLoading,
    hasError: errors.length > 0,
    agencyCount: agenciesQuery.data?.total ?? 0,
    agencies: agenciesQuery.data?.items ?? [],
    pendingSubmissions: pendingSubmissionsQuery.data?.data?.items ?? [],
    pendingSubmissionCount: pendingSubmissionsQuery.data?.data?.total ?? 0,
    activePropertyCount: activeSubmissionsQuery.data?.data?.total ?? 0,
    unreadNotificationCount: notificationsQuery.data?.data?.unreadCount ?? 0,
  };
}
