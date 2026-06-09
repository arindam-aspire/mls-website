"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from "@headlessui/react";
import Image from "next/image";
import {
  Bell,
  ChevronRight,
  ClipboardList,
  Globe,
  Heart,
  History,
  Lock,
  LogOut,
  Moon,
  Search,
  Sun,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import mlsLogoDark from "@/src/assets/images/MLS_Dark_Logo.png";
import mlsLogoLight from "@/src/assets/images/MLS_Light_Logo.png";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { IconButton } from "@/src/components/ui/icon-button";
import { UpcomingFeatureModal } from "@/src/components/common/UpcomingFeatureModal";
import { Avatar } from "@/src/components/ui/avatar";
import { Card, CardContent } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { SelectDropdown } from "@/src/components/ui/select-dropdown";
import { SettingField, SwitchField } from "@/src/components/ui/switch";
import { AUTH_VIEW } from "@/src/features/auth/authViews";
import { useLogout } from "@/src/features/auth/mutations/auth.mutation";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
import {
  resolveDrawerAccountLabel,
  shouldShowDrawerNotificationSettings,
} from "@/src/features/auth/utils/resolveDrawerAccountLabel";
import { shouldShowRecentlyViewedMenuItem } from "@/src/features/auth/utils/shouldShowRecentlyViewedMenu";
import { ChangePasswordModal } from "@/src/features/profile/screens/ChangePasswordModal";
import { Link } from "@/src/i18n/navigation";
import type { AppLocale } from "@/src/i18n/routing";
import { isRtlLocale } from "@/src/i18n/routing";
import { cn } from "@/src/lib/cn";
import { profileEmailClasses, profileNameClasses } from "@/src/lib/typography";
import { useTheme, type ThemeMode } from "@/src/providers/ThemeProvider";
import {
  landingMobileHeaderBarClass,
  landingMobileHeaderContainerClass,
  landingMobileHeaderIconButtonClass,
  landingMobileHeaderIconClass,
  landingMobileLogoImageClass,
  landingMobileLogoLinkClass,
} from "./landingMobileHeaderStyles";

// --- Constants ---

const MOBILE_MENU_LOCALE_OPTIONS: { value: AppLocale; label: string }[] = [
  { value: "en", label: "En" },
  { value: "ar", label: "Ar" },
  { value: "es", label: "Sp" },
  { value: "fr", label: "Fr" },
];

const MOBILE_MENU_LANGUAGE_SELECT_WIDTH_CLASS = "w-14";
const MOBILE_MENU_LANGUAGE_TRIGGER_CLASS = "gap-0.5 px-1.5";

const DRAWER_ACTIVITY_ITEMS = [
  { labelKey: "myListings", path: "/listing", icon: ClipboardList },
  { labelKey: "myFavourites", path: "/favourites", icon: Heart },
  { labelKey: "mySavedSearches", path: "/saved-searches", icon: Search },
  { labelKey: "myRecentlyViewed", path: "/recently-viewed", icon: History },
] as const;

const DRAWER_DURATION = "duration-700";

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

const sectionsContainerClass = cn(
  landingMobileHeaderContainerClass,
  "flex flex-col gap-5 py-4 sm:gap-6 sm:py-5",
);

const rowButtonClass =
  "flex w-full min-h-14 items-center gap-3 px-4 py-3 text-start transition-colors hover:bg-page focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary/40 sm:min-h-[3.75rem] sm:px-4";

const rowDividerClass = "border-b border-secondary/10";

const rowIconClass =
  "flex size-10 shrink-0 items-center justify-center rounded-lg bg-page text-text";

const rowLabelClass = "min-w-0 flex-1 text-sm font-medium text-text";

const accountFooterClass = cn(
  landingMobileHeaderContainerClass,
  "py-3 sm:py-4",
);

const drawerCloseButtonClass = cn(
  landingMobileHeaderIconButtonClass,
  "!bg-transparent hover:!bg-page",
);

// --- Hooks ---

function useMobileMenuSections(
  onClose: () => void,
  onNavigate: (path: string) => void,
  onLocaleChange: (locale: string) => void,
  onOpenUpcomingFeature: (icon: ReactNode) => void,
  onOpenChangePasswordModal: () => void,
) {
  const user = useAuthStore((state) => state.user);
  const { theme, setTheme } = useTheme();

  const openAuth = () => {
    useAuthStore.getState().openAuth(AUTH_VIEW.chooseAccount);
    onClose();
  };

  const withAuth = (action: () => void) => {
    if (!user) {
      openAuth();
      return;
    }
    action();
  };

  const handleNavigate = (path: string) => {
    withAuth(() => {
      onNavigate(path);
      onClose();
    });
  };

  const openUpcomingFeature = (icon: ReactNode) => {
    withAuth(() => onOpenUpcomingFeature(icon));
  };

  const openChangePasswordModal = () => {
    withAuth(onOpenChangePasswordModal);
  };

  const handleLocaleChange = (nextLocale: AppLocale) => {
    onLocaleChange(nextLocale);
  };

  const handleThemeChange = (mode: ThemeMode) => {
    setTheme(mode);
  };

  return {
    user,
    theme,
    handleNavigate,
    openUpcomingFeature,
    openChangePasswordModal,
    handleLocaleChange,
    handleThemeChange,
  };
}

function useMobileMenuAccountFooter(
  onClose: () => void,
  onNavigate: (path: string) => void,
  onLogoutPress: () => void,
) {
  const user = useAuthStore((state) => state.user);
  const isLoadingUser = useAuthStore((state) => state.isLoadingUser);

  const roleLabel =
    user?.roles[0]?.name ?? user?.roles[0]?.description ?? user?.email ?? "";

  return {
    user,
    isLoadingUser,
    roleLabel,
    handleSignIn: () => {
      useAuthStore.getState().openAuth(AUTH_VIEW.chooseAccount);
      onClose();
    },
    handleProfilePress: () => {
      onNavigate("/my-profile");
      onClose();
    },
    handleLogoutPress: onLogoutPress,
  };
}

// --- Internal UI ---

function MenuSectionCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted sm:px-1">
        {title}
      </p>
      <Card className="rounded-xl border border-secondary/15 shadow-none">
        <CardContent className="!p-0 sm:!p-0">{children}</CardContent>
      </Card>
    </section>
  );
}

