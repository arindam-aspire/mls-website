"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import {
  Bell,
  ChevronRight,
  Globe,
  Lock,
  LogOut,
  Moon,
  Sun,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import mlsLogoDark from "@/src/assets/images/MLS_Dark_Logo.png";
import mlsLogoLight from "@/src/assets/images/MLS_Light_Logo.png";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { UpcomingFeatureModal } from "@/src/components/common/UpcomingFeatureModal";
import { Avatar } from "@/src/components/ui/avatar";
import { IconButton } from "@/src/components/ui/icon-button";
import { Card, CardContent } from "@/src/components/ui/card";
import { SelectDropdown } from "@/src/components/ui/select-dropdown";
import { Skeleton } from "@/src/components/ui/skeleton";
import { SettingField, SwitchField } from "@/src/components/ui/switch";
import { useLogout } from "@/src/features/auth/mutations/auth.mutation";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import {
  resolveDrawerAccountLabel,
  shouldShowDrawerNotificationSettings,
} from "@/src/features/auth/utils/resolveDrawerAccountLabel";
import { resolveProfileRoleLabel } from "@/src/features/auth/utils/resolveProfileRoleLabel";
import { ChangePasswordModal } from "@/src/features/profile/screens/ChangePasswordModal";
import { filterProfileMenuItemsWithRoleAccess } from "@/src/features/auth/utils/profileMenuRoleAccess";
import { DRAWER_ACTIVITY_ITEMS } from "@/src/layouts/shared/drawerActivityItems.config";
import { Link, usePathname, useRouter } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { isRtlLocale } from "@/src/i18n/routing";
import { cn } from "@/src/lib/cn";
import { profileEmailClasses, profileNameClasses } from "@/src/lib/typography";
import { useTheme, type ThemeMode } from "@/src/providers/ThemeProvider";
import {
  protectedDrawerFooterClass,
  protectedDrawerHeaderBarClass,
  protectedDrawerLogoImageClass,
  protectedDrawerLogoLinkClass,
  protectedDrawerSectionsContainerClass,
  protectedMobileHeaderContainerClass,
  protectedMobileHeaderIconButtonClass,
  protectedMobileHeaderIconClass,
} from "@/src/layouts/protected-layout/protectedMobileHeaderStyles";

const DRAWER_DURATION = "duration-700";

const DRAWER_LOCALE_OPTIONS: { value: AppLocale; label: string }[] = [
  { value: "en", label: "En" },
  { value: "ar", label: "Ar" },
  { value: "es", label: "Sp" },
  { value: "fr", label: "Fr" },
];

const PROFILE_PATH = "/my-profile";

const rowLinkClass =
  "flex w-full min-h-14 items-center gap-3 px-4 py-3 text-start transition-colors hover:bg-page focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary/40 sm:min-h-[3.75rem] sm:px-4";

const rowDividerClass = "border-b border-secondary/10";

const rowIconClass =
  "flex size-10 shrink-0 items-center justify-center rounded-lg bg-page text-text";

const rowLabelClass = "min-w-0 flex-1 text-sm font-medium text-text";

const LANGUAGE_SELECT_WIDTH_CLASS = "w-14";
const LANGUAGE_TRIGGER_CLASS = "gap-0.5 px-1.5";

const drawerCloseButtonClass = cn(
  protectedMobileHeaderIconButtonClass,
  "!bg-transparent hover:!bg-page",
);

const drawerBackdropClass = cn(
  "fixed inset-0 bg-black/40 transition-opacity ease-out",
  DRAWER_DURATION,
  "data-closed:opacity-0 data-enter:opacity-100 data-leave:opacity-0",
);

function drawerPanelClass(isRtl: boolean) {
  return cn(
    "pointer-events-auto relative flex h-dvh w-[90vw] max-w-[36rem] flex-col overflow-hidden bg-page text-text shadow-xl outline-none",
    "transform transition ease-in-out",
    DRAWER_DURATION,
    isRtl ? "data-closed:translate-x-full" : "data-closed:-translate-x-full",
  );
}

