export type NotificationGroupLabels = {
  justNow: string;
  earlierToday: string;
  yesterday: string;
  lastWeek: string;
  lastMonth: string;
  lastYear: string;
};

type NotificationGroupTranslator = (
  key:
    | "groups.justNow"
    | "groups.earlierToday"
    | "groups.yesterday"
    | "groups.lastWeek"
    | "groups.lastMonth"
    | "groups.lastYear",
) => string;

export function buildNotificationGroupLabels(
  t: NotificationGroupTranslator,
): NotificationGroupLabels {
  return {
    justNow: t("groups.justNow"),
    earlierToday: t("groups.earlierToday"),
    yesterday: t("groups.yesterday"),
    lastWeek: t("groups.lastWeek"),
    lastMonth: t("groups.lastMonth"),
    lastYear: t("groups.lastYear"),
  };
}
