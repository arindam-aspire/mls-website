"use client";

import { Link } from "@/src/i18n/navigation";
import { useProtectedBottomTabBar } from "@/src/layouts/protected-layout/hooks/useProtectedBottomTabBar";
import { cn } from "@/src/lib/cn";

export function ProtectedBottomTabBar() {
  const { t, tabs } = useProtectedBottomTabBar();

  if (tabs.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label={t("protectedBottomTabNav")}
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-secondary/15 bg-surface/95 backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto flex w-full max-w-xl items-stretch justify-around px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 sm:px-2">
        {tabs.map(({ path, label, icon: Icon, isActive }) => (
          <li key={path} className="min-w-0 flex-1">
            <Link
              href={path}
              className={cn(
                "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-center transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
                isActive ? "text-primary" : "text-muted hover:text-text",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className="size-5 shrink-0"
                aria-hidden
                strokeWidth={isActive ? 2.25 : 2}
              />
              <span className="w-full truncate text-[11px] font-medium leading-tight sm:text-xs">
                {label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
