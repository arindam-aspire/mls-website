"use client";

import { ComingSoonCard } from "@/src/components/common/ComingSoonCard";
import { useTranslations } from "next-intl";

export default function ManageListingsScreen() {
  const t = useTranslations("propertyList.manageListings");

  return (
    <ComingSoonCard
      title={t("pageTitle")}
      subtitle={t("comingSoonEyebrow")}
      description={t("comingSoonDescription")}
    />
  );
}
