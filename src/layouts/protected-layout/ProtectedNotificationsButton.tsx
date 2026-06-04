"use client";

import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { IconButton } from "@/src/components/ui/icon-button";
import { cn } from "@/src/lib/cn";
import { notificationsIndicatorClass } from "@/src/layouts/shared/notificationsButtonStyles";

export interface ProtectedNotificationsButtonProps {
  onClick: () => void;
  /** Unread indicator dot (placeholder until notification API exists). */
  showIndicator?: boolean;
  className?: string;
}

export function ProtectedNotificationsButton({
  onClick,
  showIndicator = true,
  className,
}: ProtectedNotificationsButtonProps) {
  const t = useTranslations("common");

  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <IconButton
        icon={<Bell className="size-5 shrink-0" strokeWidth={2} aria-hidden />}
        aria-label={t("notifications")}
        color="inherit"
        variant="outline"
        isRounded
        size="md"
        onClick={onClick}
      />
      {showIndicator ? (
        <span className={notificationsIndicatorClass()} aria-hidden />
      ) : null}
    </span>
  );
}
