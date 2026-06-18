"use client";

import { ComingSoonCard } from "@/src/components/common/ComingSoonCard";
import { useTranslations } from "next-intl";

export function NotificationSettingsScreen() {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <ComingSoonCard
        title={t("notificationSettings.title")}
        subtitle={tCommon("upcomingFeature.subtitle")}
        description={t("notificationSettings.description")}
      />
    </div>
  );
}
