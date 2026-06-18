"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import { IconButton } from "@/src/components/ui/icon-button";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Link } from "@/src/i18n/navigation";
import { ProtectedFullscreenButton } from "@/src/layouts/protected-layout/ProtectedFullscreenButton";
import { ProtectedLanguageSelect } from "@/src/layouts/protected-layout/ProtectedLanguageSelect";
import { ProtectedMobileMenu } from "@/src/layouts/protected-layout/ProtectedMobileMenu";
import { ProtectedProfileMenu } from "@/src/layouts/protected-layout/ProtectedProfileMenu";
import { NotificationsPopover } from "@/src/features/notifications/popovers/NotificationsPopover";
import { SaveSearchPopover } from "@/src/features/saved-searches/popovers/SaveSearchPopover";
import { ProtectedThemeButton } from "@/src/layouts/protected-layout/ProtectedThemeButton";
import {
  protectedHeaderIconButtonClass,
  protectedHeaderControlDividerClass,
  protectedHeaderIconButtonSizeClass,
  protectedMobileHeaderBarClass,
  protectedMobileHeaderIconClass,
  protectedMobileLogoImageClass,
  protectedMobileLogoLinkClass,
} from "@/src/layouts/protected-layout/protectedMobileHeaderStyles";
import {
  publicMobileLogoImageClass,
  publicMobileLogoLinkClass,
} from "@/src/layouts/public-layout/publicMobileHeaderStyles";
import { useProtectedHeader } from "@/src/layouts/protected-layout/hooks/useProtectedHeader";
import { cn } from "@/src/lib/cn";

export function ProtectedHeader() {
  const {
    t,
    locale,
    localeOptions,
    user,
    isLoadingUser,
    hasUnreadNotifications,
    notificationUnreadCount,
    showHeaderLogo,
    headerLogoSrc,
    handleLocaleChange,
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
  } = useProtectedHeader();

  const mobileIconButtonClass = protectedHeaderIconButtonClass;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-secondary/15 bg-surface">
        <div
          className={cn(
            protectedMobileHeaderBarClass,
            "px-4 md:hidden sm:px-6",
          )}
        >
          <Link
            href="/"
            className={protectedMobileLogoLinkClass}
            aria-label={t("brand")}
          >
            <Image
              src={headerLogoSrc}
              alt={t("brand")}
              priority
              className={cn(
                protectedMobileLogoImageClass,
                "h-12 sm:h-14",
              )}
            />
          </Link>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {isLoadingUser ? (
              <>
                <Skeleton
                  variant="circular"
                  className={cn(protectedHeaderIconButtonSizeClass, "shrink-0")}
                />
                <Skeleton
                  variant="circular"
                  className={cn(protectedHeaderIconButtonSizeClass, "shrink-0")}
                />
              </>
            ) : user ? (
              <>
                <NotificationsPopover
                  enabled
                  hasUnread={hasUnreadNotifications}
                  unreadCount={notificationUnreadCount}
                  controlSize="sm"
                />
                <IconButton
                  type="button"
                  icon={
                    <Menu className={protectedMobileHeaderIconClass} aria-hidden />
                  }
                  aria-label={t("openMenu")}
                  aria-expanded={isMobileMenuOpen}
                  color="inherit"
                  variant="outline"
                  isRounded
                  size="sm"
                  className={mobileIconButtonClass}
                  onClick={openMobileMenu}
                />
              </>
            ) : null}
          </div>
        </div>

        <div
          className={cn(
            "hidden h-16 items-center gap-2 px-4 md:flex sm:h-20 sm:gap-3 sm:px-6",
            showHeaderLogo ? "justify-between" : "justify-end",
          )}
        >
          {showHeaderLogo ? (
            <Link
              href="/"
              className={cn(publicMobileLogoLinkClass, "max-w-none justify-self-start")}
              aria-label={t("brand")}
            >
              <Image
                src={headerLogoSrc}
                alt={t("brand")}
                priority
                className={cn(publicMobileLogoImageClass, "h-16 md:h-20")}
              />
            </Link>
          ) : null}

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isLoadingUser ? (
            <>
              <Skeleton
                variant="circular"
                className={cn(protectedHeaderIconButtonSizeClass, "shrink-0")}
                aria-hidden
              />
              <Skeleton
                variant="circular"
                className={cn(protectedHeaderIconButtonSizeClass, "shrink-0")}
                aria-hidden
              />
              <Skeleton
                variant="circular"
                className={cn(
                  protectedHeaderIconButtonSizeClass,
                  "hidden shrink-0 md:block",
                )}
                aria-hidden
              />
              <Skeleton
                variant="circular"
                className={cn(protectedHeaderIconButtonSizeClass, "shrink-0")}
                aria-hidden
              />
              <Skeleton
                className="h-8 w-14 shrink-0 rounded-lg sm:h-9 lg:h-10"
                aria-hidden
              />
              <span className={cn(protectedHeaderControlDividerClass, "hidden md:block")} aria-hidden />
              <Skeleton
                className="hidden h-8 w-24 shrink-0 rounded-lg sm:h-9 md:block lg:h-10"
                aria-hidden
              />
              <Skeleton
                variant="circular"
                className={cn(protectedHeaderIconButtonSizeClass, "shrink-0")}
                aria-hidden
              />
            </>
          ) : (
            <>
              <ProtectedThemeButton />
              <ProtectedFullscreenButton />
              <SaveSearchPopover enabled={Boolean(user)} controlSize="sm" />
              {user ? (
                <NotificationsPopover
                  enabled
                  hasUnread={hasUnreadNotifications}
                  unreadCount={notificationUnreadCount}
                  controlSize="sm"
                />
              ) : null}
              <ProtectedLanguageSelect
                value={locale}
                options={localeOptions}
                onChange={handleLocaleChange}
                ariaLabel={t("language")}
                className="relative z-[60]"
              />
              {user ? <ProtectedProfileMenu user={user} /> : null}
            </>
          )}
          </div>
        </div>
      </header>

      <ProtectedMobileMenu
        open={isMobileMenuOpen}
        onClose={closeMobileMenu}
      />

    </>
  );
}
