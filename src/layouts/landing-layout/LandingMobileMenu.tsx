"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Image from "next/image";
import {
  Bell,
  Building2,
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
import { useEffect, useState, type ReactNode } from "react";
import mlsLogoDark from "@/src/assets/images/MLS_Dark_Logo.png";
import { ConfirmModal } from "@/src/components/common/ConfirmModal";
import { UpcomingFeatureModal } from "@/src/components/common/UpcomingFeatureModal";
import { Avatar } from "@/src/components/ui/avatar";
import { Skeleton } from "@/src/components/ui/skeleton";
import { AUTH_VIEW } from "@/src/features/auth/authViews";
import { useLogout } from "@/src/features/auth/mutations/auth.mutation";
import { useAuthStore } from "@/src/features/auth/store/auth.store";
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
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
];

const MOBILE_MENU_THEME_OPTIONS = [
  { value: "light" as const, labelKey: "themeLight" },
  { value: "dark" as const, labelKey: "themeDark" },
];

const THEME_OPTION_ICONS = { light: Sun, dark: Moon } as const;

const DRAWER_DURATION = "duration-700";

const drawerBackdropClass = cn(
  "fixed inset-0 bg-black/40 transition-opacity ease-out",
  DRAWER_DURATION,
  "data-closed:opacity-0 data-enter:opacity-100 data-leave:opacity-0",
);

function drawerPanelClass(isRtl: boolean) {
  return cn(
    "pointer-events-auto relative flex h-dvh w-[calc(85vw-1rem)] max-w-[36rem] flex-col overflow-hidden bg-page text-text shadow-xl outline-none",
    "transform transition ease-in-out",
    DRAWER_DURATION,
    isRtl ? "data-closed:translate-x-full" : "data-closed:-translate-x-full",
  );
}

const sectionsContainerClass = cn(
  landingMobileHeaderContainerClass,
  "flex flex-col gap-5 py-4 sm:gap-6 sm:py-5",
);

const sectionTitleClass =
  "pb-2 text-xs font-semibold uppercase tracking-wide text-muted";

const rowButtonClass =
  "flex w-full min-h-14 items-center gap-3 py-3 text-start transition-colors hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary/40 sm:min-h-[3.75rem]";

const rowDividerClass = "border-b border-secondary/10";

const rowIconClass =
  "flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface text-text";

const rowLabelClass = "min-w-0 flex-1 text-sm font-medium text-text";

const rowTrailingClass =
  "flex shrink-0 items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted";

const accountFooterClass = cn(
  landingMobileHeaderContainerClass,
  "border-t border-secondary/15 py-3 sm:py-4",
);

const pickerPanelClass = cn(
  "flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-secondary/15 bg-surface text-text shadow-lg",
  "transition duration-300 ease-out",
  "data-closed:translate-y-full data-closed:opacity-0 data-enter:translate-y-0 data-enter:opacity-100 data-leave:translate-y-full data-leave:opacity-0",
  "sm:data-closed:scale-95 sm:data-closed:translate-y-0",
);

const pickerBackdropClass =
  "fixed inset-0 bg-black/40 transition-opacity duration-300 ease-out data-closed:opacity-0 data-enter:opacity-100 data-leave:opacity-0";

// --- Hooks ---

