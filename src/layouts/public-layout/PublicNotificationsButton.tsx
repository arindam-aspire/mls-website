"use client";

import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { IconButton } from "@/src/components/ui/icon-button";

export interface PublicNotificationsButtonProps {
  onClick: () => void;
}

export function PublicNotificationsButton({ onClick }: PublicNotificationsButtonProps) {
  const t = useTranslations("common");

  return (
    <IconButton
      icon={<Bell className="size-5" aria-hidden />}
      aria-label={t("notifications")}
      color="primary"
      variant="solid"
      isRounded
      size="md"
      onClick={onClick}
    />
  );
}
