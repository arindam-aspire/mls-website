"use client";

import { Maximize, Minimize } from "lucide-react";
import { useTranslations } from "next-intl";
import { IconButton } from "@/src/components/ui/icon-button";
import { useHeaderFullscreen } from "@/src/layouts/shared/hooks/useHeaderFullscreen";
import {
  headerIconButtonClass,
  headerIconGlyphClass,
  headerIconStrokeWidth,
} from "@/src/layouts/shared/headerIconButtonStyles";
import { headerOverHeroIconClass } from "@/src/layouts/public-layout/PublicNotificationsButton";
import { cn } from "@/src/lib/cn";

export interface HeaderFullscreenButtonProps {
  className?: string;
  /** Landing header: frosted controls over hero image. */
  overHero?: boolean;
}

export function HeaderFullscreenButton({
  className,
  overHero = false,
}: HeaderFullscreenButtonProps) {
  const t = useTranslations("common");
  const { isFullscreen, toggleFullscreen } = useHeaderFullscreen();

  const icon = isFullscreen ? (
    <Minimize
      className={headerIconGlyphClass}
      strokeWidth={headerIconStrokeWidth}
      aria-hidden
    />
  ) : (
    <Maximize
      className={headerIconGlyphClass}
      strokeWidth={headerIconStrokeWidth}
      aria-hidden
    />
  );

  return (
    <span className={cn("inline-flex shrink-0", className)}>
      <IconButton
        type="button"
        icon={icon}
        aria-label={t(isFullscreen ? "exitFullscreen" : "enterFullscreen")}
        aria-pressed={isFullscreen}
        color="inherit"
        variant="outline"
        isRounded
        size="sm"
        className={cn(headerIconButtonClass, overHero && headerOverHeroIconClass)}
        onClick={() => void toggleFullscreen()}
      />
    </span>
  );
}