function useDrawerSystemOptions() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as AppLocale;
  const { theme, setTheme } = useTheme();

  const handleLocaleChange = useCallback(
    (nextLocale: AppLocale) => {
      router.replace(pathname, { locale: nextLocale });
    },
    [pathname, router],
  );

  const handleThemeChange = useCallback(
    (mode: ThemeMode) => {
      setTheme(mode);
    },
    [setTheme],
  );

  return {
    locale,
    theme,
    handleLocaleChange,
    handleThemeChange,
  };
}

function useDrawerFooter(onClose: () => void) {
  const t = useTranslations("common");
  const tAuth = useTranslations("auth");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);

  const roleLabel = useMemo(
    () => (user ? resolveProfileRoleLabel(user, tAuth) : ""),
    [tAuth, user],
  );

  const handleProfilePress = () => {
    router.push(PROFILE_PATH);
    onClose();
  };

  return {
    t,
    user,
    isLoadingUser,
    roleLabel,
    handleProfilePress,
  };
}

function DrawerSectionCard({
  title,
  children,
  className,
  contentClassName,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section>
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted sm:px-1">
        {title}
      </p>
      <Card className={cn("rounded-xl border border-secondary/15 shadow-none", className)}>
        <CardContent className={cn("!p-0 sm:!p-0", contentClassName)}>
          {children}
        </CardContent>
      </Card>
    </section>
  );
}

function DrawerNavLink({
  href,
  icon: Icon,
  label,
  isActive,
  onNavigate,
  showDivider = true,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onNavigate?: () => void;
  showDivider?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
      className={cn(rowLinkClass, showDivider && rowDividerClass)}
    >
      <span className={rowIconClass}>
        <Icon className="size-5" aria-hidden />
      </span>
      <span className={rowLabelClass}>{label}</span>
      <ChevronRight
        className="size-4 shrink-0 text-muted rtl:rotate-180"
        aria-hidden
      />
    </Link>
  );
}

function DrawerNavButton({
  icon: Icon,
  label,
  onClick,
  showDivider = true,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  showDivider?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(rowLinkClass, showDivider && rowDividerClass)}
    >
      <span className={rowIconClass}>
        <Icon className="size-5" aria-hidden />
      </span>
      <span className={rowLabelClass}>{label}</span>
      <ChevronRight
        className="size-4 shrink-0 text-muted rtl:rotate-180"
        aria-hidden
      />
    </button>
  );
}

function DrawerAccountSection({
  onNavigate,
  onChangePassword,
  onNotificationSettings,
}: {
  onNavigate?: () => void;
  onChangePassword: () => void;
  onNotificationSettings: () => void;
}) {
  const t = useTranslations("common");
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const accountLabel = resolveDrawerAccountLabel(user, t);
  const showNotificationSettings = shouldShowDrawerNotificationSettings(user);

  const isProfileActive =
    pathname === PROFILE_PATH || pathname.startsWith(`${PROFILE_PATH}/`);

  return (
    <DrawerSectionCard title={t("mobileMenuAccount")}>
      <nav aria-label={t("mobileMenuAccount")}>
        <ul className="flex flex-col">
          <li>
            <DrawerNavLink
              href={PROFILE_PATH}
              icon={User}
              label={accountLabel}
              isActive={isProfileActive}
              onNavigate={onNavigate}
            />
          </li>
          <li>
            <DrawerNavButton
              icon={Lock}
              label={t("changePassword")}
              onClick={onChangePassword}
              showDivider={showNotificationSettings}
            />
          </li>
          {showNotificationSettings ? (
            <li>
              <DrawerNavButton
                icon={Bell}
                label={t("notificationSettings")}
                onClick={onNotificationSettings}
                showDivider={false}
              />
            </li>
          ) : null}
        </ul>
      </nav>
    </DrawerSectionCard>
  );
}