function useMobileMenuSections(
  onClose: () => void,
  onNavigate: (path: string) => void,
  onLocaleChange: (locale: string) => void,
) {
  const user = useAuthStore((state) => state.user);
  const { theme, setTheme } = useTheme();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isUpcomingFeatureOpen, setIsUpcomingFeatureOpen] = useState(false);
  const [upcomingFeatureIcon, setUpcomingFeatureIcon] = useState<ReactNode>(null);

  const openAuth = () => {
    useAuthStore.getState().openAuth(AUTH_VIEW.chooseAccount);
    onClose();
  };

  const openForgotPassword = () => {
    useAuthStore.getState().openAuth(AUTH_VIEW.forgotPassword);
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
    withAuth(() => {
      setUpcomingFeatureIcon(icon);
      setIsUpcomingFeatureOpen(true);
    });
  };

  const closeUpcomingFeature = () => {
    setIsUpcomingFeatureOpen(false);
    setUpcomingFeatureIcon(null);
  };

  const handleLocaleSelect = (nextLocale: AppLocale) => {
    onLocaleChange(nextLocale);
    setIsLanguageOpen(false);
    onClose();
  };

  const handleThemeSelect = (mode: ThemeMode) => {
    setTheme(mode);
    setIsThemeOpen(false);
  };

  return {
    user,
    theme,
    isLanguageOpen,
    isThemeOpen,
    isUpcomingFeatureOpen,
    upcomingFeatureIcon,
    handleNavigate,
    openUpcomingFeature,
    closeUpcomingFeature,
    openLanguagePicker: () => setIsLanguageOpen(true),
    closeLanguagePicker: () => setIsLanguageOpen(false),
    handleLocaleSelect,
    openThemePicker: () => setIsThemeOpen(true),
    closeThemePicker: () => setIsThemeOpen(false),
    handleThemeSelect,
    handleChangePassword: () => withAuth(openForgotPassword),
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

interface MenuRowProps {
  icon: LucideIcon;
  label: string;
  trailing?: ReactNode;
  showChevron?: boolean;
  showDivider?: boolean;
  onClick: () => void;
}

function MenuRow({
  icon: Icon,
  label,
  trailing,
  showChevron = true,
  showDivider = true,
  onClick,
}: MenuRowProps) {
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
      {(trailing || showChevron) && (
        <span className={rowTrailingClass}>
          {trailing}
          {showChevron ? (
            <ChevronRight className="size-4 shrink-0 text-muted rtl:rotate-180" aria-hidden />
          ) : null}
        </span>
      )}
    </button>
  );
}

function MenuSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className={sectionTitleClass}>{title}</h2>
      <div className="flex flex-col">{children}</div>
    </section>
  );
}

interface PickerSheetProps {
  open: boolean;
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
}

function PickerSheet({ open, title, closeLabel, onClose, children }: PickerSheetProps) {
  return (
    <Dialog open={open} onClose={onClose} transition className="relative z-[130]">
      <DialogBackdrop transition className={pickerBackdropClass} />
      <div className="fixed inset-0 z-[130] flex items-end justify-center p-4 sm:items-center">
        <DialogPanel transition className={pickerPanelClass}>
          <div className="flex items-center justify-between border-b border-secondary/15 px-4 py-3 sm:px-5">
            <DialogTitle className="text-base font-semibold text-text">{title}</DialogTitle>
            <button
              type="button"
              aria-label={closeLabel}
              onClick={onClose}
              className="inline-flex size-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-page hover:text-text focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>
          {children}
        </DialogPanel>
      </div>
    </Dialog>
  );
}

interface MenuContentProps {
  locale: AppLocale;
  closeMenuLabel: string;
  onClose: () => void;
  onNavigate: (path: string) => void;
  onLocaleChange: (locale: string) => void;
  onLogoutPress: () => void;
}

