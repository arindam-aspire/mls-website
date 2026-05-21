"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Select } from "@/src/components/ui/select";
import { Link, usePathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import mlsLogoDark from "@/src/assets/images/MLS_Dark_Logo.png";
import mlsLogoLight from "@/src/assets/images/MLS_Light_Logo.png";

const LOCALE_OPTIONS: { value: AppLocale; label: string }[] = [
  { value: "en", label: "En" },
  { value: "ar", label: "Ar" },
  { value: "es", label: "Sp" },
  { value: "fr", label: "Fr" },
];

const NAV_ITEMS = [
  { path: "/buy", labelKey: "navBuy" },
  { path: "/rent", labelKey: "navRent" },
  { path: "/off-plan", labelKey: "navOffPlan" },
  { path: "/sell", labelKey: "navSell" },
  { path: "/about-us", labelKey: "navAboutUs" },
] as const;

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function PublicHeader() {
  const t = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 48);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";
  const overHero = isHome && !scrolled;

  const logoSrc = overHero ? mlsLogoDark : mlsLogoLight;
  const navLinkClass = overHero
    ? "text-white hover:text-white/90"
    : "text-text hover:text-secondary";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 grid h-16 w-full grid-cols-[1fr_auto_1fr] items-center overflow-visible px-6 transition-colors duration-300 sm:h-20",
        overHero
          ? "bg-page/20 backdrop-blur-[2px]"
          : "border-b border-secondary/10 bg-page/90 backdrop-blur-md",
      )}
    >
      <Link href="/" className="inline-flex items-center justify-self-start">
        <Image
          src={logoSrc}
          alt={t("brand")}
          width={220}
          height={90}
          className="h-12 w-auto transition-opacity duration-300 sm:h-15"
          priority
        />
      </Link>

      <nav
        aria-label={t("mainNav")}
        className="hidden items-center justify-center gap-6 justify-self-center md:flex lg:gap-8"
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

      <div className="flex items-center gap-3 justify-self-end">
        <Select
          aria-label={t("language")}
          options={LOCALE_OPTIONS}
          value={locale}
          onChange={(nextLocale) =>
            router.replace(pathname, { locale: nextLocale as AppLocale })
          }
          variant="outline"
          size="md"
          fullWidth={false}
          wrapperClassName="relative z-[60] w-auto min-w-[4.5rem] shrink-0"
          selectClassName={overHero ? "bg-surface/90 backdrop-blur-sm" : undefined}
        />

        <Button
          type="button"
          color="primary"
          variant="solid"
          size="md"
          className="shrink-0"
          onClick={() => router.push("/sign-in")}
        >
          {t("signInSignUp")}
        </Button>
      </div>
    </header>
  );
}
