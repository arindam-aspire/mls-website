"use client";

import { useTranslations } from "next-intl";
import { PROPERTY_SEARCH_STATUS_OPTIONS } from "@/src/features/property/hooks/propertySearchFilter.constants";
import { DEFAULT_PROPERTY_LIST_PARAMS } from "@/src/features/property/utils/parsePropertyListUrlParams";
import { cn } from "@/src/lib/cn";
import { navDesktopLinkClasses } from "@/src/lib/typography";
import { useRouter } from "@/src/i18n/navigation";

const NAV_ITEMS = [
  { path: "/sell", labelKey: "navSell" },
  { path: "/rent", labelKey: "navRent" },
  { path: "/about-us", labelKey: "navAboutUs" },
] as const;

const RENT_FILTER_STATUS =
  PROPERTY_SEARCH_STATUS_OPTIONS.find((option) => option.value === "rent")
    ?.value ?? "rent";

const SELL_LISTING_HREF = {
  pathname: "/property-list",
  query: {
    status: DEFAULT_PROPERTY_LIST_PARAMS.status,
    category: DEFAULT_PROPERTY_LIST_PARAMS.category,
  },
} as const;

const RENT_LISTING_HREF = {
  pathname: "/property-list",
  query: {
    status: RENT_FILTER_STATUS,
    category: DEFAULT_PROPERTY_LIST_PARAMS.category,
  },
} as const;

interface LandingDesktopNavProps {
  overHero: boolean;
}

export function LandingDesktopNav({ overHero }: LandingDesktopNavProps) {
  const t = useTranslations("common");
  const router = useRouter();

  const navLinkClass = overHero
    ? "text-white hover:text-white/90"
    : "text-text hover:text-secondary";

  return (
    <nav
      aria-label={t("mainNav")}
      className="col-start-2 row-start-1 hidden items-center justify-center gap-6 md:flex lg:gap-8"
    >
      {NAV_ITEMS.map(({ path, labelKey }) => (
        <button
          key={path}
          type="button"
          suppressHydrationWarning
          onClick={() => {
            if (labelKey === "navSell") {
              router.push(SELL_LISTING_HREF);
              return;
            }

            if (labelKey === "navRent") {
              router.push(RENT_LISTING_HREF);
              return;
            }

            router.push(path);
          }}
          className={cn(
            "cursor-pointer transition-colors",
            navDesktopLinkClasses,
            navLinkClass,
          )}
        >
          {t(labelKey)}
        </button>
      ))}
    </nav>
  );
}
