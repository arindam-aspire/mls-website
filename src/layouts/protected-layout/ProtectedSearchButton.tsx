"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { IconButton } from "@/src/components/ui/icon-button";
import {
  protectedHeaderIconButtonClass,
  protectedHeaderIconGlyphClass,
  protectedHeaderIconStrokeWidth,
} from "@/src/layouts/protected-layout/protectedMobileHeaderStyles";
import { cn } from "@/src/lib/cn";

export interface ProtectedSearchButtonProps {
  onClick: () => void;
  className?: string;
}

export function ProtectedSearchButton({ onClick, className }: ProtectedSearchButtonProps) {
  const t = useTranslations("common");

  return (
    <span className={cn("hidden shrink-0 lg:inline-flex", className)}>
      <IconButton
        type="button"
        icon={
          <Search
            className={protectedHeaderIconGlyphClass}
            strokeWidth={protectedHeaderIconStrokeWidth}
            aria-hidden
          />
        }
        aria-label={t("searchLabel")}
        color="inherit"
        variant="ghost"
        size="sm"
        className={protectedHeaderIconButtonClass}
        onClick={onClick}
      />
    </span>
  );
}
