"use client";

import Image from "next/image";
import { Bell, Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/src/lib/cn";
import { Button } from "@/src/components/ui/button";
import { IconButton } from "@/src/components/ui/icon-button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { headerOverHeroIconClass } from "@/src/layouts/public-layout/PublicNotificationsButton";
import { UpcomingFeatureModal } from "@/src/components/common/UpcomingFeatureModal";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { AUTH_VIEW } from "@/src/features/auth/authViews";
import { Link, usePathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import mlsLogoDark from "@/src/assets/images/MLS_Dark_Logo.png";
import mlsLogoLight from "@/src/assets/images/MLS_Light_Logo.png";
import { LandingDesktopNav } from "./LandingDesktopNav";
import { LandingDesktopActions } from "./LandingDesktopActions";
import { LandingMobileMenu } from "./LandingMobileMenu";
import { LandingNotificationsButton } from "./LandingNotificationsButton";
import {
  landingMobileHeaderIconButtonClass,
  landingMobileHeaderIconClass,
  landingMobileHeaderContainerClass,
  landingMobileLogoImageClass,
  landingMobileLogoLinkClass,
} from "./landingMobileHeaderStyles";

export function LandingHeader() {
  const { user, isLoadingUser } = useAuthStore();
  const t = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isUpcomingFeatureModalOpen, setIsUpcomingFeatureModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    useAuthStore.getState().openAuth(AUTH_VIEW.chooseAccount);
  };

  const handleLocaleChange = (nextLocale: string) => {
    router.replace(pathname, { locale: nextLocale as AppLocale });
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const mobileHeaderIconButtonClass = cn(
    landingMobileHeaderIconButtonClass,
    overHero
      ? headerOverHeroIconClass
      : "!bg-transparent data-hover:!bg-page data-active:!bg-page",
  );

  const mobileSignInButtonClass = cn(
    "!h-9 sm:!h-11",
    "inline-flex min-w-0 max-w-[min(100%,9rem)] shrink items-center justify-center truncate sm:max-w-[12rem] sm:px-4 sm:text-sm sm:tracking-tight",
    overHero && "sm:shadow-md",
  );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 h-16 w-full transition-colors duration-300 sm:h-20",
          overHero
            ? "bg-page/20 backdrop-blur-[2px]"
            : "border-b border-secondary/10 bg-page/90 backdrop-blur-md",
        )}
      >
        <div
          className={cn(
            landingMobileHeaderContainerClass,
            "flex h-full w-full items-center justify-between gap-2 sm:gap-3 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:justify-normal md:gap-0 md:px-6",
          )}
        >
        <Link
          href="/"
          className={cn(
            landingMobileLogoLinkClass,
            "md:col-start-1 md:max-w-none md:justify-self-start",
          )}
        >
          <Image
            src={logoSrc}
            alt={t("brand")}
            className={cn(landingMobileLogoImageClass, "md:h-20")}
            priority
          />
        </Link>

        <LandingDesktopNav overHero={overHero} />

        <div className="flex h-full shrink-0 items-center gap-2 self-center sm:gap-3 md:hidden">
          {isLoadingUser ? (
            <>
              <Skeleton variant="circular" className="size-9 shrink-0 sm:size-11" />
              <Skeleton variant="circular" className="size-9 shrink-0 sm:size-11" />
            </>
          ) : user ? (
            <LandingNotificationsButton
              overHero={overHero}
              onClick={() => setIsUpcomingFeatureModalOpen(true)}
            />
          ) : (
            <Button
              type="button"
              color="primary"
              variant="solid"
              size="sm"
              className={mobileSignInButtonClass}
              onClick={openChooseAccount}
            >
              {t("signInSignUp")}
            </Button>
          )}

          <IconButton
            type="button"
            icon={<Menu className={landingMobileHeaderIconClass} aria-hidden />}
            aria-label={t("openMenu")}
            aria-expanded={mobileMenuOpen}
            color="inherit"
            variant="outline"
            size="md"
            className={mobileHeaderIconButtonClass}
            onClick={() => setMobileMenuOpen(true)}
          />
        </div>

        <LandingDesktopActions overHero={overHero} />
      </div>
      </header>

      <LandingMobileMenu
        open={mobileMenuOpen}
        onNavigate={(path) => router.push(path)}
        onLocaleChange={handleLocaleChange}
        onClose={closeMobileMenu}
        locale={locale}
        closeMenuLabel={t("closeMenu")}
      />

      <UpcomingFeatureModal
        open={isUpcomingFeatureModalOpen}
        onClose={() => setIsUpcomingFeatureModalOpen(false)}
        icon={<Bell className="size-7" aria-hidden />}
      />
    </>
  );
}
