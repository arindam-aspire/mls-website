"use client";

import { Building2, Home, KeyRound, Tag } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/src/lib/cn";
import { Link, usePathname } from "@/src/i18n/navigation";

const BOTTOM_TAB_ITEMS: {
  path: string;
  labelKey: "navBuy" | "navRent" | "navSell" | "navOffPlan";
  icon: LucideIcon;
}[] = [
  { path: "/buy", labelKey: "navBuy", icon: Home },
  { path: "/rent", labelKey: "navRent", icon: KeyRound },
  { path: "/sell", labelKey: "navSell", icon: Tag },
  { path: "/off-plan", labelKey: "navOffPlan", icon: Building2 },
];

function isTabActive(pathname: string, path: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

export function LandingBottomTabBar() {
  const t = useTranslations("common");
  const pathname = usePathname();

  return (
    <nav
      aria-label={t("bottomTabNav")}
      className="fixed inset-x-0 bottom-0 z-40 flex border-t border-secondary/15 bg-page/95 backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto flex w-full max-w-lg items-stretch justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
        {BOTTOM_TAB_ITEMS.map(({ path, labelKey, icon: Icon }) => {
          const active = isTabActive(pathname, path);

          return (
            <li key={path} className="min-w-0 flex-1">
              <Link
                href={path}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-center transition-colors",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
                  active
                    ? "text-primary"
                    : "text-muted hover:text-text",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-5 shrink-0" aria-hidden strokeWidth={active ? 2.25 : 2} />
                <span className="w-full truncate text-[11px] font-medium leading-tight sm:text-xs">
                  {t(labelKey)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
