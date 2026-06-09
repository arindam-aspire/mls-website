"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { IconButton } from "@/src/components/ui/icon-button";
import { Link } from "@/src/i18n/navigation";
import { useProtectedSidebar } from "@/src/layouts/protected-layout/hooks/useProtectedSidebar";
import { ProtectedSidebarNav } from "@/src/layouts/protected-layout/ProtectedSidebarNav";
import { isRtlLocale } from "@/src/i18n/routing";
import { cn } from "@/src/lib/cn";

export function ProtectedSidebar() {
  const {
    isVisible,
    isCollapsed,
    toggleCollapsed,
    collapseLabel,
    expandLabel,
    navLabel,
    logoAlt,
    logoSrc,
  } = useProtectedSidebar();

  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const CollapseIcon = isRtl ? ChevronRight : ChevronLeft;
  const ExpandIcon = isRtl ? ChevronLeft : ChevronRight;

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative sticky top-0 z-[50] hidden h-[100vh] max-h-[100vh] shrink-0 self-start overflow-visible md:flex">
      <aside
        aria-label={navLabel}
        data-collapsed={isCollapsed ? "true" : "false"}
        className={cn(
          "flex size-full min-h-0 flex-col overflow-hidden border-e border-secondary/15 bg-surface transition-[width] duration-200 ease-out",
          isCollapsed ? "w-28 px-2 py-3" : "w-60 px-4 py-4 lg:w-72",
        )}
      >
        <div className="mb-4 flex shrink-0 justify-center">
          <Link
            href="/"
            className="inline-flex w-full min-w-0 items-center justify-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
          >
            <Image
              src={logoSrc}
              alt={logoAlt}
              priority
              className={cn(
                "object-contain",
                isCollapsed
                  ? "size-14"
                  : "h-[4.25rem] w-auto max-w-full sm:h-[4.75rem] lg:h-20",
              )}
            />
          </Link>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ProtectedSidebarNav isCollapsed={isCollapsed} />
        </div>
      </aside>

      <IconButton
        type="button"
        icon={
          isCollapsed ? (
            <ExpandIcon className="size-5" aria-hidden />
          ) : (
            <CollapseIcon className="size-5" aria-hidden />
          )
        }
        aria-label={isCollapsed ? expandLabel : collapseLabel}
        aria-expanded={!isCollapsed}
        color="inherit"
        variant="outline"
        isRounded
        size="sm"
        onClick={toggleCollapsed}
        className={cn(
          "absolute top-9 z-[51] !bg-surface shadow-sm ring-1 ring-secondary/15 lg:top-10",
          "end-0 translate-x-1/2 rtl:-translate-x-1/2",
        )}
      />
    </div>
  );
}
