"use client";

import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { IconButton } from "@/src/components/ui/icon-button";
import { cn } from "@/src/lib/cn";

/** Landing header over hero image — frosted white controls on hero. */
export const headerOverHeroIconClass =
  "!border-white/40 !bg-white/20 !text-white data-hover:!bg-white/15 data-active:!bg-white/15 focus-visible:!ring-white/40";

export interface PublicNotificationsButtonProps {
  onClick: () => void;
  /** Unread indicator dot (placeholder until notification API exists). */
  showIndicator?: boolean;
  /** Landing: translucent hero header styling. */
  overHero?: boolean;
  className?: string;
}

export function PublicNotificationsButton({
  onClick,
  showIndicator = true,
  overHero = false,
  className,
}: PublicNotificationsButtonProps) {
  const t = useTranslations("common");

  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <IconButton
        icon={<Bell className="size-5" strokeWidth={1.75} aria-hidden />}
        aria-label={t("notifications")}
        color="inherit"
        variant="outline"
        isRounded
        size="md"
        className={cn(overHero && headerOverHeroIconClass)}
        onClick={onClick}
      />
      {showIndicator ? (
        <span
          className={cn(
            "pointer-events-none absolute top-2.5 end-2.5 size-2 rounded-full bg-danger ring-2",
            overHero ? "ring-page/90" : "ring-surface",
          )}
          aria-hidden
        />
      ) : null}
    </span>
  );
}
