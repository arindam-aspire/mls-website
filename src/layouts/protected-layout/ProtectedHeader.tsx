"use client";

import { Bell, Globe, Menu } from "lucide-react";
import Image from "next/image";
import { UpcomingFeatureModal } from "@/src/components/common/UpcomingFeatureModal";
import { IconButton } from "@/src/components/ui/icon-button";
import { SelectDropdown } from "@/src/components/ui/select-dropdown";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Link } from "@/src/i18n/navigation";
import { ProtectedMobileMenu } from "@/src/layouts/protected-layout/ProtectedMobileMenu";
import { ProtectedNotificationsButton } from "@/src/layouts/protected-layout/ProtectedNotificationsButton";
import { ProtectedProfileMenu } from "@/src/layouts/protected-layout/ProtectedProfileMenu";
import { SaveSearchPopover } from "@/src/features/saved-searches/popovers/SaveSearchPopover";
import { ProtectedThemeButton } from "@/src/layouts/protected-layout/ProtectedThemeButton";
import {
  protectedMobileHeaderBarClass,
  protectedMobileHeaderIconButtonClass,
  protectedMobileHeaderIconClass,
  protectedMobileLogoImageClass,
  protectedMobileLogoLinkClass,
} from "@/src/layouts/protected-layout/protectedMobileHeaderStyles";
import { useProtectedHeader } from "@/src/layouts/protected-layout/hooks/useProtectedHeader";
import { cn } from "@/src/lib/cn";

export function ProtectedHeader() {
  const {
    t,
    locale,
    localeOptions,
    user,
    isLoadingUser,
    headerLogoSrc,
    handleLocaleChange,
    upcomingFeatureModal,
    openNotifications,
    closeUpcomingFeatureModal,
    isMobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
  } = useProtectedHeader();

  const mobileIconButtonClass = cn(
    protectedMobileHeaderIconButtonClass,
    "!bg-transparent hover:!bg-page",
  );

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
                <Skeleton variant="circular" className="size-9 sm:size-11" />
                <Skeleton variant="circular" className="size-9 sm:size-11" />
              </>
            ) : user ? (
              <>
                <ProtectedNotificationsButton onClick={openNotifications} />
                <IconButton
                  type="button"
                  icon={
                    <Menu className={protectedMobileHeaderIconClass} aria-hidden />
                  }
                  aria-label={t("openMenu")}
                  aria-expanded={isMobileMenuOpen}
                  color="inherit"
                  variant="outline"
                  size="md"
                  className={mobileIconButtonClass}
                  onClick={openMobileMenu}
                />
              </>
            ) : null}
          </div>
        </div>

        <div className="hidden h-16 items-center justify-end gap-2 px-4 md:flex sm:h-20 sm:gap-3 sm:px-6">
          {isLoadingUser ? (
            <>
              <Skeleton variant="circular" className="size-9 shrink-0 sm:size-11" aria-hidden />
              <Skeleton
                variant="circular"
                className="hidden size-9 shrink-0 md:block sm:size-11"
                aria-hidden
              />
              <SelectDropdown
                variant="outline"
                size="md"
                iconStart={<Globe aria-hidden />}
                aria-label={t("language")}
                placeholder={t("language")}
                includePlaceholderOption={false}
                options={localeOptions}
                value={locale}
                onChange={handleLocaleChange}
                fullWidth={false}
                wrapperClassName="relative z-[60] w-auto shrink-0"
              />
              <Skeleton variant="circular" className="size-9 shrink-0 sm:size-11" aria-hidden />
              <span className="h-9 w-px shrink-0 bg-secondary/15 sm:h-10" aria-hidden />
              <Skeleton className="hidden h-9 w-24 shrink-0 rounded-lg lg:block lg:h-10" aria-hidden />
              <Skeleton variant="circular" className="size-9 shrink-0 sm:size-11" aria-hidden />
            </>
          ) : (
            <>
              <ProtectedThemeButton />
              <SaveSearchPopover enabled={Boolean(user)} />
              <SelectDropdown
                variant="outline"
                size="md"
                iconStart={<Globe aria-hidden />}
                aria-label={t("language")}
                placeholder={t("language")}
                includePlaceholderOption={false}
                options={localeOptions}
                value={locale}
                onChange={handleLocaleChange}
                fullWidth={false}
                wrapperClassName="relative z-[60] w-auto shrink-0"
              />
              {user ? (
                <>
                  <ProtectedNotificationsButton onClick={openNotifications} />
                  <ProtectedProfileMenu user={user} />
                </>
              ) : null}
            </>
          )}
        </div>
      </header>

      <ProtectedMobileMenu
        open={isMobileMenuOpen}
        onClose={closeMobileMenu}
      />

      <UpcomingFeatureModal
        open={upcomingFeatureModal}
        onClose={closeUpcomingFeatureModal}
        icon={<Bell className="size-7" aria-hidden />}
      />
    </>
  );
}
