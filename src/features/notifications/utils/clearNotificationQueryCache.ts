import type { QueryClient } from "@tanstack/react-query";
import { NOTIFICATIONS_QUERY_KEY } from "../constants/notification.constants";

/** Drop all notification list and unread-count queries (e.g. on logout). */
export function clearNotificationQueryCache(queryClient: QueryClient): void {
  queryClient.removeQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
}
