"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/src/lib/cn";
import { IconButton } from "@/src/components/ui/icon-button";
import { useTheme, type ThemeMode } from "@/src/providers/ThemeProvider";

function getThemeToggleIcon(mode: ThemeMode) {
  return mode === "light" ? <Moon aria-hidden /> : <Sun aria-hidden />;
}

interface PublicHeaderThemeButtonProps {
  overHero: boolean;
  className?: string;
}

export function PublicHeaderThemeButton({
  overHero,
  className,
}: PublicHeaderThemeButtonProps) {
  const t = useTranslations("common");
  const { theme, setTheme } = useTheme();

  return (
    <IconButton
      type="button"
      icon={getThemeToggleIcon(theme)}
      aria-label={t(theme === "light" ? "themeSwitchToDark" : "themeSwitchToLight")}
      color="secondary"
      variant="ghost"
      size="md"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        overHero && "!bg-transparent !text-white hover:!bg-white/15",
        className,
      )}
    />
  );
}
