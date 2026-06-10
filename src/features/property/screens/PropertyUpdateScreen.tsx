"use client";

import { ComingSoonCard } from "@/src/components/common/ComingSoonCard";
import { useTranslations } from "next-intl";

export default function PropertyUpdateScreen() {
  const t = useTranslations("propertyList.propertyUpdate");

  return (
    <ComingSoonCard
      title={t("pageTitle")}
      subtitle={t("comingSoonEyebrow")}
      description={t("comingSoonDescription")}
    />
  );
}
