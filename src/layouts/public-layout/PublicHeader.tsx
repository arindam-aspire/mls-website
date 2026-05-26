"use client";

import { CloseButton, useClose } from "@headlessui/react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/src/lib/cn";
import { Avatar } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverContent,
  PopoverPanel,
} from "@/src/components/ui/popover";
import { Select } from "@/src/components/ui/select";
import { AUTH_VIEW } from "@/src/features/auth/authViews";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { Link, usePathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import mlsLogoDark from "@/src/assets/images/MLS_Dark_Logo.png";
import mlsLogoLight from "@/src/assets/images/MLS_Light_Logo.png";
import { PublicHeaderThemeButton } from "./PublicHeaderThemeButton";
import { DesktopNav } from "./DesktopNav";
import { DesktopActions } from "./DesktopActions";

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

const mobileNavLinkClass =
  "w-full rounded-lg px-4 py-3.5 text-start text-base font-medium text-text transition-colors hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40";

interface MobileMenuProps {
  onNavigate: (path: string) => void;
  onLocaleChange: (locale: string) => void;
  locale: AppLocale;
  navLabel: string;
  languageLabel: string;
  closeMenuLabel: string;
}

function MobileMenu({
  onNavigate,
  onLocaleChange,
  locale,
  navLabel,
  languageLabel,
  closeMenuLabel,
}: MobileMenuProps) {
  const t = useTranslations("common");
  const close = useClose();

  return (
    <PopoverContent className="flex min-h-0 flex-1 flex-col p-0">
      <div className="flex items-center justify-between border-b border-secondary/15 px-4 py-4 sm:px-6">
        <span className="text-lg font-semibold text-text">{navLabel}</span>
        <CloseButton
          type="button"
          aria-label={closeMenuLabel}
          className="inline-flex size-11 items-center justify-center rounded-lg text-text transition-colors hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
        >
          <X className="size-6" aria-hidden />
        </CloseButton>
      </div>

      <nav
        aria-label={navLabel}
        className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6"
      >
        {NAV_ITEMS.map(({ path, labelKey }) => (
          <button
            key={path}
            type="button"
            onClick={() => {
              onNavigate(path);
              close();
            }}
            className={mobileNavLinkClass}
          >
            {t(labelKey)}
          </button>
        ))}
      </nav>

      <div className="flex items-center justify-between border-t border-secondary/15 px-4 py-4 sm:px-6 sm:py-5">
        <span className="text-sm font-medium text-text">{t("theme")}</span>
        <PublicHeaderThemeButton overHero={false} />
      </div>

      <div className="border-t border-secondary/15 px-4 py-4 sm:px-6 sm:py-5">
        <Select
          aria-label={languageLabel}
          options={LOCALE_OPTIONS}
          value={locale}
          onChange={(nextLocale) => {
            onLocaleChange(nextLocale);
            close();
          }}
          variant="outline"
          size="md"
          fullWidth
        />
      </div>
    </PopoverContent>
  );
}

export function PublicHeader() {
  const { user, isLoadingUser } = useAuthStore();
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

  const openChooseAccount = () => {
    router.push({ pathname: "/", query: { auth: AUTH_VIEW.chooseAccount } });
  };

  const handleLocaleChange = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale as AppLocale });
  };

  const menuTriggerClass = cn(
    "size-11 shrink-0 p-0 hover:bg-page",
    overHero && "!bg-transparent !text-white hover:!bg-white/15",
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 grid h-16 w-full grid-cols-3 items-center gap-2 px-4 transition-colors duration-300 sm:h-20 md:grid-cols-[1fr_auto_1fr] md:gap-0 md:px-6",
        overHero
          ? "bg-page/20 backdrop-blur-[2px]"
          : "border-b border-secondary/10 bg-page/90 backdrop-blur-md",
      )}
    >
      <Link href="/" className="col-start-1 justify-self-start">
        <Image
          src={logoSrc}
          alt={t("brand")}
          className="w-auto h-20 transition-opacity duration-300"
          priority
        />
      </Link>

      <DesktopNav overHero={overHero} />

      {isLoadingUser ? (
        <Skeleton variant="circular" className="col-start-2 size-9 justify-self-center md:hidden" />
      ) : user ? (
        <Avatar
          src={user.profile_picture_url}
          name={user.full_name}
          size="sm"
          className="col-start-2 justify-self-center md:hidden"
        />
      ) : (
        <Button
          type="button"
          color="primary"
          variant="solid"
          size="sm"
          className="col-start-2 max-w-[min(100%,11rem)] justify-self-center truncate md:hidden"
          onClick={openChooseAccount}
        >
          {t("signInSignUp")}
        </Button>
      )}

      <DesktopActions overHero={overHero} />

      <Popover className="col-start-3 justify-self-end md:hidden">
        <PopoverButton
          aria-label={t("openMenu")}
          className={menuTriggerClass}
        >
          <Menu className="size-6" aria-hidden />
        </PopoverButton>

        <PopoverBackdrop className="z-[90] bg-black/40" />

        <PopoverPanel fullScreen className="p-0">
          <MobileMenu
            onNavigate={(path) => router.push(path)}
            onLocaleChange={handleLocaleChange}
            locale={locale}
            navLabel={t("mainNav")}
            languageLabel={t("language")}
            closeMenuLabel={t("closeMenu")}
          />
        </PopoverPanel>
      </Popover>
    </header>
  );
}
