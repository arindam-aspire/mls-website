"use client";

import { useTranslations } from "next-intl";
import { LoadingUi } from "@/src/features/loading/components/LoadingUi";

/** Use only under `NextIntlClientProvider` (e.g. client trees after locale layout). */
export default function LoadingComponent() {
  const t = useTranslations("common");

  return <LoadingUi brand={t("brand")} loadingLabel={t("loading")} />;
}