function MenuRow({
  icon: Icon,
  label,
  showDivider = true,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  showDivider?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(rowButtonClass, showDivider && rowDividerClass)}
    >
      <span className={rowIconClass} aria-hidden>
        <Icon className="size-5" />
      </span>
      <span className={rowLabelClass}>{label}</span>
      <ChevronRight
        className="size-4 shrink-0 text-muted rtl:rotate-180"
        aria-hidden
      />
    </button>
  );
}

interface MenuLanguageRowProps {
  value: AppLocale;
  onChange: (locale: AppLocale) => void;
  showDivider?: boolean;
}

function MenuLanguageRow({
  value,
  onChange,
  showDivider = true,
}: MenuLanguageRowProps) {
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
        options={MOBILE_MENU_LOCALE_OPTIONS}
        value={value}
        onChange={(next) => onChange(next as AppLocale)}
        wrapperClassName={MOBILE_MENU_LANGUAGE_SELECT_WIDTH_CLASS}
        triggerClassName={MOBILE_MENU_LANGUAGE_TRIGGER_CLASS}
        aria-label={t("language")}
      />
    </SettingField>
  );
}

interface MenuThemeRowProps {
  value: ThemeMode;
  onChange: (mode: ThemeMode) => void;
  showDivider?: boolean;
}

