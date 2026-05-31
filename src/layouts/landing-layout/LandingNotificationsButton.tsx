"use client";

import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { IconButton } from "@/src/components/ui/icon-button";
import { cn } from "@/src/lib/cn";

export interface LandingNotificationsButtonProps {
  overHero: boolean;
  onClick: () => void;
}

export function LandingNotificationsButton({
  overHero,
  onClick,
}: LandingNotificationsButtonProps) {
  const t = useTranslations("common");

  return (
    <IconButton
      icon={<Bell className="size-5" aria-hidden />}
      aria-label={t("notifications")}
      color="primary"
      variant="solid"
      isRounded
      size="md"
      className={cn(
        overHero && "!bg-surface !text-inherit hover:!bg-surface/80 rounded-full",
      )}
      onClick={onClick}
    />
  );
}
