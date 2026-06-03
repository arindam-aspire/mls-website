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
    isUpcomingFeatureModalOpen,
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

          {isLoadingUser ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Skeleton variant="circular" className="size-9 sm:size-11" />
              <Skeleton variant="circular" className="size-9 sm:size-11" />
              <span className="h-9 w-px shrink-0 bg-secondary/15 sm:h-10" />
              <Skeleton className="h-9 w-20 rounded-lg sm:h-10 sm:w-24" />
              <Skeleton variant="circular" className="size-9 sm:size-11" />
            </div>
          ) : (
            <>
              <ProtectedThemeButton />
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
        open={isUpcomingFeatureModalOpen}
        onClose={closeUpcomingFeatureModal}
        icon={<Bell className="size-7" aria-hidden />}
      />
    </>
  );
}
