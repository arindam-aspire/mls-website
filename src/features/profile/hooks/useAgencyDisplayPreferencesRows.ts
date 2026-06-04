"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

export function useAgencyDisplayPreferencesRows() {
  const t = useTranslations("common.upcomingFeature");
  const [isUpcomingFeatureModalOpen, setIsUpcomingFeatureModalOpen] = useState(false);

  const openUpcomingFeatureModal = useCallback(() => {
    setIsUpcomingFeatureModalOpen(true);
  }, []);

  const closeUpcomingFeatureModal = useCallback(() => {
    setIsUpcomingFeatureModalOpen(false);
  }, []);

  const upcomingFeatureModal = useMemo(
    () => ({
      open: isUpcomingFeatureModalOpen,
      onClose: closeUpcomingFeatureModal,
      title: t("title"),
      subtitle: t("subtitle"),
      description: t("description"),
      dismissLabel: t("dismissLabel"),
    }),
    [closeUpcomingFeatureModal, isUpcomingFeatureModalOpen, t],
  );

  return {
    upcomingFeatureModal,
    openUpcomingFeatureModal,
  };
}
