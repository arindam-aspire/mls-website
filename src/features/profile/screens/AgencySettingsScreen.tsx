"use client";

import { ComingSoonCard } from "@/src/components/common/ComingSoonCard";
import { useTranslations } from "next-intl";

export function AgencySettingsScreen() {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <ComingSoonCard
        title={t("agencySettings.title")}
        subtitle={tCommon("upcomingFeature.subtitle")}
        description={t("agencySettings.description")}
      />
    </div>
  );
}
