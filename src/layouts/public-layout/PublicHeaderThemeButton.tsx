"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { IconButton } from "@/src/components/ui/icon-button";
import {
  headerIconButtonClass,
  headerIconGlyphClass,
  headerIconStrokeWidth,
} from "@/src/layouts/shared/headerIconButtonStyles";
import { headerOverHeroIconClass } from "./PublicNotificationsButton";
import { cn } from "@/src/lib/cn";
import { useTheme, type ThemeMode } from "@/src/providers/ThemeProvider";

function getThemeToggleIcon(mode: ThemeMode) {
  const iconClass = cn(headerIconGlyphClass);

  return mode === "light" ? (
    <Moon className={iconClass} strokeWidth={headerIconStrokeWidth} aria-hidden />
  ) : (
    <Sun className={iconClass} strokeWidth={headerIconStrokeWidth} aria-hidden />
  );
}

export interface PublicHeaderThemeButtonProps {
  /** Landing: translucent hero header styling. */
  overHero?: boolean;
  className?: string;
}

export function PublicHeaderThemeButton({
  overHero = false,
  className,
}: PublicHeaderThemeButtonProps) {
  const t = useTranslations("common");
  const { theme, setTheme } = useTheme();

  return (
    <span className={cn("inline-flex shrink-0", className)}>
      <IconButton
        type="button"
        icon={getThemeToggleIcon(theme)}
        aria-label={t(theme === "light" ? "themeSwitchToDark" : "themeSwitchToLight")}
        color="inherit"
        variant="outline"
        isRounded
        size="sm"
        className={cn(headerIconButtonClass, overHero && headerOverHeroIconClass)}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      />
    </span>
  );
}