function DrawerPreferencesSection() {
  const t = useTranslations("common");
  const { locale, theme, handleLocaleChange, handleThemeChange } =
    useDrawerSystemOptions();

  return (
    <DrawerSectionCard title={t("mobileMenuPreferences")}>
      <DrawerLanguageRow value={locale} onChange={handleLocaleChange} />
      <DrawerThemeRow
        value={theme}
        onChange={handleThemeChange}
        showDivider={false}
      />
    </DrawerSectionCard>
  );
}

function DrawerMyActivitySection({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("common");
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const items = user
    ? filterProfileMenuItemsWithRoleAccess(DRAWER_ACTIVITY_ITEMS, user)
    : [];

  if (items.length === 0) {
    return null;
  }

  return (
    <DrawerSectionCard title={t("mobileMenuMyActivity")}>
      <nav aria-label={t("mobileMenuMyActivity")}>
        <ul className="flex flex-col">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isActive =
              pathname === item.path || pathname.startsWith(`${item.path}/`);

            return (
              <li key={item.labelKey}>
                <DrawerNavLink
                  href={item.path}
                  icon={item.icon}
                  label={t(item.labelKey)}
                  isActive={isActive}
                  onNavigate={onNavigate}
                  showDivider={!isLast}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    </DrawerSectionCard>
  );
}

function DrawerLanguageRow({
  value,
  onChange,
  showDivider = true,
}: {
  value: AppLocale;
  onChange: (locale: AppLocale) => void;
  showDivider?: boolean;
}) {
  const t = useTranslations("common");

  return (
    <SettingField
      className={cn("px-4 py-3 sm:px-4", showDivider && rowDividerClass)}
      icon={<Globe className="size-5" aria-hidden />}
      title={t("language")}
      description={t("languageSwitchDescription")}
    >
      <SelectDropdown
        fullWidth={false}
        size="sm"
        variant="outline"
        placeholder={t("language")}
        includePlaceholderOption={false}
        listboxModal={false}
        options={DRAWER_LOCALE_OPTIONS}
        value={value}
        onChange={(next) => onChange(next as AppLocale)}
        wrapperClassName={LANGUAGE_SELECT_WIDTH_CLASS}
        triggerClassName={LANGUAGE_TRIGGER_CLASS}
        aria-label={t("language")}
      />
    </SettingField>
  );
}

function DrawerThemeRow({
  value,
  onChange,
  showDivider = true,
}: {
  value: ThemeMode;
  onChange: (mode: ThemeMode) => void;
  showDivider?: boolean;
}) {
  const t = useTranslations("common");
  const isDark = value === "dark";
  const ThemeIcon = isDark ? Moon : Sun;

  return (
    <SwitchField
      className={cn("px-4 py-3 sm:px-4", showDivider && rowDividerClass)}
      icon={<ThemeIcon className="size-5" aria-hidden />}
      title={t("themeMode")}
      description={t(isDark ? "themeSwitchToLight" : "themeSwitchToDark")}
      checked={isDark}
      onChange={(checked) => onChange(checked ? "dark" : "light")}
      aria-label={t("theme")}
      color="primary"
    />
  );
}

function DrawerFooter({
  onClose,
  onLogoutPress,
}: {
  onClose: () => void;
  onLogoutPress: () => void;
}) {
  const { t, user, isLoadingUser, roleLabel, handleProfilePress } =
    useDrawerFooter(onClose);

  return (
    <div className="shrink-0 border-t border-secondary/15 bg-surface">
      <div className={protectedDrawerFooterClass}>
        <div className="flex min-h-14 items-center gap-3 sm:min-h-16">
          {isLoadingUser ? (
            <>
              <Skeleton variant="block" className="size-14 shrink-0 rounded-xl sm:size-16" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton variant="text" className="h-4 w-32" />
                <Skeleton variant="text" className="h-3 w-24" />
              </div>
            </>
          ) : user ? (
            <>
              <button
                type="button"
                onClick={handleProfilePress}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-start transition-colors hover:bg-page focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
              >
                <Avatar
                  src={user.profile_picture_url}
                  name={user.full_name}
                  size="lg"
                  className="!rounded-xl !size-14 sm:!size-16"
                />
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-text", profileNameClasses)}>
                    {user.full_name}
                  </p>
                  <p className={cn("truncate text-muted", profileEmailClasses)}>
                    {roleLabel}
                  </p>
                </div>
              </button>
              <button
                type="button"
                aria-label={t("signOut")}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-page hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
                onClick={onLogoutPress}
              >
                <LogOut className="size-5" aria-hidden />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export interface ProtectedMobileDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Accessible label for the close control (i18n). */
  closeLabel: string;
  className?: string;
}

export function ProtectedMobileDrawer({
  open,
  onClose,
  closeLabel,
  className,
}: ProtectedMobileDrawerProps) {
  const t = useTranslations("common");
  const locale = useLocale();
  const isRtl = isRtlLocale(locale);
  const { theme } = useTheme();
  const drawerLogoSrc = theme === "dark" ? mlsLogoDark : mlsLogoLight;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isUpcomingFeatureOpen, setIsUpcomingFeatureOpen] = useState(false);
  const { mutate: logout, isPending: isLoggingOut, isSuccess: isLoggedOut } =
    useLogout();

  useEffect(() => {
    if (isLoggedOut) {
      setShowLogoutConfirm(false);
    }
  }, [isLoggedOut]);

  const handleLogoutPress = () => {
    onClose();
    setShowLogoutConfirm(true);
  };

  const handleChangePassword = () => {
    onClose();
    setIsChangePasswordOpen(true);
  };

  const handleNotificationSettings = () => {
    onClose();
    setIsUpcomingFeatureOpen(true);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        transition
        className={cn("relative z-[120] md:hidden", className)}
      >
        <DialogBackdrop transition className={drawerBackdropClass} />
        <div className="fixed inset-0 z-[120] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 start-0 flex max-w-full">
              <DialogPanel transition className={drawerPanelClass(isRtl)}>
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-page">
                  <div className="sticky top-0 z-10 shrink-0 bg-surface">
                    <div
                      className={cn(
                        protectedMobileHeaderContainerClass,
                        protectedDrawerHeaderBarClass,
                      )}
                    >
                      <Link
                        href="/"
                        onClick={onClose}
                        className={protectedDrawerLogoLinkClass}
                      >
                        <Image
                          src={drawerLogoSrc}
                          alt={t("brand")}
                          className={protectedDrawerLogoImageClass}
                          priority
                        />
                      </Link>
                      <IconButton
                        type="button"
                        icon={
                          <X
                            className={protectedMobileHeaderIconClass}
                            aria-hidden
                          />
                        }
                        aria-label={closeLabel}
                        color="inherit"
                        variant="outline"
                        size="md"
                        className={drawerCloseButtonClass}
                        onClick={onClose}
                      />
                    </div>
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col">
                    <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
                      <div className={protectedDrawerSectionsContainerClass}>
                        <DrawerAccountSection
                          onNavigate={onClose}
                          onChangePassword={handleChangePassword}
                          onNotificationSettings={handleNotificationSettings}
                        />
                        <DrawerPreferencesSection />
                        <DrawerMyActivitySection onNavigate={onClose} />
                      </div>
                    </div>

                    <DrawerFooter onClose={onClose} onLogoutPress={handleLogoutPress} />
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>

      <ConfirmModal
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => logout()}
        variant="primary"
        title={t("signOut")}
        description={t("logoutConfirmDescription")}
        icon={<LogOut className="size-6" aria-hidden />}
        confirmLabel={t("signOut")}
        isLoading={isLoggingOut}
        loadingLabel={t("signingOut")}
        confirmIcon={<LogOut className="size-4" aria-hidden />}
        cancelLabel={t("logoutCancel")}
      />

      <UpcomingFeatureModal
        open={isUpcomingFeatureOpen}
        onClose={() => setIsUpcomingFeatureOpen(false)}
        icon={<Bell className="size-7" aria-hidden />}
      />

      <ChangePasswordModal
        isOpenChangePassword={isChangePasswordOpen}
        setIsOpenChangePassword={setIsChangePasswordOpen}
      />
    </>
  );
}
