"use client";

import { ComingSoonCard } from "@/src/components/common/ComingSoonCard";
import { useTranslations } from "next-intl";

export function OwnersScreen() {
  const t = useTranslations("user");
  const tCommon = useTranslations("common");

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <ComingSoonCard
        title={t("owners.title")}
        subtitle={tCommon("upcomingFeature.subtitle")}
        description={t("owners.description")}
      />
    </div>
  );
}
