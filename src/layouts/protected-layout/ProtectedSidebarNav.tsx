"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/src/i18n/navigation";
import { useProtectedSidebarNav } from "@/src/layouts/protected-layout/hooks/useProtectedSidebarNav";
import { cn } from "@/src/lib/cn";

export interface ProtectedSidebarNavProps {
  isCollapsed: boolean;
}

export function ProtectedSidebarNav({ isCollapsed }: ProtectedSidebarNavProps) {
  const t = useTranslations("common");
  const { sections } = useProtectedSidebarNav();

  if (sections.length === 0) {
    return null;
  }

  return (
    <nav
      className={cn("h-full min-h-0 overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:thin]", isCollapsed ? "px-6" : "px-0")}
      aria-label={t("protectedSidebarNav")}
    >
      <ul
        className={cn(
          "flex flex-col",
          isCollapsed ? "gap-2" : "gap-6",
        )}
      >
        {sections.map((section) => (
          <li key={section.titleKey}>
            {!isCollapsed ? (
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-muted">
                {section.title}
              </p>
            ) : (
              <span className="sr-only">{section.title}</span>
            )}
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={item.isActive ? "page" : undefined}
                      title={isCollapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center rounded-lg text-sm font-medium transition-colors",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
                        isCollapsed
                          ? "justify-center px-2 py-2.5"
                          : "gap-3 px-3 py-2.5",
                        item.isActive
                          ? "bg-primary text-white"
                          : "text-muted hover:bg-inherit-color/10 hover:text-text",
                      )}
                    >
                      <Icon
                        className="size-5 shrink-0"
                        aria-hidden
                      />
                      {!isCollapsed ? (
                        <span className="truncate">{item.label}</span>
                      ) : (
                        <span className="sr-only">{item.label}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
