"use client";

import {
  CloseButton,
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Avatar } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Select } from "@/src/components/ui/select";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import { AUTH_VIEW } from "@/src/features/auth/authViews";
import { Link, usePathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import mlsLogoLight from "@/src/assets/images/MLS_Light_Logo.png";
import { PublicHeaderThemeButton } from "./PublicHeaderThemeButton";
import { DesktopNav } from "./DesktopNav";
import { DesktopActions } from "./DesktopActions";
import { cn } from "@/src/lib/cn";
import {
  navBrandClasses,
  navDrawerLinkClasses,
  themeToggleLabelClasses,
} from "@/src/lib/typography";

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

const mobileNavLinkClass = cn(
  "w-full rounded-lg px-4 py-3.5 text-start font-medium text-text transition-colors hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40",
  navDrawerLinkClasses,
);

interface MobileMenuProps {
  onNavigate: (path: string) => void;
  onLocaleChange: (locale: string) => void;
  onClose: () => void;
  locale: AppLocale;
  navLabel: string;
  languageLabel: string;
  closeMenuLabel: string;
}

function MobileMenu({
  onNavigate,
  onLocaleChange,
  onClose,
  locale,
  navLabel,
  languageLabel,
  closeMenuLabel,
}: MobileMenuProps) {
  const t = useTranslations("common");

  return (
    <div className="flex min-h-0 flex-1 flex-col p-0">
      <div className="flex items-center justify-between border-b border-secondary/15 px-4 py-4 sm:px-6">
        <span className={navBrandClasses}>{navLabel}</span>
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
              onClose();
            }}
            className={mobileNavLinkClass}
          >
            {t(labelKey)}
          </button>
        ))}
      </nav>

      <div className="flex items-center justify-between border-t border-secondary/15 px-4 py-4 sm:px-6 sm:py-5">
        <span className={cn("font-medium text-text", themeToggleLabelClasses)}>
          {t("theme")}
        </span>
        <PublicHeaderThemeButton />
      </div>

      <div className="border-t border-secondary/15 px-4 py-4 sm:px-6 sm:py-5">
        <Select
          aria-label={languageLabel}
          options={LOCALE_OPTIONS}
          value={locale}
          onChange={(nextLocale) => {
            onLocaleChange(nextLocale);
            onClose();
          }}
          variant="outline"
          size="md"
          fullWidth
        />
      </div>
    </div>
  );
}

export function PublicHeader() {
  const { user, isLoadingUser } = useAuthStore();
  const t = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const logoSrc = mlsLogoLight;
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

  return (
    <header
      className="sticky top-0 z-50 h-[var(--layout-header-height)] w-full border-b border-secondary/10 bg-page/90 transition-colors duration-300 backdrop-blur-md"
    >
      <div className="container mx-auto grid h-full w-full grid-cols-3 items-center gap-2 px-4 md:grid-cols-[1fr_auto_1fr] md:gap-0 md:px-6">
        <Link href="/" className="col-start-1 justify-self-start">
          <Image
            src={logoSrc}
            alt={t("brand")}
            className="h-20 w-auto transition-opacity duration-300"
            priority
          />
        </Link>

        <DesktopNav />

        {isLoadingUser ? (
          <Skeleton
            variant="circular"
            className="col-start-2 size-9 justify-self-center md:hidden"
          />
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

        <DesktopActions />

        <button
          type="button"
          aria-label={t("openMenu")}
          aria-expanded={mobileMenuOpen}
          className="col-start-3 inline-flex size-11 shrink-0 items-center justify-center justify-self-end rounded-lg text-text transition-colors hover:bg-page focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 md:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="size-6" aria-hidden />
        </button>
      </div>

      <Dialog
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        transition
        className="relative z-[120] md:hidden"
      >
        <DialogBackdrop
          transition
          className={cn(
            "fixed inset-0 z-[120] bg-black/40 transition-opacity",
            "data-closed:opacity-0 data-enter:opacity-100 data-leave:opacity-0",
          )}
        />

        <DialogPanel
          transition
          className={cn(
            "fixed inset-0 z-[120] flex h-dvh w-full flex-col overflow-y-auto bg-page text-text outline-none",
            "transition duration-200 ease-out",
            "data-closed:opacity-0 data-enter:opacity-100 data-leave:opacity-0",
          )}
        >
          <MobileMenu
            onNavigate={(path) => router.push(path)}
            onLocaleChange={handleLocaleChange}
            onClose={closeMobileMenu}
            locale={locale}
            navLabel={t("mainNav")}
            languageLabel={t("language")}
            closeMenuLabel={t("closeMenu")}
          />
        </DialogPanel>
      </Dialog>
    </header>
  );
}
