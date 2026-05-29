"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/src/lib/cn";
import { useRouter } from "@/src/i18n/navigation";

const NAV_ITEMS = [
  { path: "/buy", labelKey: "navBuy" },
  { path: "/rent", labelKey: "navRent" },
  { path: "/off-plan", labelKey: "navOffPlan" },
  { path: "/sell", labelKey: "navSell" },
  { path: "/about-us", labelKey: "navAboutUs" },
] as const;

export function DesktopNav() {
  const t = useTranslations("common");
  const router = useRouter();

  const navLinkClass = "text-text hover:text-secondary";

  return (
    <nav
      aria-label={t("mainNav")}
      className="col-start-2 row-start-1 hidden items-center justify-center gap-6 md:flex lg:gap-8"
    >
      {NAV_ITEMS.map(({ path, labelKey }) => (
        <button
          key={path}
          type="button"
          onClick={() => router.push(path)}
          className={cn(
            "cursor-pointer text-[14px] font-medium transition-colors",
            navLinkClass,
          )}
        >
          {t(labelKey)}
        </button>
      ))}
    </nav>
  );
}
