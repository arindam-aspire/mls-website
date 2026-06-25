"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { IconButton } from "@/src/components/ui/icon-button";
import {
  protectedHeaderIconButtonClass,
  protectedHeaderIconGlyphClass,
  protectedHeaderIconStrokeWidth,
} from "@/src/layouts/protected-layout/protectedMobileHeaderStyles";
import { cn } from "@/src/lib/cn";
import { useTheme, type ThemeMode } from "@/src/providers/ThemeProvider";

function getThemeToggleIcon(mode: ThemeMode) {
  const iconClass = cn(protectedHeaderIconGlyphClass);

  return mode === "light" ? (
    <Moon className={iconClass} strokeWidth={protectedHeaderIconStrokeWidth} aria-hidden />
  ) : (
    <Sun className={iconClass} strokeWidth={protectedHeaderIconStrokeWidth} aria-hidden />
  );
}

export interface ProtectedThemeButtonProps {
  className?: string;
}

export function ProtectedThemeButton({ className }: ProtectedThemeButtonProps) {
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
        className={protectedHeaderIconButtonClass}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      />
    </span>
  );
}