function MenuContent({
  locale,
  closeMenuLabel,
  onClose,
  onNavigate,
  onLocaleChange,
  onLogoutPress,
}: MenuContentProps) {
  const t = useTranslations("common");
  const sections = useMobileMenuSections(onClose, onNavigate, onLocaleChange);
  const account = useMobileMenuAccountFooter(onClose, onNavigate, onLogoutPress);

  const ThemeStatusIcon = sections.theme === "light" ? Sun : Moon;
  const themeTrailingLabel =
    sections.theme === "light" ? t("themeLight") : t("themeDark");

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-page">
      <div className="sticky top-0 z-10 shrink-0 bg-primary">
        <div className={cn(landingMobileHeaderContainerClass, landingMobileHeaderBarClass)}>
          <Link
            href="/"
            onClick={onClose}
            className={cn(landingMobileLogoLinkClass, "focus-visible:ring-white/40")}
          >
            <Image
              src={mlsLogoDark}
              alt={t("brand")}
              className={landingMobileLogoImageClass}
              priority
            />
          </Link>
          <button
            type="button"
            aria-label={closeMenuLabel}
            className={cn(
              landingMobileHeaderIconButtonClass,
              "!text-white hover:!bg-white/15 focus-visible:ring-white/40",
            )}
            onClick={onClose}
          >
            <X className={landingMobileHeaderIconClass} aria-hidden />
          </button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [scrollbar-width:thin]">
          <div className={sectionsContainerClass}>
            {sections.user ? (
              <MenuSection title={t("mobileMenuAccount")}>
                <MenuRow
                  icon={User}
                  label={t("profilePersonalInfo")}
                  onClick={() => sections.handleNavigate("/my-profile")}
                />
                <MenuRow
                  icon={Building2}
                  label={t("agencySettings")}
                  onClick={() =>
                    sections.openUpcomingFeature(<Building2 className="size-7" aria-hidden />)
                  }
                />
                <MenuRow
                  icon={Bell}
                  label={t("notificationSettings")}
                  onClick={() =>
                    sections.openUpcomingFeature(<Bell className="size-7" aria-hidden />)
                  }
                />
                <MenuRow
                  icon={Lock}
                  label={t("changePassword")}
                  showDivider={false}
                  onClick={sections.handleChangePassword}
                />
              </MenuSection>
            ) : null}

            <MenuSection title={t("mobileMenuGeneral")}>
              <MenuRow
                icon={Globe}
                label={t("language")}
                trailing={locale.toUpperCase()}
                onClick={sections.openLanguagePicker}
              />
              <MenuRow
                icon={ThemeStatusIcon}
                label={t("theme")}
                trailing={themeTrailingLabel}
                showDivider={false}
                onClick={sections.openThemePicker}
              />
            </MenuSection>

            {sections.user ? (
              <MenuSection title={t("mobileMenuPreferences")}>
                <MenuRow
                  icon={Heart}
                  label={t("myFavourites")}
                  onClick={() => sections.handleNavigate("/favourites")}
                />
                <MenuRow
                  icon={ClipboardList}
                  label={t("myListings")}
                  onClick={() => sections.handleNavigate("/listing")}
                />
                <MenuRow
                  icon={Search}
                  label={t("mySavedSearches")}
                  onClick={() => sections.handleNavigate("/saved-searches")}
                />
                <MenuRow
                  icon={History}
                  label={t("myRecentlyViewed")}
                  showDivider={false}
                  onClick={() => sections.handleNavigate("/recently-viewed")}
                />
              </MenuSection>
            ) : null}
          </div>
        </div>

        <div className="shrink-0 border-t border-secondary/15">
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
                    className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-start transition-colors hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
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
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-danger focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40"
                    onClick={account.handleLogoutPress}
                  >
                    <LogOut className="size-5" aria-hidden />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={account.handleSignIn}
                  className="flex w-full min-h-14 items-center gap-3 rounded-lg px-1 text-start transition-colors hover:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/40 sm:min-h-16"
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

      <PickerSheet
        open={sections.isLanguageOpen}
        title={t("language")}
        closeLabel={closeMenuLabel}
        onClose={sections.closeLanguagePicker}
      >
        <div className="flex flex-col" role="listbox" aria-label={t("language")}>
          {MOBILE_MENU_LOCALE_OPTIONS.map(({ value, label }, index) => {
            const isActive = locale === value;
            const isLast = index === MOBILE_MENU_LOCALE_OPTIONS.length - 1;
            return (
              <button
                key={value}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => sections.handleLocaleSelect(value)}
                className={cn(rowButtonClass, !isLast && rowDividerClass, isActive && "bg-primary/5")}
              >
                <span className={cn(rowLabelClass, "font-semibold")}>{label}</span>
                <span className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {value}
                </span>
              </button>
            );
          })}
        </div>
      </PickerSheet>

      <PickerSheet
        open={sections.isThemeOpen}
        title={t("theme")}
        closeLabel={closeMenuLabel}
        onClose={sections.closeThemePicker}
      >
        <div className="flex flex-col" role="listbox" aria-label={t("theme")}>
          {MOBILE_MENU_THEME_OPTIONS.map(({ value, labelKey }, index) => {
            const isActive = sections.theme === value;
            const isLast = index === MOBILE_MENU_THEME_OPTIONS.length - 1;
            const OptionIcon = THEME_OPTION_ICONS[value];
            return (
              <button
                key={value}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => sections.handleThemeSelect(value)}
                className={cn(rowButtonClass, !isLast && rowDividerClass, isActive && "bg-primary/5")}
              >
                <span className={rowIconClass} aria-hidden>
                  <OptionIcon className="size-5" />
                </span>
                <span className={cn(rowLabelClass, "font-semibold")}>{t(labelKey)}</span>
              </button>
            );
          })}
        </div>
      </PickerSheet>

      <UpcomingFeatureModal
        open={sections.isUpcomingFeatureOpen}
        onClose={sections.closeUpcomingFeature}
        icon={sections.upcomingFeatureIcon}
      />
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
                />
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
    </>
  );
}
