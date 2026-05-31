"use client";

import Image from "next/image";
import { Bell, Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/src/lib/cn";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { UpcomingFeatureModal } from "@/src/components/common/UpcomingFeatureModal";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { AUTH_VIEW } from "@/src/features/auth/authViews";
import { Link, usePathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import mlsLogoLight from "@/src/assets/images/MLS_Light_Logo.png";
import { DesktopNav } from "./DesktopNav";
import { DesktopActions } from "./DesktopActions";
import { PublicMobileMenu } from "./PublicMobileMenu";
import { PublicNotificationsButton } from "./PublicNotificationsButton";
import {
  publicMobileHeaderIconButtonClass,
  publicMobileHeaderIconClass,
  publicMobileHeaderContainerClass,
  publicMobileLogoImageClass,
  publicMobileLogoLinkClass,
} from "./publicMobileHeaderStyles";

export function PublicHeader() {
  const { user, isLoadingUser } = useAuthStore();
  const t = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const [isUpcomingFeatureModalOpen, setIsUpcomingFeatureModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    publicMobileHeaderIconButtonClass,
    "!bg-transparent text-text hover:bg-page",
  );

  const mobileSignInButtonClass = cn(
    "!h-9 sm:!h-11",
    "inline-flex min-w-0 max-w-[min(100%,9rem)] shrink items-center justify-center truncate sm:max-w-[12rem] sm:px-4 sm:text-sm sm:tracking-tight",
  );

  return (
    <>
      <header className="sticky top-0 z-50 h-16 w-full border-b border-secondary/10 bg-page/90 backdrop-blur-md transition-colors duration-300 sm:h-20">
        <div
          className={cn(
            publicMobileHeaderContainerClass,
            "flex h-full w-full items-center justify-between gap-2 sm:gap-3 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:justify-normal md:gap-0 md:px-6",
          )}
        >
          <Link
            href="/"
            className={cn(
              publicMobileLogoLinkClass,
              "md:col-start-1 md:max-w-none md:justify-self-start",
            )}
          >
            <Image
              src={mlsLogoLight}
              alt={t("brand")}
              className={cn(publicMobileLogoImageClass, "md:h-20")}
              priority
            />
          </Link>

          <DesktopNav />

          <div className="flex h-full shrink-0 items-center gap-2 self-center md:hidden">
            {isLoadingUser ? (
              <Skeleton variant="circular" className="size-8 shrink-0 sm:size-11" />
            ) : user ? (
              <PublicNotificationsButton
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

            <button
              type="button"
              aria-label={t("openMenu")}
              aria-expanded={mobileMenuOpen}
              className={cn(
                "inline-flex shrink-0 focus:outline-none focus-visible:ring-2",
                mobileHeaderIconButtonClass,
              )}
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className={publicMobileHeaderIconClass} aria-hidden />
            </button>
          </div>

          <DesktopActions />
        </div>
      </header>

      <PublicMobileMenu
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