function MenuThemeRow({
  value,
  onChange,
  showDivider = true,
}: MenuThemeRowProps) {
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

interface MenuContentProps {
  locale: AppLocale;
  closeMenuLabel: string;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onLocaleChange: (locale: string) => void;
  onLogoutPress: () => void;
  onOpenUpcomingFeature: (icon: ReactNode) => void;
  onOpenChangePasswordModal: () => void;
}

function MenuContent({
  locale,
  closeMenuLabel,
  onClose,
  onNavigate,
  onLocaleChange,
  onLogoutPress,
  onOpenUpcomingFeature,
  onOpenChangePasswordModal,
}: MenuContentProps) {
  const t = useTranslations("common");
  const sections = useMobileMenuSections(
    onClose,
    onNavigate,
    onLocaleChange,
    onOpenUpcomingFeature,
    onOpenChangePasswordModal,
  );
  const account = useMobileMenuAccountFooter(onClose, onNavigate, onLogoutPress);
  const { theme } = useTheme();
  const drawerLogoSrc = theme === "dark" ? mlsLogoDark : mlsLogoLight;
  const accountLabel = resolveDrawerAccountLabel(sections.user, t);
  const showNotificationSettings = shouldShowDrawerNotificationSettings(
    sections.user,
  );

  const activityItems = useMemo(
    () =>
      DRAWER_ACTIVITY_ITEMS.filter(
        (item) =>
          item.labelKey !== "myRecentlyViewed" ||
          shouldShowRecentlyViewedMenuItem(sections.user),
      ),
    [sections.user],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-page">
      <div className="sticky top-0 z-10 shrink-0 bg-surface">
        <div className={cn(landingMobileHeaderContainerClass, landingMobileHeaderBarClass)}>
          <Link
            href="/"
            onClick={onClose}
            className={landingMobileLogoLinkClass}
          >
            <Image
              src={drawerLogoSrc}
              alt={t("brand")}
              className={landingMobileLogoImageClass}
              priority
            />
          </Link>
          <IconButton
            type="button"
            icon={<X className={landingMobileHeaderIconClass} aria-hidden />}
            aria-label={closeMenuLabel}
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
          <div className={sectionsContainerClass}>
            {sections.user ? (
              <MenuSectionCard title={t("mobileMenuAccount")}>
                <nav aria-label={t("mobileMenuAccount")}>
                  <ul className="flex flex-col">
                    <li>
                      <MenuRow
                        icon={User}
                        label={accountLabel}
                        onClick={() => sections.handleNavigate("/my-profile")}
                      />
                    </li>
                    <li>
                      <MenuRow
                        icon={Lock}
                        label={t("changePassword")}
                        showDivider={showNotificationSettings}
                        onClick={sections.openChangePasswordModal}
                      />
                    </li>
                    {showNotificationSettings ? (
                      <li>
                        <MenuRow
                          icon={Bell}
                          label={t("notificationSettings")}
                          showDivider={false}
                          onClick={() =>
                            sections.openUpcomingFeature(
                              <Bell className="size-7" aria-hidden />,
                            )
                          }
                        />
                      </li>
                    ) : null}
                  </ul>
                </nav>
              </MenuSectionCard>
            ) : null}

            <MenuSectionCard title={t("mobileMenuPreferences")}>
              <MenuLanguageRow
                value={locale}
                onChange={sections.handleLocaleChange}
              />
              <MenuThemeRow
                value={sections.theme}
                onChange={sections.handleThemeChange}
                showDivider={false}
              />
            </MenuSectionCard>

            {sections.user ? (
              <MenuSectionCard title={t("mobileMenuMyActivity")}>
                <nav aria-label={t("mobileMenuMyActivity")}>
                  <ul className="flex flex-col">
                    {activityItems.map((item, index) => {
                      const isLast = index === activityItems.length - 1;

                      return (
                        <li key={item.path}>
                          <MenuRow
                            icon={item.icon}
                            label={t(item.labelKey)}
                            showDivider={!isLast}
                            onClick={() => sections.handleNavigate(item.path)}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </MenuSectionCard>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 border-t border-secondary/15 bg-surface">
          <div className={accountFooterClass}>
            <div className="flex min-h-14 items-center gap-3 sm:min-h-16">
              {account.isLoadingUser ? (
                <>
                  <Skeleton variant="block" className="size-14 shrink-0 rounded-xl sm:size-16" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <Skeleton variant="text" className="h-4 w-32" />
                    <Skeleton variant="text" className="h-3 w-24" />
                  </div>
                </>
              ) : account.user ? (
                <>
                  <button
                    type="button"
                    onClick={account.handleProfilePress}
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-start transition-colors hover:bg-page focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
                  >
                    <Avatar
                      src={account.user.profile_picture_url}
                      name={account.user.full_name}
                      size="lg"
                      className="!rounded-xl !size-14 sm:!size-16"
                    />
                    <div className="min-w-0 flex-1">
                      <p className={cn("truncate text-text", profileNameClasses)}>
                        {account.user.full_name}
                      </p>
                      <p className={cn("truncate text-muted", profileEmailClasses)}>
                        {account.roleLabel}
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    aria-label={t("signOut")}
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-page hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
                    onClick={account.handleLogoutPress}
                  >
                    <LogOut className="size-5" aria-hidden />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={account.handleSignIn}
                  className="flex w-full min-h-14 items-center gap-3 rounded-lg px-1 text-start transition-colors hover:bg-page focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 sm:min-h-16"
                >
                  <div
                    className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:size-16"
                    aria-hidden
                  >
                    <User className="size-6 sm:size-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={cn("text-text", profileNameClasses)}>{t("signInSignUp")}</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Export ---

export interface LandingMobileMenuProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onLocaleChange: (locale: string) => void;
  locale: AppLocale;
  closeMenuLabel: string;
}

export function LandingMobileMenu({
  open,
  onClose,
  onNavigate,
  onLocaleChange,
  locale,
  closeMenuLabel,
}: LandingMobileMenuProps) {
  const t = useTranslations("common");
  const intlLocale = useLocale();
  const isRtl = isRtlLocale(intlLocale);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isUpcomingFeatureOpen, setIsUpcomingFeatureOpen] = useState(false);
  const [isOpenChangePasswordModal, setIsOpenChangePasswordModal] = useState(false);
  const [upcomingFeatureIcon, setUpcomingFeatureIcon] = useState<ReactNode>(null);
  const { mutate: logout, isPending: isLoggingOut, isSuccess: isLoggedOut } = useLogout();

  useEffect(() => {
    if (isLoggedOut) {
      setShowLogoutConfirm(false);
    }
  }, [isLoggedOut]);

  const handleLogoutPress = () => {
    onClose();
    setShowLogoutConfirm(true);
  };

  const handleOpenUpcomingFeature = (icon: ReactNode) => {
    onClose();
    setUpcomingFeatureIcon(icon);
    setIsUpcomingFeatureOpen(true);
  };

  const closeUpcomingFeature = () => {
    setIsUpcomingFeatureOpen(false);
    setUpcomingFeatureIcon(null);
  };

  const handleOpenChangePasswordModal = () => {
    onClose();
    setIsOpenChangePasswordModal(true);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} transition className="relative z-[120] md:hidden">
        <DialogBackdrop transition className={drawerBackdropClass} />
        <div className="fixed inset-0 z-[120] overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 start-0 flex max-w-full">
              <DialogPanel transition className={drawerPanelClass(isRtl)}>
                <MenuContent
                  locale={locale}
                  closeMenuLabel={closeMenuLabel}
                  onClose={onClose}
                  onNavigate={onNavigate}
                  onLocaleChange={onLocaleChange}
                  onLogoutPress={handleLogoutPress}
                  onOpenUpcomingFeature={handleOpenUpcomingFeature}
                  onOpenChangePasswordModal={handleOpenChangePasswordModal}
                />
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>

      <UpcomingFeatureModal
        open={isUpcomingFeatureOpen}
        onClose={closeUpcomingFeature}
        icon={upcomingFeatureIcon}
      />

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

      <ChangePasswordModal
        isOpenChangePassword={isOpenChangePasswordModal}
        setIsOpenChangePassword={setIsOpenChangePasswordModal}
      />
    </>
  );
}
